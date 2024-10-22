/*
  Warnings:

  - You are about to drop the column `created_at` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Usuario` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "data_atualizacao" TIMESTAMP(3),
ADD COLUMN     "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "TipoNotificacao" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "TipoNotificacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notificacao" (
    "id" SERIAL NOT NULL,
    "id_tipo_notificacao" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMP(3) NOT NULL,
    "data_inicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_fim" TIMESTAMP(3),

    CONSTRAINT "Notificacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsuarioNotificacao" (
    "id" SERIAL NOT NULL,
    "id_notificacao" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "UsuarioNotificacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoProva" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "TipoProva_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoricoProva" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_tipo_prova" INTEGER NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "HistoricoProva_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestaoHistoricoProva" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_historico_prova" INTEGER NOT NULL,
    "questao_key" TEXT NOT NULL,
    "questao_assinalada" TEXT NOT NULL,

    CONSTRAINT "QuestaoHistoricoProva_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComentarioProva" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_historico_prova" INTEGER NOT NULL,
    "questao_key" TEXT NOT NULL,
    "comentario" TEXT NOT NULL,
    "data_comentario" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ComentarioProva_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoricoPagamento" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_tipo_pagamento" INTEGER NOT NULL,
    "identificador_transacao" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "data_inicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_fim" TIMESTAMP(3),
    "descricao" TEXT,
    "reembolso" BOOLEAN NOT NULL,
    "data_comentario" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HistoricoPagamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoPagamento" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "TipoPagamento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TipoNotificacao_key_key" ON "TipoNotificacao"("key");

-- CreateIndex
CREATE UNIQUE INDEX "TipoProva_key_key" ON "TipoProva"("key");

-- CreateIndex
CREATE UNIQUE INDEX "TipoPagamento_key_key" ON "TipoPagamento"("key");

-- AddForeignKey
ALTER TABLE "PermissaoUsuario" ADD CONSTRAINT "PermissaoUsuario_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificacao" ADD CONSTRAINT "Notificacao_id_tipo_notificacao_fkey" FOREIGN KEY ("id_tipo_notificacao") REFERENCES "TipoNotificacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioNotificacao" ADD CONSTRAINT "UsuarioNotificacao_id_notificacao_fkey" FOREIGN KEY ("id_notificacao") REFERENCES "Notificacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioNotificacao" ADD CONSTRAINT "UsuarioNotificacao_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoProva" ADD CONSTRAINT "HistoricoProva_id_tipo_prova_fkey" FOREIGN KEY ("id_tipo_prova") REFERENCES "TipoProva"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoProva" ADD CONSTRAINT "HistoricoProva_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestaoHistoricoProva" ADD CONSTRAINT "QuestaoHistoricoProva_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestaoHistoricoProva" ADD CONSTRAINT "QuestaoHistoricoProva_id_historico_prova_fkey" FOREIGN KEY ("id_historico_prova") REFERENCES "HistoricoProva"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComentarioProva" ADD CONSTRAINT "ComentarioProva_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComentarioProva" ADD CONSTRAINT "ComentarioProva_id_historico_prova_fkey" FOREIGN KEY ("id_historico_prova") REFERENCES "HistoricoProva"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoPagamento" ADD CONSTRAINT "HistoricoPagamento_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoPagamento" ADD CONSTRAINT "HistoricoPagamento_id_tipo_pagamento_fkey" FOREIGN KEY ("id_tipo_pagamento") REFERENCES "TipoPagamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
