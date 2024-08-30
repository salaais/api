import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuestionsTsvDto } from './dto/create-questions-tsv';
import * as fastcsv from 'fast-csv';
import { Readable } from 'stream';
import { AllQuestionsDto } from './dto/all-questions';
import { normalizeString } from '../utils';
import { GenerateTestDto } from './dto/generate-test';
import { TestGradeDto } from './dto/test-grade';
import { GenerateTestRandomDto } from './dto/generate-test-random';

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
    try {
      // Converter os dados para o formato com representações visuais
      const formattedData = this.convertToTSVFormat(createQuestion.tsv_values);

      // Usar parseTSV para obter os dados em formato de linhas e colunas
      const rows = await this.parseTSV(formattedData);

      // Verificar se há linhas
      if (rows.length === 0) {
        throw new Error('No data found in TSV');
      }

      // Obter e mapear cabeçalhos
      const headers = rows[0].map((header) => normalizeString(header));
      const columnIndex = {
        id: headers.indexOf(normalizeString('KEY')),
        blocoNumero: headers.indexOf(normalizeString('BLOCO')),
        materiaAbreviacao: headers.indexOf(normalizeString('MATÉRIA')),
        questaoTexto: headers.indexOf(normalizeString('PERGUNTA')),
        a: headers.indexOf(normalizeString('A')),
        b: headers.indexOf(normalizeString('B')),
        c: headers.indexOf(normalizeString('C')),
        d: headers.indexOf(normalizeString('D')),
        alternativaCorreta: headers.indexOf(normalizeString('RESPOSTA')),
      };

      // Verifique se todos os índices foram encontrados
      for (const key in columnIndex) {
        if (columnIndex[key] === -1) {
          throw new Error(`Header column '${key}' not found in TSV`);
        }
      }

      // Ignorar a primeira linha (cabeçalhos)
      rows.shift();

      // Para armazenar informações de adição e alteração
      const questoesAdicionadas: string[] = [];
      const questoesAlteradas: string[] = [];

      for (const row of rows) {
        // Verificar se a linha tem o número correto de colunas
        if (row.length < Object.keys(columnIndex).length) {
          console.error('Row has fewer columns than expected:', row);
          continue;
        }

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
        ] = [
          row[columnIndex.id]?.trim() || '',
          row[columnIndex.blocoNumero]?.trim() || '',
          row[columnIndex.materiaAbreviacao]?.trim() || '',
          row[columnIndex.questaoTexto]?.trim() || '',
          row[columnIndex.a]?.trim() || '',
          row[columnIndex.b]?.trim() || '',
          row[columnIndex.c]?.trim() || '',
          row[columnIndex.d]?.trim() || '',
          row[columnIndex.alternativaCorreta]?.trim() || '',
        ];

        const blocoNumeroInt = parseInt(blocoNumero, 10);

        if (isNaN(blocoNumeroInt)) {
          console.error(`Invalid blocoNumero: ${blocoNumero}`);
          continue;
        }

        // Transformar o ID para minúsculas
        const idLower = id.toLowerCase();

        // Find or create the Materia
        const materia = await this.prisma.materia.upsert({
          where: { key: normalizeString(materiaAbreviacao).toLowerCase() },
          update: {},
          create: {
            key: normalizeString(materiaAbreviacao.trim()).toLowerCase(),
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
          where: { key: idLower },
        });

        const question = await this.prisma.questao.upsert({
          where: { key: idLower },
          update: {
            id_materia_bloco: materiaBloco.id,
            questao_texto: questaoTexto,
            questao_a: a,
            questao_b: b,
            questao_c: c,
            questao_d: d,
            alternativa_correta: alternativaCorreta.toLowerCase(),
          },
          create: {
            id_materia_bloco: materiaBloco.id,
            questao_texto: questaoTexto,
            key: idLower,
            questao_a: a,
            questao_b: b,
            questao_c: c,
            questao_d: d,
            alternativa_correta: alternativaCorreta.toLowerCase(),
          },
        });

        if (existingQuestion) {
          // Se a questão já existia e foi atualizada
          questoesAlteradas.push(idLower);
        } else {
          // Se a questão foi criada
          questoesAdicionadas.push(idLower);
        }
      }

      return {
        numero_adicionadas: questoesAdicionadas.length,
        numero_alteradas: questoesAlteradas.length,
        questoes_adicionadas: questoesAdicionadas,
        questoes_alteradas: questoesAlteradas,
      };
    } catch (error) {
      console.error('Error creating questions from TSV:', error);
      throw new Error('Failed to create questions from TSV');
    }
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

  async generateTestRandom(request: GenerateTestRandomDto) {
    const { curso, questoes_por_bloco, blocos } = request;

    // Primeiro, filtramos o curso especificado
    const cursoFiltrado = await this.prisma.curso.findUnique({
      where: {
        key: curso,
      },
      include: {
        bloco: {
          include: {
            materia_bloco: {
              include: {
                meteria: true,
                questao: true,
              },
            },
          },
        },
      },
    });

    if (!cursoFiltrado) {
      throw new NotFoundException(`Curso com key ${curso} não encontrado`);
    }

    // Se blocos específicos forem fornecidos, filtramos pelos blocos
    let blocosFiltrados = cursoFiltrado.bloco;
    if (blocos && blocos.length > 0) {
      blocosFiltrados = blocosFiltrados.filter((bloco) =>
        blocos.includes(bloco.key),
      );
    }

    // Coletar todas as questões dos blocos filtrados e selecionar 20 por bloco
    const questoesPorBloco = await Promise.all(
      blocosFiltrados.map(async (bloco) => {
        // Coletar todas as questões para o bloco
        const questoes = bloco.materia_bloco.flatMap((materiaBloco) =>
          materiaBloco.questao.map((questao) => ({
            ...questao,
            materia: materiaBloco.meteria.key,
            bloco: bloco.key,
          })),
        );

        // Selecionar até 20 questões aleatoriamente
        return this.shuffleAndSelect(questoes, questoes_por_bloco);
      }),
    );

    // Montar a resposta com a quantidade total de questões e as questões agrupadas por bloco
    const totalQuestoes = questoes_por_bloco * blocosFiltrados.length;
    const questoesPlanas = questoesPorBloco.flat();

    return {
      items: totalQuestoes,
      data: questoesPlanas,
    };
  }

  async generateTest(request: GenerateTestDto) {
    const { keys } = request;

    if (!keys || keys.length === 0) {
      throw new BadRequestException('Nenhuma chave foi fornecida');
    }

    // Buscar as questões diretamente com base nas chaves fornecidas, incluindo as informações de bloco e matéria
    const questoes = await this.prisma.questao.findMany({
      where: {
        key: {
          in: keys, // Filtrar pelas chaves fornecidas
        },
      },
      include: {
        materia_bloco: {
          include: {
            meteria: true,
            bloco: true,
          },
        },
      },
    });

    if (questoes.length === 0) {
      throw new NotFoundException(
        'Nenhuma questão correspondente às chaves fornecidas foi encontrada',
      );
    }

    // Mapear as questões para incluir informações de matéria e bloco
    const questoesComDetalhes = questoes.map((questao) => ({
      id: questao.id,
      key: questao.key,
      questao_texto: questao.questao_texto,
      questao_a: questao.questao_a,
      questao_b: questao.questao_b,
      questao_c: questao.questao_c,
      questao_d: questao.questao_d,
      alternativa_correta: questao.alternativa_correta,
      materia: questao.materia_bloco.meteria?.key || null,
      bloco: questao.materia_bloco.bloco?.key || null,
    }));

    return {
      items: questoesComDetalhes.length,
      data: questoesComDetalhes,
    };
  }

  async testGrade(request: TestGradeDto) {
    const questionKeys = request.data.map((q) => q.key);

    // Busca as questões no banco de dados
    const questionsFromDB = await this.prisma.questao.findMany({
      where: {
        key: {
          in: questionKeys,
        },
      },
    });

    // Variáveis para calcular acertos e armazenar as chaves das questões corretas e erradas
    let total_corretas = 0;
    let total_incorretas = 0;
    let total_nao_encontradas = 0;
    const respostas_corretas: string[] = [];
    const respostas_incorretas: string[] = [];
    const respostas_nao_encontradas: string[] = [];

    // Verifica as respostas fornecidas contra as corretas
    request.data.forEach((questionRequest) => {
      const correctQuestion = questionsFromDB.find(
        (q) => q.key.toLowerCase() === questionRequest.key.toLowerCase(),
      );

      if (correctQuestion) {
        if (
          correctQuestion.alternativa_correta.trim().toLowerCase() ===
          questionRequest.alternativa.trim().toLowerCase()
        ) {
          total_corretas++;
          respostas_corretas.push(questionRequest.key);
        } else {
          total_incorretas++;
          respostas_incorretas.push(questionRequest.key);
        }
      } else {
        total_nao_encontradas++;
        respostas_nao_encontradas.push(questionRequest.key);
      }
    });

    // Calcula a porcentagem de acertos
    const total_questoes = request.data.length;
    const total_questoes_encontradas = total_corretas + total_incorretas;
    const porcentagem_acerto = parseFloat(
      ((total_corretas / total_questoes_encontradas) * 100).toFixed(3),
    );

    // Retorna a porcentagem de acertos, chaves das questões corretas, erradas e não encontradas
    return {
      total_corretas,
      total_incorretas,
      total_nao_encontradas,
      total_questoes,
      porcentagem_acerto,
      respostas_corretas, // Lista de chaves das questões corretas
      respostas_incorretas, // Lista de chaves das questões erradas
      respostas_nao_encontradas, // Lista de chaves das questões não encontradas
    };
  }

  //embaralhar as questões e selecionar uma quantidade específica
  private shuffleAndSelect(array: any[], quantidade: number) {
    // Embaralha o array
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    // Retorna a quantidade solicitada ou todas as questões, se o array for menor
    return array.slice(0, quantidade);
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
