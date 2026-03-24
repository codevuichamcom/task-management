import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProjectDto {
  @ApiPropertyOptional({ example: 'Renamed Project' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;
}
