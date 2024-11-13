import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;  // Define the id type here
      name: string | null;
      email: string | null;
      image: string | null;
      role: string | null;  // If you're using roles
    };
  }
}
