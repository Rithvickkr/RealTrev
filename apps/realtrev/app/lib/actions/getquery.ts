"use server";
import prisma from "@repo/db/client";

const haversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

export default async function getQuery(
  lat: number,
  lon: number,
  radius: number,
  userId: string
) {
  // Make sure latitude and longitude are present
  if (!lat || !lon) {
    console.error("errr");
    throw new Error();
  }

  // Convert lat and lon to numbers
  const userLat = lat;
  const userLon = lon;
  const radiusKm = radius || 5; // Default to 5 km if no radius is provided

  // Fetch all locations from the database
  const locations = await prisma.location.findMany();

  // Filter locations within the radius
  const nearbyLocations = locations.filter((location:any) => {
    const distance = haversineDistance(
      userLat,
      userLon,
      location.latitude,
      location.longitude
    );
    return distance <= radiusKm; // Keep locations within the radius
  });

  // Fetch queries for the nearby locations, excluding those submitted by the user
  const nearbyQueries = await prisma.query.findMany({
    where: {
      locationId: {
        in: nearbyLocations.map((location:any) => location.id),
      },
      travelerId: {
        not: userId,
      },
    },
    include: {
      location: true,
      traveler: true,
    },
  });

  // Calculate and add the distance for each query location
  const result = nearbyQueries.map((query:any) => {
    const location = query.location;
    const distance = haversineDistance(
      userLat,
      userLon,
      location.latitude,
      location.longitude
    );
    return { ...query, distance }; // Add distance to each query object
  });

  console.error(result.length);
  return result; // Return the filtered queries
}
