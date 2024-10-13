import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateQuestionsTsvDto {
  @ApiProperty({
    description: 'CSV values containing the questions data',
    example: `KEY	BLOCO	MATÉRIA	PERGUNTA	A	B	C	D	RESPOSTA	DESCRIÇÃO				
cms-1	1	eme	A emergência em que há tempo hábil para se determinar a posição que minimiza os efeitos do impacto sobre os passageiros denomina-se:	Acidental	Preparada	Provocada	Despreparada	b	Uma emergência preparada é aquela em que há tempo suficiente para que a tripulação possa avisar os passageiros e orientar sobre as posições de segurança para minimizar os danos durante o impacto.				
cms-2	1	eme	Despressurização significa:	Um local cuja pressão interna é zero	Entrada forçada do ar para um meio de maior pressão	A saída do ar de um meio de menor para um de maior pressão	A saída do ar de um meio de maior para um de menor pressão	d	A despressurização ocorre quando o ar escapa de um ambiente de alta pressão (como o interior de uma aeronave pressurizada) para um ambiente de baixa pressão, como a atmosfera externa.				
cms-3	1	eme	O oxigênio terapêutico (máscara oro-nasal) tem como finalidade:	Servir de proteção no combate ao fogo	Atender passageiros que estejam com parada circulatória	Atender passageiros e tripulantes com insuficiência respiratória	Proteger tripulantes que estejam em área com fumaça e/ou gases tóxicos	c	O oxigênio terapêutico é utilizado para fornecer oxigênio suplementar a passageiros e tripulantes que estejam com dificuldade respiratória, ajudando-os a respirar adequadamente.				
cms-4	1	eme	O conjunto de sobrevivência no mar é um equipamento obrigatório para aeronave que efetuam voos:	Costeiros	Regionais	Domésticos	Transoceânicos	d	O conjunto de sobrevivência marítima é obrigatório para aeronaves que sobrevoam oceanos, pois são áreas onde um pouso de emergência no mar pode ser necessário, exigindo itens de sobrevivência.				
`,
  })
  @IsNotEmpty()
  @IsString()
  readonly tsv_values: string;
}
