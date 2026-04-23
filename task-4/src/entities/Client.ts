import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Client{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    shopName!: string;

    @Column()
    accessToken!: string;

    @Column({type: "timestamp", nullable:true})
    lastSyncStart!: Date | null;

    @Column({type: "timestamp", nullable:true})
    lastSyncEnd!: Date | null;
}