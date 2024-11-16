import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials";

import bcrypt from "bcryptjs";


export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", required: true },
        password: { label: "Password", type: "password", required: true },
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Missing email or password");
        }

        const existingUser = await db.user.findFirst({
          where: { email: credentials.email },
        });

        if (existingUser) {
          const passwordValidation = await bcrypt.compare(
            credentials.password,
            existingUser.password
          );
          if (passwordValidation) {
            return {
              id: existingUser.id,
              name: existingUser.name,
              email: existingUser.email,
              role: existingUser.role,
            };
          }
          throw new Error("Invalid credentials");
        }

        // Register a new user
        const hashedPassword = await bcrypt.hash(credentials.password, 10);
        const newUser = await db.user.create({
          data: {
            email: credentials.email,
            password: hashedPassword,
            name: credentials.name || "Unknown",
            role: "TRAVELLER",
          },
        });

        return {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ token, session }: { token: any; session: any }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
    newUser: "/explore",
  },
};
