import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from "typeorm";
import { Review } from "../../reviews/entities/review.entity"
import { current_TimeStamp } from "src/utils/constrant";
import { User } from "src/users/entities/user.entity";


@Entity({ name: 'products' })
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 150 })
    title: string;

    @Column()
    description: string;

    @Column({ type: 'float' })
    price: number;

    @CreateDateColumn({ type: 'timestamp', default: () => current_TimeStamp })
    createAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => current_TimeStamp, onUpdate: current_TimeStamp })
    updateAt: Date;

    @OneToMany(() => Review, (review) => review.product)
    reviews: Review[];

    @ManyToOne(() => User, (user) => user.products)
    user: User
}