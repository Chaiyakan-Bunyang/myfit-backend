import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserCredentialDto } from './dto/user-credential.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get()
  getAllUsers() {
    return 'users';
  }

  @Post('/register')
  @UsePipes(ValidationPipe)
  register(@Body() userCredentialDto: UserCredentialDto) {
    return this.authService.Register(userCredentialDto);
  }

  @Post('/login')
  login(@Body() userCredentialDto: UserCredentialDto) {
    return this.authService.Login(userCredentialDto);
  }

  @Get('/test')
  @UseGuards(AuthGuard())
  test(@Req() req) {
    // console.log(req);
    return req.user.email;
  }
}
