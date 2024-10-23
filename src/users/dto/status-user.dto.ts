import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class StatusDesativadoDto {
  @ApiProperty({ example: false })
  @IsBoolean()
  desativado: boolean;
}

export class StatusDeletadoDto {
  @ApiProperty({ example: false })
  @IsBoolean()
  deletado: boolean;
}
