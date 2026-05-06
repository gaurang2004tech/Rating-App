// src/entities/store.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';

@Entity('stores')
export class Store {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 60 })
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ length: 400 })
    address: string;

    @Column({ nullable: true })
    ownerId: number;

    @ManyToOne('User', 'stores', { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'ownerId' })
    owner: any;

    @OneToMany('Rating', 'store')
    ratings: any[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
