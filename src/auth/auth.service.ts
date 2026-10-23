import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service.js';
import { SignupDto } from './dto/signup.dto.js';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignupDto) {
    const existingUser = await this.usersService.findByEmail(signUpDto.email);

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(signUpDto.password, process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : 10);

    const user = await this.usersService.create({
      name: signUpDto.name,
      email: signUpDto.email,
      password: hashedPassword,
    });

    return {
      user: { id: user.id, name: user.name, email: user.email },
      accessToken: this.signToken({ id: user.id, email: user.email }),
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(loginDto.email);
    console.log('User found with email:', loginDto.email, user);

    if (!user) {
      console.log('User not found with email:', loginDto.email);
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      console.log('Invalid password for user:', loginDto.email);
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      user: { id: user.id, name: user.name, email: user.email },
      accessToken: this.signToken({ id: user.id, email: user.email }),
    };
  }

  private signToken(payload: { id: string; email: string }) {
    return this.jwtService.sign(payload);
  }
}
