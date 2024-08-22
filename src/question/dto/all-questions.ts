import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Subject } from '../enums/cms-subject';
import { Curse } from '../enums/cms-curse';

export class AllQuestionsDto {

  // @ApiProperty({
  //   description: 'CSV values containing the questions data',
  //   example: Curse.CMS,
  // })
  // @IsString()
  // readonly curso?: Curse;

  // @ApiProperty({
  //   description: 'CSV values containing the questions data',
  //   example: Subject.AER,
  // })
  // @IsString()
  // readonly materia?: Subject;

  // @ApiProperty({
  //   description: 'CSV values containing the questions data',
  //   example: 1,
  // })
  // @IsNumber()
  // readonly bloco?: number;

  @ApiProperty({
    description: 'CSV values containing the questions data',
    example: 'cms-22',
  })
  @IsString()
  readonly key?: string;

  // @ApiProperty({
  //   description: 'CSV values containing the questions data',
  //   example: 1000,
  // })
  // @IsNotEmpty()
  // @IsNumber()
  // readonly items_por_pagina: number;


  // @ApiProperty({
  //   description: 'CSV values containing the questions data',
  //   example: 1,
  // })
  // @IsNumber()
  // readonly numero_pagina: number;
}
