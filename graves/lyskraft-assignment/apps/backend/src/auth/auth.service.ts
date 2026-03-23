import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { CreateUserDto, LoginUserDto } from './dtos';

const prisma = new PrismaClient();

const saltRounds = 10;

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async register(createUserDto: CreateUserDto) {
    const userExists = await prisma.storeStaff.findUnique({
      where: { email: createUserDto.email },
    });

    if (userExists) {
      throw new UnauthorizedException('User already exists');
    }

    const salt = (await bcrypt.genSalt(saltRounds)) as string;
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    const user = await prisma.storeStaff.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPassword,
        salt,
        storeId: createUserDto.storeId,
      },
    });
    return {
      message: 'User Successfully Registered',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await prisma.storeStaff.findUnique({
      where: { email: loginUserDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const store = await prisma.store.findUnique({
      where: { id: user.storeId },
      include: {
        address: true,
      },
    });

    const payload = { email: user.email, sub: user.id };
    return {
      token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      store,
    };
  }
}
