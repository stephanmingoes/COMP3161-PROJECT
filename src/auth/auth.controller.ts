import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto, SignInUserDto } from './dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() user: CreateUserDto) {
    return await this.authService.signup(user);
  }
  @Post('/signin')
  async signIn(@Body() user: SignInUserDto) {
    return await this.authService.signin(user);
  }
}
