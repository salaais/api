import { IsString, IsNotEmpty } from 'class-validator';

export class RemoveUserDto {
  @IsString()
  @IsNotEmpty()
  access_token: string;
}
