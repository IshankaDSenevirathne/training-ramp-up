import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('session')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    default: false,
  })
  valid: boolean;

  @Column()
  name: string;

  @Column()
  email: string;
}
