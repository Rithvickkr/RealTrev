"use server";

import prisma from "@repo/db/client";

export async function fetchUpdates(
  location: { latitude: number; longitude: number },
  radius: number = 5000
) {
  const { latitude, longitude } = location;

  try {
    // Query updates with likes and dislikes counts
    const updates = await prisma.$queryRaw`
      SELECT 
        u.*,
        COALESCE(like_count.count, 0) AS likes,
        COALESCE(dislike_count.count, 0) AS dislikes
      FROM "Updates" u
      LEFT JOIN (
        SELECT "updateId", COUNT(*) AS count
        FROM "Like"
        GROUP BY "updateId"
      ) like_count ON like_count."updateId" = u.id
      LEFT JOIN (
        SELECT "updateId", COUNT(*) AS count
        FROM "Dislike"
        GROUP BY "updateId"
      ) dislike_count ON dislike_count."updateId" = u.id
      WHERE ST_DistanceSphere(
        ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326),
        ST_SetSRID(ST_GeomFromGeoJSON(u.coordinates::text), 4326)
      ) <= ${radius};
    `;

    return updates;
  } catch (error) {
    console.error("Error fetching updates:", error);
    throw new Error("Failed to fetch updates. Please try again later.");
  }
}
