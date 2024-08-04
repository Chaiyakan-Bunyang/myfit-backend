import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
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
  async login(
    @Body() userCredentialDto: UserCredentialDto,
    @Res({ passthrough: true }) res,
  ) {
    const result = await this.authService.Login(userCredentialDto);
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      path: '/',
      secure: true,
      domain: 'localhost',
    });
    return { message: 'Login Successful' };
  }

  @Post('/logout')
  async logout(@Res({ passthrough: true }) res) {
    res.clearCookie('access_token', {
      path: '/',
    });
    // res.cookie('aaa', '', {
    //   httpOnly: true,
    //   path: '/',
    //   domain: 'localhost',
    //   secure: true,
    //   expires: new Date(0), // This will expire the cookie immediately
    // });
    // res.cookie('access_token', '', { expires: new Date(Date.now()) });
    return {};
  }

  //Check Token
  @Get('/authentication')
  @UseGuards(AuthGuard())
  authentication(@Req() req) {
    const userData = {
      username: req.user.username,
      email: req.user.email,
    };
    return userData;
  }
}
