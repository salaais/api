/*
  Warnings:

  - A unique constraint covering the columns `[id_usuario,id_permissao]` on the table `PermissaoUsuario` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PermissaoUsuario_id_usuario_id_permissao_key" ON "PermissaoUsuario"("id_usuario", "id_permissao");
