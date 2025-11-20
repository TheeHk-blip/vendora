export interface BuyerDetails {
  shippingAddresses?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  }[];
  phoneNumber?: string;
  preferences?: {
    notifications?: boolean;
    newsletter?: boolean;
  };
}

export interface SellerDetails {
  businessName?: string;
  businessAddress?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  taxId?: string;
  businessPhone?: string;
  businessEmail?: string;
  paymentDetails?: {
    accountHolder: string;
    bankName: string;
    accountNumber: string;
    routingNumber: string;
  };
}