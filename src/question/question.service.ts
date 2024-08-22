import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuestionsTsvDto } from './dto/create-questions-tsv';
import * as fastcsv from 'fast-csv';
import { Readable } from 'stream';
import { AllQuestionsDto } from './dto/all-questions';
import { normalizeString } from 'src/utils';

@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) {}

  // async createQuestionsTsv(createQuestion: CreateQuestionTsvDto) {
  //   const rows = await this.parseTSV(createQuestion.tsv_values);
  //   // Ignorar a primeira linha (cabeçalhos)
  //   rows.shift();

  //   // Para armazenar informações de adição e alteração
  //   const questoesAdicionadas: string[] = [];
  //   const questoesAlteradas: string[] = [];

  //   for (const row of rows) {
  //     const [
  //       id,
  //       blocoNumero,
  //       materiaAbreviacao,
  //       questaoTexto,
  //       a,
  //       b,
  //       c,
  //       d,
  //       alternativaCorreta,
  //     ] = row;

  //     const blocoNumeroInt = parseInt(blocoNumero, 10);

  //     if (isNaN(blocoNumeroInt)) {
  //       console.error(`Invalid blocoNumero: ${blocoNumero}`);
  //       continue;
  //     }

  //     // Find or create the Materia
  //     const materia = await this.prisma.materia.upsert({
  //       where: { key: materiaAbreviacao.trim() },
  //       update: {},
  //       create: {
  //         key: materiaAbreviacao.trim(),
  //         nome: '',
  //         descricao: '',
  //       },
  //     });

  //     // Find or create the Curso
  //     const curso = await this.prisma.curso.upsert({
  //       where: { key: 'cms' }, // Assumindo 'cms' como constante ou precisa ser dinâmico
  //       update: {},
  //       create: {
  //         key: 'cms',
  //         nome: '',
  //         descricao: '',
  //       },
  //     });

  //     // Find or create the Bloco
  //     const bloco = await this.prisma.bloco.upsert({
  //       where: {
  //         id_curso_key: {
  //           id_curso: curso.id,
  //           key: blocoNumeroInt,
  //         },
  //       },
  //       update: {},
  //       create: {
  //         id_curso: curso.id,
  //         key: blocoNumeroInt,
  //       },
  //     });

  //     // Find or create the MateriaBloco
  //     const materiaBloco = await this.prisma.materiaBloco.upsert({
  //       where: {
  //         id_bloco_id_materia: {
  //           id_bloco: bloco.id,
  //           id_materia: materia.id,
  //         },
  //       },
  //       update: {},
  //       create: {
  //         id_bloco: bloco.id,
  //         id_materia: materia.id,
  //       },
  //     });

  //     // Upsert the Question
  //     const question = await this.prisma.questao.upsert({
  //       where: { key: id.trim() },
  //       update: {
  //         id_materia_bloco: materiaBloco.id,
  //         questao_texto: questaoTexto.trim(),
  //         questao_a: a.trim(),
  //         questao_b: b.trim(),
  //         questao_c: c.trim(),
  //         questao_d: d.trim(),
  //         alternativa_correta: alternativaCorreta.trim().toLowerCase(),
  //       },
  //       create: {
  //         id_materia_bloco: materiaBloco.id,
  //         questao_texto: questaoTexto.trim(),
  //         key: id.trim(),
  //         questao_a: a.trim(),
  //         questao_b: b.trim(),
  //         questao_c: c.trim(),
  //         questao_d: d.trim(),
  //         alternativa_correta: alternativaCorreta.trim().toLowerCase(),
  //       },
  //     });

  //     if (question) {
  //       if (question.id) {
  //         // Se a questão já existia e foi atualizada
  //         questoesAlteradas.push(id.trim());
  //       } else {
  //         // Se a questão foi criada
  //         questoesAdicionadas.push(id.trim());
  //       }
  //     }
  //   }

  //   return {
  //     numero_adicionadas: questoesAdicionadas.length,
  //     numero_alteradas: questoesAlteradas.length,
  //     questoes_adicionadas: questoesAdicionadas,
  //     questoes_alteradas: questoesAlteradas,
  //   };
  // }

  async createQuestionsTsv(createQuestion: CreateQuestionsTsvDto) {
    // Converter os dados para o formato com representações visuais
    const formattedData = this.convertToTSVFormat(createQuestion.tsv_values);

    // Usar parseTSV para obter os dados em formato de linhas e colunas
    const rows = await this.parseTSV(formattedData);

    // Ignorar a primeira linha (cabeçalhos)
    rows.shift();

    // Para armazenar informações de adição e alteração
    const questoesAdicionadas: string[] = [];
    const questoesAlteradas: string[] = [];

    for (const row of rows) {
      const [
        id,
        blocoNumero,
        materiaAbreviacao,
        questaoTexto,
        a,
        b,
        c,
        d,
        alternativaCorreta,
      ] = row;

      const blocoNumeroInt = parseInt(blocoNumero, 10);

      if (isNaN(blocoNumeroInt)) {
        console.error(`Invalid blocoNumero: ${blocoNumero}`);
        continue;
      }

      // Find or create the Materia
      const materia = await this.prisma.materia.upsert({
        where: { key: materiaAbreviacao.trim() },
        update: {},
        create: {
          key: materiaAbreviacao.trim(),
          nome: '',
          descricao: '',
        },
      });

      // Find or create the Curso
      const curso = await this.prisma.curso.upsert({
        where: { key: 'cms' }, // Assumindo 'cms' como constante ou precisa ser dinâmico
        update: {},
        create: {
          key: 'cms',
          nome: '',
          descricao: '',
        },
      });

      // Find or create the Bloco
      const bloco = await this.prisma.bloco.upsert({
        where: {
          id_curso_key: {
            id_curso: curso.id,
            key: blocoNumeroInt,
          },
        },
        update: {},
        create: {
          id_curso: curso.id,
          key: blocoNumeroInt,
        },
      });

      // Find or create the MateriaBloco
      const materiaBloco = await this.prisma.materiaBloco.upsert({
        where: {
          id_bloco_id_materia: {
            id_bloco: bloco.id,
            id_materia: materia.id,
          },
        },
        update: {},
        create: {
          id_bloco: bloco.id,
          id_materia: materia.id,
        },
      });

      // Upsert the Question
      const existingQuestion = await this.prisma.questao.findUnique({
        where: { key: id.trim() },
      });

      const question = await this.prisma.questao.upsert({
        where: { key: id.trim() },
        update: {
          id_materia_bloco: materiaBloco.id,
          questao_texto: questaoTexto.trim(),
          questao_a: a.trim(),
          questao_b: b.trim(),
          questao_c: c.trim(),
          questao_d: d.trim(),
          alternativa_correta: alternativaCorreta.trim().toLowerCase(),
        },
        create: {
          id_materia_bloco: materiaBloco.id,
          questao_texto: questaoTexto.trim(),
          key: id.trim(),
          questao_a: a.trim(),
          questao_b: b.trim(),
          questao_c: c.trim(),
          questao_d: d.trim(),
          alternativa_correta: alternativaCorreta.trim().toLowerCase(),
        },
      });

      if (existingQuestion) {
        // Se a questão já existia e foi atualizada
        questoesAlteradas.push(id.trim());
      } else {
        // Se a questão foi criada
        questoesAdicionadas.push(id.trim());
      }
    }

    return {
      numero_adicionadas: questoesAdicionadas.length,
      numero_alteradas: questoesAlteradas.length,
      questoes_adicionadas: questoesAdicionadas,
      questoes_alteradas: questoesAlteradas,
    };
  }

  async allQuestions(allQuestions: AllQuestionsDto) {
    const { key } = allQuestions || {};

    // Remove acentos e converte para minúsculas
    const normalizedKey = key ? normalizeString(key.toLowerCase()) : '';

    // Ajusta a cláusula `where` para buscar usando o texto normalizado
    const questions = await this.prisma.questao.findMany({
      where: {
        key: {
          contains: normalizedKey,
          mode: 'insensitive', // Faz a busca insensível a maiúsculas
        },
      },
      include: {
        materia_bloco: {
          include: {
            meteria: {
              select: {
                key: true,
              },
            },
            bloco: {
              select: {
                key: true,
              },
            },
          },
        },
      },
    });

    // Formata o retorno para incluir as chaves Materia e Bloco
    const formattedQuestions = questions.map((question) => ({
      ...question,
      materia: question.materia_bloco.meteria.key,
      bloco: question.materia_bloco.bloco.key,
      materia_bloco: undefined,
      id_materia_bloco: undefined,
    }));

    return {
      items: formattedQuestions.length,
      data: formattedQuestions,
    };
  }

  // Adapte a função convertToTSVFormat para o formato visual
  private convertToTSVFormat(spaceData: string): string {
    return spaceData
      .replace(/\t/g, '\t')
      .replace(/\n/g, '\n')
      .replace(/"/g, "'");
  }

  private parseTSV(csvData: string): Promise<string[][]> {
    return new Promise((resolve, reject) => {
      try {
        const rows: string[][] = [];
        Readable.from(csvData)
          .pipe(fastcsv.parse({ headers: false, delimiter: '\t' })) // Note que o delimitador é \t para tabulação
          .on('data', (row) => rows.push(row))
          .on('end', () => resolve(rows))
          .on('error', (error) => {
            console.error('Error parsing CSV:', error);
            reject(
              new HttpException(
                'Failed to parse CSV',
                HttpStatus.UNPROCESSABLE_ENTITY,
              ),
            );
          });
      } catch (error) {
        console.error('Unexpected error:', error);
        reject(
          new HttpException(
            'Unexpected error',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
      }
    });
  }
}
