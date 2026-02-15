import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { clientPromise, connectDB } from "../../db";
import User from "../../db/src/models/user";
import Seller from "../../db/src/models/seller";
import Buyer from "../../db/src/models/buyer";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { Adapter } from "next-auth/adapters";

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true      
    }),

    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email"},
        password: { label: "Password", type: "password"}
      },

      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ email: credentials?.email });

        if (!user || !user.email) throw new Error("User not found");

        const isValid = await bcrypt.compare(credentials!.password, user.password);
        if (!isValid) throw new Error("Invalid Email or Password");

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
          hasPassword: Boolean(user.password),
        }
      }
    })
  ],

/*  cookies: {
    sessionToken: {
      name:"_Secure-next-auth.session.token",
      options: {
        domain: ".vendora.sbs",
        path: "/",
        secure: true,
        sameSite: "lax",
        httpOnly: true,
      }      
    }
  },
*/
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 1 day(s)
    updateAge: 60 * 60 * 6 // 6 hrs
  },

  jwt: {
    maxAge: 60 * 60 * 24 * 7, // 7 days(s)
  },

  callbacks: {
    async signIn({ user, profile, account }) {
      if (account?.provider === "google") {
        await connectDB();  

        const cookieStore = await cookies();
        const role = cookieStore.get("vendora_role")?.value;
  
        const dbUser = await User.findOneAndUpdate(            
          { email: user.email },            
          { 
            role: role,
            $setOnInsert: { image: user.image },
            name: user.name || profile?.name
          },
          { upsert: true, new: true}
        );

        if (role) {                 
          // Use parallelization for User and Role creation
          await Promise.all([
            User.findOneAndUpdate({ email: user.email}, {role}),
            role === "seller"
            ? Seller.findOneAndUpdate(
              { userId: dbUser.id},
              { $setOnInsert: { userId: dbUser.id, businessName: user.name || "unnamed store"}},
              { upsert: true }
            )
            : role === "buyer"
            ? Buyer.findOneAndUpdate(
              { userId: dbUser.id },
              { $setOnInsert: { userId: dbUser.id }},
              { upsert: true }
            )
            : Promise.resolve()
          ]);
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      // First login: copy user props into token
      if (user) {      
        token.id = user.id;
        token.role = user.role;
        token.image = user.image;
        token.hasPassword = user.hasPassword;               
      }          

      // If role is missing, fetch it once from DB
      if (!token.role && token.email) {
        await connectDB();
        const dbUser = await User.findOne({ email: token.email}).select(" role image password");
        if (dbUser) {
          token.role = dbUser.role;
          token.image = dbUser.image;
          token.hasPassword = Boolean(dbUser.hasPassword);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user._id = token.id as string;
        session.user.role = token.role as string;
        session.user.image = token.image as string;
        session.user.hasPassword = Boolean(token.hasPassword)
      }

      return session;
    }
  },

  pages: {
    signIn: "/signin"
  },

  secret: process.env.NEXTAUTH_SECRET,

}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST};