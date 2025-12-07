import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { connectDB } from "../../db";
import User from "../../db/src/models/user";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
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

  cookies: {
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
  
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 1 day(s)
    updateAge: 60 * 60 * 6 // 6 hrs
  },

  jwt: {
    maxAge: 60 * 60 * 24 * 7, // 7 days(s)
  },

  callbacks: {
    async signIn({ user, profile }) {
      await connectDB();

      let dbUser = await User.findOne({ email: user.email });
    
      if (!dbUser) {
        dbUser = await User.create({
          name: user.name || profile?.name,
          email: user.email,
          image: user.image,
          role: user.role,
        });    
      } 
            
      user.hasPassword = dbUser.password;
      user.id = dbUser._id.toString();
      user.role = dbUser.role;
      user.image = dbUser.image;
  
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

      // If role is missing, fetch it once form DB
      if (!token.role && token?.email) {
        await connectDB();
        const dbUser = await User.findOne({ email: token.email});
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