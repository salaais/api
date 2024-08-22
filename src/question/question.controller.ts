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

@ApiTags('Questions')
@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post('/tsv')
  //   @ApiBearerAuth()
  //   @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cadastrar questões saparadas por espaços' })
  @ApiResponse({ status: 201, description: 'created' })
  async createQuestionsSpaces(
    @Body() createQuestionsDto: CreateQuestionsTsvDto,
  ) {
    return this.questionService.createQuestionsTsv(createQuestionsDto);
  }

  @Post('/all')
  //   @ApiBearerAuth()
  //   @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Retornar Todas as questões funcionando: Key' })
  @ApiResponse({ status: 200, description: 'success' })
  async allQuestions(@Body() allQuestions: AllQuestionsDto) {
    return this.questionService.allQuestions(allQuestions);
  }
}
