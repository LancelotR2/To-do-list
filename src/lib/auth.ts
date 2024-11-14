import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";


export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();


        const user = await User.findOne({
          username: credentials?.username,
        }).select("+password");


        if (!user || !user.username) {
          throw new Error("Wrong username");
        }


        const passwordMatch = await bcrypt.compare(
          credentials!.password,
          user.password
        );

        if (!passwordMatch) {
          throw new Error("Wrong password");
        }


        return { id: user._id.toString(), username: user.username };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username as string; 
      }
      return token;
    },

   
    async session({ session, token }) {
      if (token?.username) {
        session.user.username = token.username as string; 
      }
      return session;
    },
  },
};
