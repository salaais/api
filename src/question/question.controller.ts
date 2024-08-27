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
    @Body() request: CreateQuestionsTsvDto,
  ) {
    return this.questionService.createQuestionsTsv(request);
  }

  @Post('/all')
  //   @ApiBearerAuth()
  //   @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Retornar Todas as questões funcionando: Key' })
  @ApiResponse({ status: 200, description: 'success' })
  async allQuestions(@Body() request: AllQuestionsDto) {
    return this.questionService.allQuestions(request);
  }

  @Post('/generate')
  @ApiOperation({summary:'Retorna questões geradas de forma aleatória'})
  @ApiResponse({status:200, description:'success'})
  async generateQuestions(@Body() request: GenerateTestDto){
    return this.questionService.generateTest(request);
  }
}
