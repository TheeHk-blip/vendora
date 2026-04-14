import { Buyer, Order, Plan, shippingConfig, Subscription, Variant, type ICategory, type IOrder, type IProduct, type ISubscription, type IVariant } from "@vendora/db/backend";
import { nanoid } from "nanoid";

interface IPaymentContext {
  amountToPay: number;
  phoneNumber: string;
  accountReference: string;
  transactionDesc: string;
  order?: IOrder | null;
  subscription?: ISubscription | null;
}

interface IBody {
  type: "order" | "subscription";
  formData: {
    firstName: string;
    lastName: string;
    county: string;
    subCounty: string;
    ward: string;
    phone: string;  
  };
  orderItems: {
    name: string;
    variantId: string;
    quantity: number;
    merchant: string;
    merchantId: string;
  }[];
  buyerId: string;
  orderId: string;
  buyerEmail: string;
  checkoutSelection: "partial" | "upfront";
  paymentMethod: "card" | "mpesa";
  planSlug: string;
  sellerId: string;
  phone: string;
}

interface PopulatedPlan {
  slug: string
}

type PopulatedProduct = Omit<IVariant, "productId"> & {
  productId: Omit<IProduct, "categoryId"> & {
    categoryId: ICategory
  }
}

interface IOrderItems {
  name: string;
  variantId: string;
  quantity: number;
  merchant: string;
  merchantId: string;
}

const formatPhoneNumber = (phone: string) => {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) cleaned = "254" + cleaned.slice(1);
  if (cleaned.startsWith("7") || cleaned.startsWith("1")) cleaned = "254" + cleaned;
  if (cleaned.startsWith("+")) cleaned = cleaned.substring(1);
  return cleaned;
};

