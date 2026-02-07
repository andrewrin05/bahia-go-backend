/*
  Warnings:

  - Added the required column `bookingNumber` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bookingNumber` to the `BookingDaytrip` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bookingNumber" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "boatId" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "totalPrice" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'COP',
    "paymentProvider" TEXT DEFAULT 'none',
    "paymentReference" TEXT,
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    "paymentCheckoutUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Booking_boatId_fkey" FOREIGN KEY ("boatId") REFERENCES "Boat" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Booking" ("boatId", "createdAt", "currency", "endDate", "id", "paymentCheckoutUrl", "paymentProvider", "paymentReference", "paymentStatus", "startDate", "status", "totalPrice", "updatedAt", "userId") SELECT "boatId", "createdAt", "currency", "endDate", "id", "paymentCheckoutUrl", "paymentProvider", "paymentReference", "paymentStatus", "startDate", "status", "totalPrice", "updatedAt", "userId" FROM "Booking";
DROP TABLE "Booking";
ALTER TABLE "new_Booking" RENAME TO "Booking";
CREATE UNIQUE INDEX "Booking_bookingNumber_key" ON "Booking"("bookingNumber");
CREATE TABLE "new_BookingDaytrip" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bookingNumber" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "daytripId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "totalPrice" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'COP',
    "paymentProvider" TEXT DEFAULT 'none',
    "paymentReference" TEXT,
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    "paymentCheckoutUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BookingDaytrip_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BookingDaytrip_daytripId_fkey" FOREIGN KEY ("daytripId") REFERENCES "Daytrip" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_BookingDaytrip" ("createdAt", "currency", "daytripId", "id", "paymentCheckoutUrl", "paymentProvider", "paymentReference", "paymentStatus", "status", "totalPrice", "updatedAt", "userId") SELECT "createdAt", "currency", "daytripId", "id", "paymentCheckoutUrl", "paymentProvider", "paymentReference", "paymentStatus", "status", "totalPrice", "updatedAt", "userId" FROM "BookingDaytrip";
DROP TABLE "BookingDaytrip";
ALTER TABLE "new_BookingDaytrip" RENAME TO "BookingDaytrip";
CREATE UNIQUE INDEX "BookingDaytrip_bookingNumber_key" ON "BookingDaytrip"("bookingNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
