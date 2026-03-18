import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'alice@test.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Alice123!' })
  @IsString()
  password: string;
}
