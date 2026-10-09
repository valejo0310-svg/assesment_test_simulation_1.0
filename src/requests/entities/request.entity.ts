import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

export enum RequestStatus {
  PENDING = 'PENDIENTE',
  IN_PROGRESS = 'EN_GESTION',
  RESOLVED = 'RESUELTA',
}

@Entity('requests')
export class Request {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cliente: string;

  @Column()
  descripcion: string;

  @Column()
  asesor: string;

  @Column({
    type: 'enum',
    enum: RequestStatus,
    default: RequestStatus.PENDING,
  })
  estado: RequestStatus;

  @CreateDateColumn()
  creadaEn: Date;

  @UpdateDateColumn()
  actualizadaEn: Date;
}