import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { connectDB } from "@vendora/db";
import User from "@vendora/db/src/models/users";

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

        if (!user || !user.password) throw new Error("User not found");

        const isValid = await bcrypt.compare(credentials!.password, user.password);
        if (!isValid) throw new Error("invalid Password");

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    })
  ],

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 12, // 12 hours
  },

  jwt: {
    maxAge: 60 * 60 * 24 * 14, // 14 days
  },

  callbacks: {
    async signIn({ user }) {
      await connectDB();

      let dbUser = await User.findOne({ email: user.email });

      if (!dbUser) {
        dbUser = await User.create({
          name: user.name,
          email: user.email,
          role: user.role
        })
      }

      user.hasPassword = dbUser.password;
      user.id = dbUser._id.toString();
      user.role = dbUser.role;

      return true;
    },

    async jwt({ token, user }) {
      await connectDB();

      if (user) {
        token.hasPassword = user.hasPassword;
        token.id = user.id;
        token.role = user.role;
      }

      if (token.email) {
        const dbUser = await User.findOne({ email: token.email });

        if (dbUser) {
          token.role = dbUser.role;
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user.hasPassword = Boolean(token.hasPassword);

      if (token) {
        session.user.role = token.role as string;
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