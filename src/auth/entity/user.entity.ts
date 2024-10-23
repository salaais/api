import { ApiProperty } from '@nestjs/swagger';

export interface Regra {
  id_key: number;
  key: string;
  descricao: string;
  data_resetar_contagem_uso?: string | null;
  limite_contagem_uso?: number | null;
  contagem_uso?: number | null;
}

export interface Permissao {
  id_key: number;
  key: string;
  descricao: string;
  data_criacao?: string;
  data_expiracao?: string;
  regras: Regra[];
}

export interface UserInfoByToken {
  user_id: number;
  iat: number;
  exp: number;
  email: string;
  username: string;
  nome: string;
  tipo_login: string;
  bio: string;
  data_atualizacao_usuario: Date | null;
  data_criacao_usuario: Date | null;
  permissoes: Permissao[]; // Adicione esta linha
}

