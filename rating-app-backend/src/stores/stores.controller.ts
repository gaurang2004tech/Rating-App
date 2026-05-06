// src/stores/stores.controller.ts
import {
    Controller,
    Get,
    Post,
    Param,
    Body,
    Query,
    UseGuards,
    Request,
    ParseIntPipe,
} from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';

@Controller('stores')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StoresController {
    constructor(private readonly storesService: StoresService) { }

    // Admin: create store
    @Post()
    @Roles(UserRole.ADMIN)
    create(@Body() dto: CreateStoreDto) {
        return this.storesService.create(dto);
    }

    // Admin or Normal User: list stores (normal users also get their own rating per store)
    @Get()
    findAll(
        @Request() req: any,
        @Query('name') name?: string,
        @Query('email') email?: string,
        @Query('address') address?: string,
    ) {
        const userId = req.user.role === UserRole.USER ? req.user.id : undefined;
        return this.storesService.findAll({ name, email, address }, userId);
    }

    // Store Owner: get their own dashboard
    @Get('owner/dashboard')
    @Roles(UserRole.STORE_OWNER)
    getOwnerDashboard(@Request() req: any) {
        return this.storesService.getOwnerDashboard(req.user.id);
    }

    // Admin: get single store
    @Get(':id')
    @Roles(UserRole.ADMIN)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.storesService.findOne(id);
    }
}
