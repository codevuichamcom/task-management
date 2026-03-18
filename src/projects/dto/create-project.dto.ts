import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 'Alpha Project' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
