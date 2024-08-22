/*
  Warnings:

  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductEnumKey` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductImageCompacted` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductKey` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductSpecificationTable` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductTopicKey` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductTopicValue` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductValue` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductImage" DROP CONSTRAINT "ProductImage_product_id_fkey";

-- DropForeignKey
ALTER TABLE "ProductImageCompacted" DROP CONSTRAINT "ProductImageCompacted_product_id_fkey";

-- DropForeignKey
ALTER TABLE "ProductSpecificationTable" DROP CONSTRAINT "ProductSpecificationTable_product_id_fkey";

-- DropForeignKey
ALTER TABLE "ProductTopicValue" DROP CONSTRAINT "ProductTopicValue_product_id_fkey";

-- DropForeignKey
ALTER TABLE "ProductTopicValue" DROP CONSTRAINT "ProductTopicValue_product_topic_key_id_fkey";

-- DropForeignKey
ALTER TABLE "ProductValue" DROP CONSTRAINT "ProductValue_product_enum_key_id_fkey";

-- DropForeignKey
ALTER TABLE "ProductValue" DROP CONSTRAINT "ProductValue_product_id_fkey";

-- DropForeignKey
ALTER TABLE "ProductValue" DROP CONSTRAINT "ProductValue_product_key_id_fkey";

-- DropTable
DROP TABLE "Product";

-- DropTable
DROP TABLE "ProductEnumKey";

-- DropTable
DROP TABLE "ProductImage";

-- DropTable
DROP TABLE "ProductImageCompacted";

-- DropTable
DROP TABLE "ProductKey";

-- DropTable
DROP TABLE "ProductSpecificationTable";

-- DropTable
DROP TABLE "ProductTopicKey";

-- DropTable
DROP TABLE "ProductTopicValue";

-- DropTable
DROP TABLE "ProductValue";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "id_tipo_login" INTEGER NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoLogin" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "TipoLogin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PermissaoUsuario" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_permissao" INTEGER NOT NULL,

    CONSTRAINT "PermissaoUsuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegraPermissao" (
    "id" SERIAL NOT NULL,
    "id_permissao" INTEGER NOT NULL,
    "id_regra" INTEGER NOT NULL,

    CONSTRAINT "RegraPermissao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permissao" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Permissao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Regra" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Regra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Curso" (
    "id" SERIAL NOT NULL,
    "abreviacao" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "Curso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bloco" (
    "id" SERIAL NOT NULL,
    "numero_bloco" INTEGER NOT NULL,
    "id_curso" INTEGER NOT NULL,

    CONSTRAINT "Bloco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Materia" (
    "id" SERIAL NOT NULL,
    "abreviacao" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "Materia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MateriaBloco" (
    "id" SERIAL NOT NULL,
    "id_bloco" INTEGER NOT NULL,
    "id_materia" INTEGER NOT NULL,

    CONSTRAINT "MateriaBloco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Questao" (
    "id" SERIAL NOT NULL,
    "id_materia_bloco" INTEGER NOT NULL,
    "questao_texto" TEXT NOT NULL,
    "questao_a" TEXT NOT NULL,
    "questao_b" TEXT NOT NULL,
    "questao_c" TEXT NOT NULL,
    "questao_d" TEXT NOT NULL,
    "alternativa_correta" TEXT NOT NULL,

    CONSTRAINT "Questao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_username_key" ON "Usuario"("username");

-- CreateIndex
CREATE UNIQUE INDEX "TipoLogin_nome_key" ON "TipoLogin"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Permissao_name_key" ON "Permissao"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Regra_name_key" ON "Regra"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Curso_abreviacao_key" ON "Curso"("abreviacao");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_id_tipo_login_fkey" FOREIGN KEY ("id_tipo_login") REFERENCES "TipoLogin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissaoUsuario" ADD CONSTRAINT "PermissaoUsuario_id_permissao_fkey" FOREIGN KEY ("id_permissao") REFERENCES "Permissao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegraPermissao" ADD CONSTRAINT "RegraPermissao_id_permissao_fkey" FOREIGN KEY ("id_permissao") REFERENCES "Permissao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegraPermissao" ADD CONSTRAINT "RegraPermissao_id_regra_fkey" FOREIGN KEY ("id_regra") REFERENCES "Regra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bloco" ADD CONSTRAINT "Bloco_id_curso_fkey" FOREIGN KEY ("id_curso") REFERENCES "Curso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MateriaBloco" ADD CONSTRAINT "MateriaBloco_id_bloco_fkey" FOREIGN KEY ("id_bloco") REFERENCES "Bloco"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MateriaBloco" ADD CONSTRAINT "MateriaBloco_id_materia_fkey" FOREIGN KEY ("id_materia") REFERENCES "Materia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Questao" ADD CONSTRAINT "Questao_id_materia_bloco_fkey" FOREIGN KEY ("id_materia_bloco") REFERENCES "MateriaBloco"("id") ON DELETE CASCADE ON UPDATE CASCADE;