export const preparePaymentData = async (body: IBody): Promise<IPaymentContext> => {
  const { type, formData, orderItems, buyerId, orderId, buyerEmail, checkoutSelection, paymentMethod, planSlug, sellerId, phone } = body;
  let phoneNumber;       
  let amountToPay;
  let accountReference;
  let transactionDesc;
  const shipping = () => {
    const rate  = shippingConfig.county.find(c => c.name === formData.county);
    return rate?.shippingRate ?? 1500
  } 
  if (type === "subscription") {    
    let subscription;    
    const plan = await Plan.findOne({ slug: planSlug }).orFail(new Error("Invalid Plan"));
    amountToPay = plan.price;
    phoneNumber = formatPhoneNumber(phone);
    accountReference = `SUB-${plan.slug.toUpperCase()}`;
    transactionDesc = `Vendora ${plan.name} Subscription`;

    const existingSub = await Subscription.findOne({ subscriberId: sellerId, status: "active" })
      .populate<{ plan: PopulatedPlan }>([
        {
          path: "plan",
          model: "Plan",
          select: "slug"
        }
      ]);          
    const isRenewal = existingSub && existingSub.plan.slug === planSlug;

    if (existingSub) {
      if (isRenewal) {                       
        subscription = await Subscription.findOneAndUpdate(
          { _id: existingSub._id, status: "active" },
          {$set: { status: "renewed", plan: plan._id }},
          { new: true }
        );
      } else {
        subscription = await Subscription.findOneAndUpdate(
          { _id: existingSub._id, status: "active" },
          {$set: { status: "upgraded", metadata: { upgradeId: plan._id, action: "upgrade" } }},
          { new: true }
        )
      }    
    } else {
      subscription = await Subscription.create({
        subscriberId: sellerId,
        plan: plan._id,
        status: "pending"
      }) 
    };

    return { amountToPay, phoneNumber, accountReference, transactionDesc, subscription }
  }

  if (type === "order") {
    try {
      let order;
      if (orderId) {
        order = await Order.findById(orderId).orFail(new Error("Order not found!"));  
        return {
          order,
          phoneNumber: formatPhoneNumber(order.buyer.phone),
          amountToPay: order.financials.balanceDue,
          accountReference: order.orderNumber,
          transactionDesc: "Balance Payment"
        }             
      } else {
        Buyer.findOneAndUpdate(
          { userId: buyerId },
          {
            $set: {
              phoneNumber: formData.phone,
              shippingAddress: {
                county: formData.county,
                subCounty: formData.subCounty,
                ward: formData.ward
              }
            }
          },
          {
            new: true,
            setDefaultsOnInsert: true
          }
        ).exec();

        const variantIds = orderItems.map((item) => item.variantId);        
        const dbVariants = await Variant.find({ _id: {$in: variantIds }})
          .populate([
            {
              path: "productId",
              model: "Product",
              select: "categoryId",
              populate: {
                path: "categoryId",
                model: "Category",
                select: "slug"
              }
            }
          ])
          .lean<IVariant[]>();
        const variantMap = new Map<string, IVariant>(dbVariants.map((v: IVariant) => [v._id.toString(), v])); 

        const sellerIds = [...new Set(orderItems.map((item) => item.merchantId))];
        const sellerPlans = new Map();

        for (const sId of sellerIds) {
          const sub = await Subscription.findOne({ subscriberId: sId, status: "active" })
            .populate([
              {
                path: "plan",
                model: "Plan",
                select: "slug"
              }
            ])
            .lean<ISubscription>();
          sellerPlans.set(sId.toString(), sub?.plan || await Plan.findOne({ slug: "basic" }).lean());
        }

        let totalProductValue = 0;    
        let totalPlatformRevenue = 0;
        let balanceDue: number;  

        const stockUpdates = orderItems.map((item: IOrderItems) => ({
          updateOne: {
            filter: { _id: item.variantId, stock: { $gte: item.quantity }},
            update: { $inc: { stock: -item.quantity }}
          }
        }));

        await Variant.bulkWrite(stockUpdates);

        const verifiedItems = orderItems.map(( item: IOrderItems ) => {
          const dbVar = variantMap.get(item.variantId) as unknown as PopulatedProduct;
          if (!dbVar) throw new Error(`Product variant ${item.variantId} not found`);

          const plan = sellerPlans.get(item.merchantId.toString());
          const categoryName = dbVar.productId?.categoryId?.slug || "";
          const isFashion = categoryName === "fashion";
          const rate = isFashion ? plan.fashionCommission : plan.commission;

          const itemTotal = dbVar.price * item.quantity;
          const itemRevenue = itemTotal * rate;

          totalProductValue += itemTotal;
          totalPlatformRevenue += itemRevenue;

          return {
            variantId: dbVar._id,
            name: item.name,
            price: dbVar.price,
            quantity: item.quantity,
            itemRevenue: itemRevenue,
            appliedCommission: rate,
            seller: {
              sellerId: item.merchantId,
              storeName: item.merchant,
              sellerPayout: itemTotal - itemRevenue              
            },
            deliveryToHub: { status: "pending" }
          };
        });

        if (checkoutSelection === "partial") {
          amountToPay = shipping();
          balanceDue = totalProductValue;
        } else {
          amountToPay = totalProductValue + shipping();
          balanceDue = 0;
        }

        phoneNumber = formatPhoneNumber(formData.phone);
        order = await Order.create({
          orderNumber: `VEN-${nanoid(8).toUpperCase()}`,
          paymentType: checkoutSelection,   
          paymentMethod: paymentMethod,     
          buyer: {
            buyerId: buyerId,
            email: buyerEmail,
            phone: formData.phone,
            name: `${formData.firstName} ${formData.lastName}`,
            location: {
              county: formData.county,
              subCounty: formData.subCounty,
              ward: formData.ward
            }
          },
          items: verifiedItems,
          financials: {
            totalProductValue,
            commitmentFee: amountToPay,
            balanceDue,            
            platformRevenue: totalPlatformRevenue,
            sellerPayout: totalProductValue - totalPlatformRevenue,
            commissionRate: totalPlatformRevenue / totalProductValue
          },
          payments: {
            commitment: {
              status: "pending",           
            },
            balance: {         
              status: balanceDue === 0 ? "paid" : "pending"
            }
          },
          status: "awaitingCommitment"
        });

        return {
          order,
          amountToPay: order.financials.commitmentFee,
          phoneNumber: formatPhoneNumber(order.buyer.phone),
          accountReference: order.orderNumber,
          transactionDesc: `Order Purchase: ${order.orderNumber}`
        }
      }

    } catch (error) {
      console.error("Couldn't initiate payment", error);    
    }    
  }

  throw new Error("Invalid payment type");
}