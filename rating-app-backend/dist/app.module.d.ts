import { OnApplicationBootstrap } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class AppModule implements OnApplicationBootstrap {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    onApplicationBootstrap(): Promise<void>;
}
