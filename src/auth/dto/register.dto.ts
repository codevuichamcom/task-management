import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../users/entities/user.entity';

export class RegisterDto {
  @ApiProperty({ example: 'alice@test.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Alice123!' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({ enum: UserRole, description: 'Optional. Defaults to USER.' })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
