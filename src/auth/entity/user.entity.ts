import { ApiProperty } from '@nestjs/swagger';

export class UserInfoByToken {
  user_id: number
  iat: number
  exp: number
  email: string
  user_name: string
  nome: string
  tipo_login: string
  data_atualizacao_usuario: Date
  data_criacao_usuario: Date | null;
//   permissao_usuario: String[]
//   regras_usuario: String[]
}
