import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

import type { Relation } from 'typeorm';

import { Request } from './request.entity.js';

export enum HistoryEventType {
  CREATION = 'CREACION',
  ASSIGNMENT = 'ASIGNACION',
  STATUS = 'ESTADO',
}

@Entity('request_history')
export class RequestHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  solicitudId: number;

  @ManyToOne(() => Request, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'solicitudId',
  })
  solicitud: Relation<Request>;

  @Column({
    type: 'enum',
    enum: HistoryEventType,
  })
  tipoEvento: HistoryEventType;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  valorAnterior: string | null;

  @Column()
  valorNuevo: string;

  @Column()
  usuarioActor: string;

  @CreateDateColumn()
  fechaEvento: Date;
}