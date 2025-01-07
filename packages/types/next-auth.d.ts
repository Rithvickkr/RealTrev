import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string | null;  // Define the id type here
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string  | null;  // Add role to Session type
    };
  }

  interface User {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null// Add role to User type
    
  }
}

// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string;  // Define the id type here
//       name: string | null;
//       email: string | null;
//       image: string | null;
//       role: string | null;  // If you're using roles
//     }& DefaultSession['user'];
//   }
// }
// import { DefaultSession } from "next-auth";
// import "next-auth/jwt";
// import "next-auth"

// type UserId = string;

// declare module "next-auth/jwt" {
//   interface JWT {
//     id: UserId;
//     userImage : string ,
//     role : string,
    
//   }
// }

// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string;  // Define the id type here
//       name: string | null;
//       email: string | null;
//       image: string | null;
//       role: string | null;  // If you're using roles
//     }& DefaultSession['user'];
//   }
// }
