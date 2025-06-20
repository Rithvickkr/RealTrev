"use server";

import prisma from "@repo/db/client";

enum QueryStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

export default async function setResponseQ(session: any, queryId: string) {
  const response = await prisma.query.findUnique({
    where: {
      id: queryId,
    },
  });
  if (response) {
    if (response.status === QueryStatus.PENDING) {
      await prisma.query.update({
        where: {
          id: queryId,
        },
        data: {
          status: "ACCEPTED",
          responderId: session.user.id,
        },
      });
      console.log("Query responded to");
      return true;
    }
  }
  console.log("Query not found or already responded to");
  return false;
}
