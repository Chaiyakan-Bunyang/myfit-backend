import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Res,
  Response,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserCredentialDto } from './dto/user-credential.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async hashPassword(password: string, salt: string) {
    return bcrypt.hash(password, salt);
  }
  async Register(userCredentialDto: UserCredentialDto) {
    const { email, username, password } = userCredentialDto;
    const salt = bcrypt.genSaltSync();
    const user = new User();
    user.username = username;
    user.password = await this.hashPassword(password, salt);
    user.email = email;
    try {
      await user.save();
      console.log('Register Success');
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Email already exits!');
      } else {
        throw new InternalServerErrorException();
      }
    }
    return user;
  }

  async Login(userCredentialDto: UserCredentialDto) {
    const { email, password } = userCredentialDto;
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      const user_match = await bcrypt.compare(password, user.password);
      if (!user_match) {
        throw new HttpException(
          'The password is incorrect!',
          HttpStatus.BAD_REQUEST,
        );
      }
      console.log(`User ${user.username} Login Successful`);
      const payload = { user };
      // const token = await this.jwtService.sign(payload);
      return { access_token: this.jwtService.sign(payload) };
    } else {
      throw new HttpException(
        'The Email is incorrect!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
