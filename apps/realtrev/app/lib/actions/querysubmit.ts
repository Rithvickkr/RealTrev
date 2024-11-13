"use server"
import prisma from "@repo/db/client";

export default async function submitQuery(travelerId: string, locationName: string, queryText: string, latitude: number, longitude: number) {
  try {
    // Check if the location exists by name
    let location = await prisma.location.findFirst({
      where: { name: locationName },
    });

    // If location doesn't exist, create a new location
    if (!location) {
      console.log(`Location "${locationName}" not found, creating new location...`);
      location = await prisma.location.create({
        data: {
          name: locationName,
          latitude: latitude,  // Coordinates passed to the function
          longitude: longitude,
        },
      });
      console.log(`Location created: ${locationName}`);
    }

    // Create the query and associate it with the traveler and location
    const query = await prisma.query.create({
      data: {
        travelerId: travelerId,  // The ID of the traveler (this should be passed in)
        locationId: location.id, // The ID of the location (either found or newly created)
        queryText: queryText,    // The query text
        status: 'PENDING',       // The default status for a new query
      },
    });

    return query; // Return the newly created query
  } catch (error) {
    console.error(error);
    throw error;
  }
}

