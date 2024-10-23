-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isDesactived" BOOLEAN NOT NULL DEFAULT false;
