/*
  Warnings:

  - A unique constraint covering the columns `[id_regra,id_permissao]` on the table `RegraPermissao` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RegraPermissao_id_regra_id_permissao_key" ON "RegraPermissao"("id_regra", "id_permissao");
