import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Define your authOptions using NextAuthOptions
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

        // Find the user by username and select the password field
        const user = await User.findOne({
          username: credentials?.username,
        }).select("+password");

        // Ensure user is found and has a valid username
        if (!user || !user.username) {
          throw new Error("Wrong username");
        }

        // Compare the entered password with the stored hashed password
        const passwordMatch = await bcrypt.compare(
          credentials!.password,
          user.password
        );

        if (!passwordMatch) {
          throw new Error("Wrong password");
        }

        // Return user data with proper types (casting user to `UserDocument`)
        return { id: user._id.toString(), username: user.username }; 
      },
    }),
  ],

  session: {
    strategy: "jwt", // Use JWT for session management
  },

  callbacks: {
    // JWT callback: Add user data to the JWT token
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username as string; // Cast to string
      }
      return token;
    },

    // Session callback: Set the username from the JWT token to the session object
    async session({ session, token }) {
      if (token?.username) {
        session.user.username = token.username as string; // Cast to string
      }
      return session;
    },
  },
};
