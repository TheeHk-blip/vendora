import { authOptions } from "@vendora/auth";
import { connectDB, IVariant } from "@vendora/db";
import { Variant, Product } from "@vendora/db";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
  await connectDB()
  const session = await getServerSession(authOptions);

  if (!session?.user._id) {
    return NextResponse.json({ error: "Unauthorized"}, {status: 401});
  }

  const sellerId = session.user._id;
  const body = await request.json();

  // Start Mongoose session for Atomicity
  const dbSession = await mongoose.startSession();
  dbSession.startTransaction();

  try {
    const { 
      name, 
      images, 
      description, 
      price, 
      discount, 
      discountedPrice, 
      dynamicFields,
      categoryId,   
      variants         
    } = body;

    const [product] = await Product.create([{
      name,
      images,
      description,
      price,
      discount,
      discountedPrice,
      fields: dynamicFields,
      categoryId,
      sellerId: sellerId,
      tenantId: sellerId,
      status: "pending"
    }], { session: dbSession });

    // Create child variants linked to the new Product ID
    if (variants && Array.isArray(variants) && variants.length > 0) {
      const variantsToCreate = variants.map((v: IVariant) => ({
        productId: product._id,
        sku: v.sku,
        price: Number(v.price) || price,
        stock: Number(v.stock) || 0,
        color: v.color || "",
        image: v.image || [],
        attributes: v.attributes
      }));
      
      await Variant.insertMany(variantsToCreate, {
        session: dbSession ,
        ordered: true
      });
    }
    
    await dbSession.commitTransaction();
    dbSession.endSession();

    return NextResponse.json({product}, {status: 201})

  } catch (error) {
    await dbSession.abortTransaction();
    dbSession.endSession();

    console.error("Product creation failed:", error)
    return NextResponse.json({ error: "Product creation failed. Please try again later."}, {status: 400})
  }
}