import { Column, Entity, CreateDateColumn, UpdateDateColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { current_TimeStamp } from "src/utils/constrant";
import { Product } from "src/products/entities/products.entity";
import { Review } from "src/reviews/entities/review.entity";
import { Exclude } from "class-transformer";


export enum UserType {
    ADMIN = 'admin',
    NORMAL_USER = 'normal_user'
}

@Entity({ name: 'Users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: 'varchar', length: 150, nullable: true })
    username: string;
    @Column({ type: 'varchar', length: 150, unique: true, })
    email: string;
    @Column({ type: 'varchar' })
    @Exclude()
    password: string;
    @Column({ type: 'enum', enum: UserType, default: UserType.NORMAL_USER })
    userType: UserType;
    @Column({ type: 'boolean', default: false })
    isAccountVerified: boolean;
    @Column({ type: 'varchar', nullable: true })
    nameProfileImage:string;

    @CreateDateColumn({ type: 'timestamp', default: () => current_TimeStamp })
    createAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => current_TimeStamp, onUpdate: current_TimeStamp })
    updateAt: Date;

    @OneToMany(() => Product, (product) => product.user)
    products: Product[];
    @OneToMany(() => Review, (review) => review.user)
    reviews: Review[];

}