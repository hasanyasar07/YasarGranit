-- CreateTable
CREATE TABLE "OrnekUrun" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrnekUrun_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrnekUrun" ADD CONSTRAINT "OrnekUrun_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
