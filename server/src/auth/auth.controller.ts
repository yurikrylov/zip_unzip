import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto, AuthResponse } from './dto/auth.dto';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {

  constructor(private authService:AuthService) {}

  @ApiOperation({summary: 'Получение токена'})
  @ApiResponse({status: 200, type: AuthResponse})
  @Post()
  login(@Body() authBody: AuthDto) {
    return this.authService.login(authBody)
  }
}
