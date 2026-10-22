import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.findByEmail(createUserDto.email);

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : 10,
    );

    const user = this.repo.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.repo.save(user);
  }

  async findByEmailWithPassword(email: string) {
    return this.repo.findOne({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        status: true,
      },
    });
  }

  async findById(id: string) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  getAllUsers(
    skip: number,
    take: number,
    status?: 'active' | 'inactive',
    role?: 'user' | 'staff' | 'admin',
  ) {
    return this.repo.find({
      skip,
      take,
      where: {
        ...(status !== undefined && { status }),
        ...(role !== undefined && { role }),
      },
    });
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findById(id);
    await this.repo.update(user.id, updateUserDto);
    return this.findById(id);
  }
}
