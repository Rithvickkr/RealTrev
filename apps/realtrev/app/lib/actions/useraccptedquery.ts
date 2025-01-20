"use server"
import prisma from "@repo/db/client";

async function getUserAcceptedAndResolvedQueries(userId: string) {
    try {
        const queries = await prisma.query.findMany({
            where: {
                AND: [
                    { responderId: userId },
                    { status: { in: ['RESOLVED', 'ACCEPTED'] } }
                ] 
            },
            include: {
                location: true,
                traveler : true
            }
        });
        return queries;
    } catch (error) {
        console.error('Error fetching queries:', error);
        throw error;
    } 
}

export default getUserAcceptedAndResolvedQueries;