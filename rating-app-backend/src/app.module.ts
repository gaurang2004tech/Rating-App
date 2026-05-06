// src/app.module.ts
import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { User, UserRole } from './entities/user.entity';
import { Store } from './entities/store.entity';
import { Rating } from './entities/rating.entity';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StoresModule } from './stores/stores.module';
import { RatingsModule } from './ratings/ratings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_NAME', 'rating_app'),
        entities: [User, Store, Rating],
        synchronize: true, // Auto-create tables in dev. For prod use migrations.
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User]),
    AuthModule,
    UsersModule,
    StoresModule,
    RatingsModule,
  ],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async onApplicationBootstrap() {
    // Seed admin user
    const adminEmail = 'admin@app.com';
    const existingAdmin = await this.userRepository.findOne({ where: { email: adminEmail } });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('Admin@12345', 10);
      const admin = this.userRepository.create({
        name: 'System Administrator',
        email: adminEmail,
        password: hashedPassword,
        address: 'Admin Setup',
        role: UserRole.ADMIN,
      });
      await this.userRepository.save(admin);
      console.log('Seeded Admin User: admin@app.com / Admin@12345');
    }
  }
}
