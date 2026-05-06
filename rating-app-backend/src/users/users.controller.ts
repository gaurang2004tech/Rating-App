// src/users/users.controller.ts
import {
    Controller,
    Get,
    Post,
    Param,
    Body,
    Patch,
    Query,
    UseGuards,
    Request,
    ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    // Admin: get stats
    @Get('stats')
    @Roles(UserRole.ADMIN)
    getStats() {
        return this.usersService.getStats();
    }

    // Admin: create user
    @Post()
    @Roles(UserRole.ADMIN)
    create(@Body() dto: CreateUserDto) {
        return this.usersService.create(dto);
    }

    // Admin: list users with filters
    @Get()
    @Roles(UserRole.ADMIN)
    findAll(
        @Query('name') name?: string,
        @Query('email') email?: string,
        @Query('address') address?: string,
        @Query('role') role?: string,
    ) {
        return this.usersService.findAll({ name, email, address, role });
    }

    // Admin: get single user detail
    @Get(':id')
    @Roles(UserRole.ADMIN)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.findOne(id);
    }

    // Any logged in user: update own password
    @Patch('me/password')
    updatePassword(@Request() req: any, @Body() dto: UpdatePasswordDto) {
        return this.usersService.updatePassword(req.user.id, dto);
    }
}
