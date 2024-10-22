-- CreateTable
CREATE TABLE "Bloco" (
    "id" SERIAL NOT NULL,
    "id_curso" INTEGER NOT NULL,
    "key" INTEGER NOT NULL,

    CONSTRAINT "Bloco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Curso" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "key" TEXT NOT NULL,

    CONSTRAINT "Curso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Materia" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "key" TEXT NOT NULL,

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
CREATE TABLE "Permissao" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "key" TEXT NOT NULL,

    CONSTRAINT "Permissao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PermissaoUsuario" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_permissao" INTEGER NOT NULL,

    CONSTRAINT "PermissaoUsuario_pkey" PRIMARY KEY ("id")
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
    "key" TEXT NOT NULL,
    "descricao" TEXT,

    CONSTRAINT "Questao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Regra" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "key" TEXT NOT NULL,

    CONSTRAINT "Regra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegraPermissao" (
    "id" SERIAL NOT NULL,
    "id_permissao" INTEGER NOT NULL,
    "id_regra" INTEGER NOT NULL,

    CONSTRAINT "RegraPermissao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoLogin" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "key" TEXT NOT NULL,

    CONSTRAINT "TipoLogin_pkey" PRIMARY KEY ("id")
);

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

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_username_key" ON "Usuario"("username");

-- AddForeignKey
ALTER TABLE "Bloco" ADD CONSTRAINT "Bloco_id_curso_fkey" FOREIGN KEY ("id_curso") REFERENCES "Curso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MateriaBloco" ADD CONSTRAINT "MateriaBloco_id_bloco_fkey" FOREIGN KEY ("id_bloco") REFERENCES "Bloco"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MateriaBloco" ADD CONSTRAINT "MateriaBloco_id_materia_fkey" FOREIGN KEY ("id_materia") REFERENCES "Materia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissaoUsuario" ADD CONSTRAINT "PermissaoUsuario_id_permissao_fkey" FOREIGN KEY ("id_permissao") REFERENCES "Permissao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Questao" ADD CONSTRAINT "Questao_id_materia_bloco_fkey" FOREIGN KEY ("id_materia_bloco") REFERENCES "MateriaBloco"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegraPermissao" ADD CONSTRAINT "RegraPermissao_id_permissao_fkey" FOREIGN KEY ("id_permissao") REFERENCES "Permissao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegraPermissao" ADD CONSTRAINT "RegraPermissao_id_regra_fkey" FOREIGN KEY ("id_regra") REFERENCES "Regra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_id_tipo_login_fkey" FOREIGN KEY ("id_tipo_login") REFERENCES "TipoLogin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
