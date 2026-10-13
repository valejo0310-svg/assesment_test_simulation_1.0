import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index
} from 'typeorm';


export enum RequestStatus {
  PENDING = 'PENDIENTE',
  IN_PROGRESS = 'EN_GESTION',
  RESOLVED = 'RESUELTA',
}

@Entity('requests')
@Index('IDX_requests_estado', ['estado'])
@Index('IDX_requests_asesor', ['asesor'])
@Index('IDX_requests_creadaEn', ['creadaEn'])
export class Request {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cliente: string;

  @Column()
  descripcion: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  asesor: string | null;

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