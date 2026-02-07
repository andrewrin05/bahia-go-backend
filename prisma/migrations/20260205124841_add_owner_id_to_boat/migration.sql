/*
  Warnings:

  - Added the required column `ownerId` to the `Boat` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Boat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "price" REAL NOT NULL,
    "pricePerDay" REAL NOT NULL DEFAULT 0,
    "location" TEXT NOT NULL,
    "neighborhood" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "capacity" INTEGER NOT NULL,
    "imageUrl" TEXT,
    "images" TEXT,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "Boat_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Boat" ("available", "capacity", "createdAt", "description", "id", "imageUrl", "images", "latitude", "location", "longitude", "name", "neighborhood", "price", "pricePerDay", "published", "type", "updatedAt") SELECT "available", "capacity", "createdAt", "description", "id", "imageUrl", "images", "latitude", "location", "longitude", "name", "neighborhood", "price", "pricePerDay", "published", "type", "updatedAt" FROM "Boat";
DROP TABLE "Boat";
ALTER TABLE "new_Boat" RENAME TO "Boat";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
