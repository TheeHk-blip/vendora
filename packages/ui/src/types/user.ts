
export interface Users {
  _id: string;
  role: string;
  name: string;
  email: string;
  image?: string;
  password?: string;
  hasPassword?: boolean;
}