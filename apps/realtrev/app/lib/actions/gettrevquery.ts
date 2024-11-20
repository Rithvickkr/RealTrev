"use server"
import prisma from "@repo/db/client";   

export default async function getTrevQuery(session: any) {
  try {
    const trevqueries = await prisma.query.findMany({
      where: {
        travelerId: session.user.id,
      },
    });

    if (trevqueries ) {
      console.log(trevqueries.length + " queries found");
      return trevqueries;
    }

    console.log("No queries found for traveler");
    return [];  // Return an empty array when no queries are found

  } catch (error) {
    console.error("Error fetching queries:", error);
    return [];  // Return an empty array on error to avoid breaking the app
  }
}
