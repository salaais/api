/*
  Warnings:

  - You are about to drop the column `numero_bloco` on the `Bloco` table. All the data in the column will be lost.
  - You are about to drop the column `abreviacao` on the `Curso` table. All the data in the column will be lost.
  - You are about to drop the column `abreviacao` on the `Materia` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Permissao` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Regra` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `TipoLogin` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[key]` on the table `Bloco` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_curso,key]` on the table `Bloco` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[key]` on the table `Curso` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[key]` on the table `Materia` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_bloco,id_materia]` on the table `MateriaBloco` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[key]` on the table `Permissao` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[key]` on the table `Questao` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[key]` on the table `Regra` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[key]` on the table `TipoLogin` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `key` to the `Bloco` table without a default value. This is not possible if the table is not empty.
  - Added the required column `key` to the `Curso` table without a default value. This is not possible if the table is not empty.
  - Added the required column `key` to the `Materia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descricao` to the `Permissao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `key` to the `Permissao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `key` to the `Questao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descricao` to the `Regra` table without a default value. This is not possible if the table is not empty.
  - Added the required column `key` to the `Regra` table without a default value. This is not possible if the table is not empty.
  - Added the required column `key` to the `TipoLogin` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Curso_abreviacao_key";

-- DropIndex
DROP INDEX "Permissao_name_key";

-- DropIndex
DROP INDEX "Regra_name_key";

-- DropIndex
DROP INDEX "TipoLogin_nome_key";

-- AlterTable
ALTER TABLE "Bloco" DROP COLUMN "numero_bloco",
ADD COLUMN     "key" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Curso" DROP COLUMN "abreviacao",
ADD COLUMN     "key" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Materia" DROP COLUMN "abreviacao",
ADD COLUMN     "key" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Permissao" DROP COLUMN "name",
ADD COLUMN     "descricao" TEXT NOT NULL,
ADD COLUMN     "key" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Questao" ADD COLUMN     "key" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Regra" DROP COLUMN "name",
ADD COLUMN     "descricao" TEXT NOT NULL,
ADD COLUMN     "key" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TipoLogin" DROP COLUMN "nome",
ADD COLUMN     "key" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Bloco_key_key" ON "Bloco"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Bloco_id_curso_key_key" ON "Bloco"("id_curso", "key");

-- CreateIndex
CREATE UNIQUE INDEX "Curso_key_key" ON "Curso"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Materia_key_key" ON "Materia"("key");

-- CreateIndex
CREATE UNIQUE INDEX "MateriaBloco_id_bloco_id_materia_key" ON "MateriaBloco"("id_bloco", "id_materia");

-- CreateIndex
CREATE UNIQUE INDEX "Permissao_key_key" ON "Permissao"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Questao_key_key" ON "Questao"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Regra_key_key" ON "Regra"("key");

-- CreateIndex
CREATE UNIQUE INDEX "TipoLogin_key_key" ON "TipoLogin"("key");
