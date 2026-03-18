import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User created', schema: {
    example: { id: 'uuid', email: 'alice@test.com', role: 'USER' },
  }})
  @ApiResponse({ status: 409, description: 'Email already in use' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login and receive JWT token' })
  // SWAGGER-MISMATCH-2: Documents access_token + nested user object.
  // Actual returns { token, userId } — field names differ (BUG-10).
  @ApiResponse({ status: 200, description: 'Login successful', schema: {
    example: {
      access_token: 'eyJhbGci...',
      user: { id: 'uuid', email: 'alice@test.com' },
    },
  }})
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
