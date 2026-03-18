import { IsEmail, IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../users/entities/user.entity';

export class RegisterDto {
  @ApiProperty({ example: 'alice@test.com' })
  @IsEmail()
  email: string;

  // BUG-1 effect: Without global ValidationPipe, this decorator never runs
  @ApiProperty({ example: 'Alice123!' })
  @IsString()
  password: string;

  // SWAGGER-MISMATCH-1: Shown as required (no ApiPropertyOptional),
  // but actual code treats it as optional and defaults to USER when omitted.
  // QA may expect 400 when role is omitted — actual: 201 success.
  @ApiProperty({ enum: UserRole, description: 'Required. Must be ADMIN or USER.' })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
