import { Controller, Post, Get, Body, Query, BadRequestException, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')

  @UsePipes(new ValidationPipe({ transform: true })) 

  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Get('verify')
  async verifyAccount(@Query('code') code: string) {
    if (!code) {
      throw new BadRequestException('Code is required');
    }
    return this.authService.verifyAccount(code);
  }

  @Post('login')
  async login(@Body() dto: { email: string; password: string }) {
    return this.authService.login(dto);
  }
}