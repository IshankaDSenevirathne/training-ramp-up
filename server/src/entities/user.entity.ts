import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum Role {
  guest = 'GUEST',
  admin = 'ADMIN',
}

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.guest,
  })
  role: Role;
  @Column()
  password: string;

  @Column({
    unique: true,
  })
  email: string;
}
