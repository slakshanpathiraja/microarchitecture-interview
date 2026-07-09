import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { AuditActionType } from '@app/common';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  userId?: string;

  @Column({ nullable: true })
  userEmail?: string;

  @Column({
    type: 'enum',
    enum: AuditActionType,
  })
  action: AuditActionType;

  @Column({ type: 'text' })
  details: string;

  @CreateDateColumn()
  timestamp: Date;
}
