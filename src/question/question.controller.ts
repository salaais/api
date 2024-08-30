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

@ApiTags('Questão')
@Controller('questao')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post('/cadastro/tsv')
  //   @ApiBearerAuth()
  //   @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cadastrar questões saparadas por espaços' })
  @ApiResponse({ status: 201, description: 'created' })
  async createQuestionsSpaces(@Body() request: CreateQuestionsTsvDto) {
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

  @Post('/gerar')
  @ApiOperation({ summary: 'Retorna questões geradas de forma aleatória' })
  @ApiResponse({ status: 200, description: 'success' })
  async generateQuestions(@Body() request: GenerateTestDto) {
    return this.questionService.generateTest(request);
  }

  @Post('/correcao_simples')
  @ApiOperation({ summary: 'Retorna questões geradas de forma aleatória' })
  @ApiResponse({ status: 200, description: 'success' })
  async testGrade(@Body() request: TestGradeDto) {
    return this.questionService.testGrade(request);
  }
}
