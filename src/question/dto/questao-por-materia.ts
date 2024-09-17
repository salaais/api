import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { Curse } from '../enums/curse';
import { Subject } from '../enums/cms-subject';

class QuestaoPorMateria {
  @IsEnum(Curse)
  readonly curso?: Curse;
  @IsEnum(Subject)
  materia: Subject;
  @IsNumber()
  quantidade_questoes: number;
}

export class QuestionBySubject {
  @ApiProperty({
    description: 'Criar questões com base nas matérias',
    example: [
      {
        curso: Curse.CMS,
        materia: Subject.AER,
        quantidade_questoes: 10,
      },
      {
        curso: Curse.CMS,
        materia: Subject.EME,
        quantidade_questoes: 10,
      },
      {
        curso: Curse.CMS,
        materia: Subject.MET,
        quantidade_questoes: 10,
      },
    ],
    enum: Curse,
  })
  questao_por_materia: QuestaoPorMateria[];
}
