"use server"
import prisma from "@repo/db/client";
export default async function knowTheQuery(queryId: string) {
    const response = await prisma.query.findUnique({
        where: {
            id: queryId,
        },
        select: {
            
            responderId: true,
            travelerId: true,
            responder: {
                select: {
                    name: true,
                    email: true,
                },
            },
            traveler: {
                select: {
                    name: true,
                    email: true,
                },
            },
            location: true,
        },

            
    });
    if (response) {
        console.log("Query found");
        return response;
    }
    console.log("Query not found");
    return null;
}
