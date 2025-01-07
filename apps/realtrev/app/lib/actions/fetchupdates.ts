"use server"

import prisma from "@repo/db/client";

export async function fetchUpdates(location: { latitude: number; longitude: number }) {
    const { latitude, longitude } = location;
  const radius = 5000; // 100 meters
    const updates = await prisma.$queryRaw`
      SELECT *
      FROM "Updates"
      WHERE ST_Distance(
        ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326),
        ST_SetSRID(ST_GeomFromGeoJSON(coordinates::text), 4326)
      ) <= ${radius}
    `;
  
    return updates;
  }
  
