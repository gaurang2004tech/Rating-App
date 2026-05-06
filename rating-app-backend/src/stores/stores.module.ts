// src/stores/stores.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { Store } from '../entities/store.entity';
import { Rating } from '../entities/rating.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Store, Rating])],
    providers: [StoresService],
    controllers: [StoresController],
})
export class StoresModule { }
