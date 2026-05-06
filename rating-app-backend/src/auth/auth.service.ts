// src/auth/auth.service.ts
import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) { }

    async register(dto: RegisterDto) {
        const existing = await this.userRepository.findOne({ where: { email: dto.email } });
        if (existing) throw new ConflictException('Email already in use');

        const hashed = await bcrypt.hash(dto.password, 10);
        const user = this.userRepository.create({
            ...dto,
            password: hashed,
            role: UserRole.USER,
        });
        await this.userRepository.save(user);
        const { password, ...result } = user;
        return result;
    }

    async login(dto: LoginDto) {
        const user = await this.userRepository.findOne({ where: { email: dto.email } });
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const passwordMatch = await bcrypt.compare(dto.password, user.password);
        if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');

        const payload = { sub: user.id, email: user.email, role: user.role };
        const token = this.jwtService.sign(payload);
        const { password, ...userData } = user;
        return { access_token: token, user: userData };
    }
}
