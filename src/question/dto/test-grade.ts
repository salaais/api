import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  isEnum,
  IsEnum,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Curse } from '../enums/curse';
import { Type } from 'class-transformer';

class QuestionDto {
  @IsString()
  key: string;

  @IsString()
  alternativa: string;
}

export class TestGradeDto {
  @ApiProperty({
    example: [
      { key: 'cms-22', alternativa: 'c' },
      { key: 'cms-220', alternativa: 'd' },
      { key: 'cms-221', alternativa: 'c' },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  data: QuestionDto[];
}
