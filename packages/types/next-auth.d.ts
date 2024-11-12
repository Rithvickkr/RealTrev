import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;  // Add role to Session type
    };
  }

  interface User {
    role?: string; // Add role to User type
  }
}
