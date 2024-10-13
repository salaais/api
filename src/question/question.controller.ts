import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { QuestionService } from './question.service';
import { CreateQuestionsTsvDto } from './dto/create-questions-tsv';
import { AllQuestionsDto } from './dto/all-questions';
import { GenerateTestDto } from './dto/generate-test';
import { TestGradeDto } from './dto/test-grade';
import { GenerateTestRandomDto } from './dto/generate-test-random';
import { QuestionBySubject } from './dto/questao-por-materia';

@ApiTags('Questão')
@Controller('questao')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post('/cadastro/tsv')
  //   @ApiBearerAuth()
  //   @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cadastrar questões saparadas por espaços' })
  @ApiResponse({ status: 201, description: 'created' })
  async createQuestionsTsv(@Body() request: CreateQuestionsTsvDto) {
    return this.questionService.createQuestionsTsv(request);
  }

  @Post('/filtrar')
  //   @ApiBearerAuth()
  //   @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Retornar Todas as questões funcionando: Key' })
  @ApiResponse({ status: 200, description: 'success' })
  async allQuestions(@Body() request: AllQuestionsDto) {
    return this.questionService.allQuestions(request);
  }

  @Post('/gerar-prova/aleatoria')
  @ApiOperation({ summary: 'Retorna questões geradas de forma aleatória' })
  @ApiResponse({ status: 200, description: 'success' })
  async generateTestRandom(@Body() request: GenerateTestRandomDto) {
    return this.questionService.generateTestRandom(request);
  }

  @Post('/gerar-prova/normal')
  @ApiOperation({ summary: 'Retorna questões com base nos keys' })
  @ApiResponse({ status: 200, description: 'success' })
  async generateTest(@Body() request: GenerateTestDto) {
    return this.questionService.generateTest(request);
  }

  @Post('/gerar-prova/materia')
  @ApiOperation({ summary: 'Retorna questões com base nos keys' })
  @ApiResponse({ status: 200, description: 'success' })
  async generateTestBySubject(@Body() request: QuestionBySubject) {
    return this.questionService.generateTestBySubject(request);
  }

  @Post('/correcao_simples')
  @ApiOperation({ summary: 'Retorna questões geradas de forma aleatória' })
  @ApiResponse({ status: 200, description: 'success' })
  async testGrade(@Body() request: TestGradeDto) {
    return this.questionService.testGrade(request);
  }
}
