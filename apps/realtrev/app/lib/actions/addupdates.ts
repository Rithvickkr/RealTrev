"use server";
import { Severity } from "@prisma/client";
import prisma from "@repo/db/client";

export async function addUpdate(
  title: string,
  description: string,
  latitude: number,
  longitude: number,
  userId: string,
  severity?: Severity // Severity must be one of the enum values (LOW, MEDIUM, HIGH)
) {
  try {
    if (severity && !Object.values(Severity).includes(severity)) {
      throw new Error("Invalid severity value");
    }

    const result = await prisma.$executeRawUnsafe(`
      INSERT INTO "Updates" ("title", "description", coordinates, severity, "userId", timestamp)
      VALUES (
        '${title}',
        '${description}',
       ST_AsGeoJSON(ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326))::jsonb, 
        ${severity ? `'${severity}'` : null},
        '${userId}', -- Make sure userId is treated as a string
        NOW()
      )
    `);

    return result;
  } catch (error) {
    console.error("Error adding update:", error);
    throw error;
  }
}
