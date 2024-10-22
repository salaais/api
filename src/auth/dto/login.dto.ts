import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'filipe.souza@example.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty()
  @ApiProperty({
    example: 'password123',
    description: 'A senha do usuário (mínimo de 8 caracteres)',
  })
  password: string;
}
