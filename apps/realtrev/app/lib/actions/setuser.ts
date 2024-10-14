"use server";
import prisma from "@repo/db/client";

export default async function setUser(data: any) {
    const user = await prisma.user.findUnique({
        where: {
            email: data.email,
        },
    });
    if (user) {
        throw new Error("User already exists");
    }

  const createduser = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
        password: data.password,
    },
  });
  return createduser;
}