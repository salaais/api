import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateQuestionsTsvDto {
  @ApiProperty({
    description: 'CSV values containing the questions data',
    example: `ID\tBLOCO\tMATÉRIA\tPERGUNTA\tA\tB\tC\tD\tRESPOSTA\nCMS-1\t1\tEME\tA emergência em que há tempo hábil para se determinar a posição que minimiza os efeitos do impacto sobre os passageiros denomina-se:\tAcidental\tPreparada\tProvocada\tDespreparada\tB\nCMS-2\t1\tEME\tDespressurização significa:\tUm local cuja pressão interna é zero\tEntrada forçada do ar para um meio de maior pressão\tA saída do ar de um meio de menor para um de maior pressão\tA saída do ar de um meio de maior para um de menor pressão\tD\nCMS-3\t1\tEME\tO oxigênio terapêutico (máscara oro-nasal) tem como finalidade:\tServir de proteção no combate ao fogo\tAtender passageiros que estejam com parada circulatória\tAtender passageiros e tripulantes com insuficiência respiratória\tProteger tripulantes que estejam em área com fumaça e/ou gases tóxicos\tC`,
  })
  @IsNotEmpty()
  @IsString()
  readonly tsv_values: string;
}
