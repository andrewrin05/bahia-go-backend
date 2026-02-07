-- CreateTable
CREATE TABLE "BookingDaytrip" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
