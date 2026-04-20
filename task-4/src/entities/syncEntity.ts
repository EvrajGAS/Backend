import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class SyncLog{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: "timestamp", nullable:true})
    lastSyncTime!: Date | null;
}