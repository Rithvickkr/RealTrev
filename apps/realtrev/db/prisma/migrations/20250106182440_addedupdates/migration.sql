-- CreateTable
CREATE TABLE "locationupdates" (
    "id" SERIAL NOT NULL,
    "locationId" INTEGER NOT NULL,
    "update" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "guideid" TEXT NOT NULL,

    CONSTRAINT "locationupdates_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "locationupdates" ADD CONSTRAINT "locationupdates_guideid_fkey" FOREIGN KEY ("guideid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locationupdates" ADD CONSTRAINT "locationupdates_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
