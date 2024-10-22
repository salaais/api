// src/permissions/permissions.enum.ts
export enum Permissions {
  ADMIN = 'ADMIN',
  COMUM = 'COMUM',
  OURO = 'OURO',
  PRATA = 'PRATA',
  BRONZE = 'BRONZE',
}

export enum UserPermissions {

  //COMUMN
  PEGAR_USUARIO_POR_ID = 'pegar_usuario_por_id',
  CRIAR_USUARIO = 'criar_usuario',
  DELETAR_MEU_USUARIO = 'deletar_meu_usuario',
  EDITAR_MEU_USUARIO = 'editar_meu_usuario',
  CORRECAO_COMUM_PROVA = 'correcao_comum_prova',
  LISTAR_DADOS_PUBLICOS_USUARIOS = 'listar_dados_publicos_usuarios',
  
  // plano (OURO, PRATA, BRONZE)
  CORRECAO_PLANO_PROVA = 'correcao_plano_prova',
  GERAR_PROVA_ALEATORIA = 'gerar_prova_aleatoria',
  GERAR_PROVA_NORMAL = 'gerar_prova_normal',
  GERAR_PROVA_MATERIA = 'gerar_prova_materia',
  
  // ADMIN
  EDITAR_USUARIO_POR_ID = 'editar_usuario_por_id',
  DELETAR_USUARIO = 'deletar_usuario',
  LISTAR_DADOS_CONFIENCIAIS_USUARIOS = 'listar_dados_confidenciais_usuarios',
  LISTAR_PERMISSOES = 'listar_permissoes',
  CADASTRAR_PERMISSAO = 'cadastrar_permissao',
  CADASTRAR_REGRA = 'cadastrar_regra',
  EDITAR_PERMISSAO = 'editar_permissao',
  EDITAR_REGRA = 'editar_regra',
  VINCULAR_REGRA_COM_PERMISSAO = 'vincular_regra_com_permissao',
  CADASTRAR_QUESTOES_PROVA = 'cadastrar_questoes_prova',
  LISTAR_QUESTOES = 'listar_questoes',
}
