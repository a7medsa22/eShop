import { Column, Entity, PrimaryGeneratedColumn,CreateDateColumn,UpdateDateColumn } from "typeorm";
const current_TimeStamp = 'CURRENT_TIMESTAMP(6)';
@Entity()
export class Product{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type:'varchar',length:150})
    title: string;

    @Column()
    description: string;

    @Column({type:'float'})
    price: number;

    @CreateDateColumn({ type: 'timestamp', default: () => current_TimeStamp })
    createAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => current_TimeStamp ,onUpdate: current_TimeStamp })
    updateAt: Date;
}