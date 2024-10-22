-- AlterTable
ALTER TABLE "PermissaoUsuario" ADD COLUMN     "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "data_expiracao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "RegraPermissao" ADD COLUMN     "contagem_uso" INTEGER,
ADD COLUMN     "data_resetar_contagem_uso" TIMESTAMP(3),
ADD COLUMN     "limite_contagem_uso" INTEGER;
