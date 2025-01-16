"use server"
import prisma from "@repo/db/client";

export async function getUserDetails(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                trevCoins: true,
                transactions: {
                    select: {
                        id: true,
                        type: true,
                        amount: true,
                        description: true,
                        createdAt: true,
                    },
                },
            },

        });
        return user;
    } catch (error) {
        console.error('Error fetching user details:', error);
        throw error;
    } 
}