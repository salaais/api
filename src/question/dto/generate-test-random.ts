import { ApiProperty } from '@nestjs/swagger';
import { IsArray, isEnum, IsEnum, IsNumber, IsString } from 'class-validator';
import { Curse } from '../enums/curse';

export class GenerateTestRandomDto {
  @ApiProperty({
    description: 'Criar questões com base nos blocos',
    example: 'cms', // Aqui deve ser um exemplo válido do enum `Curse`
    enum: Curse,
  })
  @IsEnum(Curse, {
    message: 'O valor fornecido deve ser um dos valores do enum Curse',
  })
  readonly curso?: Curse;

  @ApiProperty({
    description: 'criar questoes com base nos blocos',
    example: [1, 2, 3, 4],
  })
  @IsArray()
  readonly blocos?: number[];

  @ApiProperty({
    description: 'quantity of questions',
    example: 20,
  })
  @IsNumber()
  readonly questoes_por_bloco: number;
}
