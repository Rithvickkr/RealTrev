"use server"
import prisma from "@repo/db/client";   

export default async function getTrevQuery(session: any) {

    const trevquries = await prisma.query.findMany({
        where: {
            travelerId: session.user.id,
            status: "PENDING",
            
        },
    });
    if (trevquries) {
        console.log(trevquries.length + " queries found"); 
        return trevquries;
    }
    console.log("Query not found");
    return false;

   

}
