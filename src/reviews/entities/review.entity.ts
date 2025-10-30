import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { current_TimeStamp } from "../../utils/constrant";
import { Product } from "../../products/entities/products.entity";
import { User } from "../../users/entities/user.entity";

@Entity({ name: 'reviews' })
export class Review {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 150 })
    comment: string;
    
    @Column({type:'float'})
    rating: number

    @CreateDateColumn({ type: 'timestamp', default: () => current_TimeStamp })
    createAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => current_TimeStamp, onUpdate: current_TimeStamp })
    updateAt: Date;
    @ManyToOne(() => Product, (product) => product.reviews,{onDelete:'CASCADE'})
    product: Product;
    @ManyToOne(() => User, (user) => user.reviews,{onDelete:'CASCADE'})
    user: User

}