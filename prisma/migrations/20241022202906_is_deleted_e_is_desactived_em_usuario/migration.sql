/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `isDesactived` on the `Usuario` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "isDeleted",
DROP COLUMN "isDesactived",
ADD COLUMN     "deletado" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "desativado" BOOLEAN NOT NULL DEFAULT false;
