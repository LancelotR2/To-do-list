// types/next-auth.d.ts
import NextAuth from "next-auth";
import { User as NextAuthUser } from "next-auth";
import { Session } from "next-auth";

// Extend the default NextAuth User type
declare module "next-auth" {
  interface User {
    username: string; // Add the username field
  }

  interface Session {
    user: {
      name: string;
      username: string; // Add the username field to the session object
    };
  }
}
