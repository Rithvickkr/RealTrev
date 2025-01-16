"use server";
import prisma from "@repo/db/client";

async function rateAndResolveQuery(queryId: string, stars: number) {
  try {
    // Validate the stars input
    if (stars < 1 || stars > 5) {
      throw new Error("Invalid star rating. Must be between 1 and 5.");
    }

    // Fetch query details with related responder
    const query = await prisma.query.findUnique({
      where: { id: queryId },
      include: { responder: true },
    });

    if (!query) {
      throw new Error("Query not found.");
    }

    if (query.status === "RESOLVED") {
      throw new Error("Query is already resolved.");
    }

    // Calculate reward based on star rating
    const baseReward = 50; // Base Trev Coins reward for 5 stars
    const rewardMultiplier = stars / 5; // Scale reward based on stars
    const rewardAmount = Math.ceil(baseReward * rewardMultiplier);

    // Update query status and add the star rating
    const updatedQuery = await prisma.query.update({
      where: { id: queryId },
      data: {
        status: "RESOLVED",
        stars: stars, // Assuming you add `stars` as a new field in Query model
      },
    });

    // Update responder's Trev Coins and log the transaction
    if (query.responderId) {
      await prisma.user.update({
        where: { id: query.responderId },
        data: {
          trevCoins: { increment: rewardAmount },
          transactions: {
            create: {
              type: "EARNED",
              amount: rewardAmount,
              description: `Reward for resolving query ${queryId} with ${stars} stars`,
            },
          },
        },
      });
    }

    return { updatedQuery, rewardAmount };
  } catch (error) {
    console.error("Error resolving query and rewarding coins:", error);
    throw error;
  }
}

export { rateAndResolveQuery };
