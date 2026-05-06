// src/entities/rating.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Unique,
} from 'typeorm';

@Entity('ratings')
@Unique(['userId', 'storeId'])
export class Rating {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    storeId: number;

    @Column({ type: 'int' })
    value: number;

    @ManyToOne('User', 'ratings', { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: any;

    @ManyToOne('Store', 'ratings', { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'storeId' })
    store: any;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
