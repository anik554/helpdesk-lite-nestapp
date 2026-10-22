import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { FilterQueryUserDto } from './dto/filter-query-user.dto.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  getAllUsers(@Query() filterQueryUserDto: FilterQueryUserDto) {
    return this.userService.getAllUsers(
      0,
      10,
      filterQueryUserDto.status,
      filterQueryUserDto.role,
    );
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Get('email/:email')
  getUserByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Get('email-with-password/:email')
  async getUserByEmailWithPassword(@Param('email') email: string) {
    return await this.userService.findByEmailWithPassword(email);
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.updateUser(id, updateUserDto);
  }
}
