import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

type Role = "TRAVELLER" | "GUIDE";

const Roles: { [key in Role]: key } = {
  TRAVELLER: "TRAVELLER",
  GUIDE: "GUIDE",
};

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
        try {
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

          const hashedPassword = await bcrypt.hash(credentials.password, 10);
          const newUser = await db.user.create({
            data: {
              email: credentials.email,
              password: hashedPassword,
              name: credentials.name || "Unknown",
              role: Roles.TRAVELLER,
            },
          });

          return {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
          };
        } catch (error) {
          if (error instanceof Error) {
            console.error("Authorization Error:", error.message);
          } else {
            console.error("Authorization Error:", error);
          }
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token }: { token: any }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email || "",
        },
      });

      if (!dbUser) {
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
      };
    },
  
    async session({ token, session }: { token: any; session: any }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id,
          name: token.name,
          email: token.email,
          role: token.role,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
    newUser: "/explore",
  },
};
