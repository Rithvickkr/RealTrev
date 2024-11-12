"use server"
import prisma from "@repo/db/client";
export default async function changerole(session: { user: { email: any; }; }) {
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email
    }
  });
  if (!user) {
    throw new Error("User not found");
  }
  const updatedUser = await prisma.user.update({
    where: {
      id: user.id
    },
    data: {
     role: user.role === "TRAVELLER" ? "LOCAL" : "TRAVELLER"
    }
  });
  return updatedUser;
}