import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ default: 'active', type: 'enum', enum: ['active', 'inactive'] })
  status: 'active' | 'inactive';

  @Column({ type: 'enum', enum: ['user', 'staff', 'admin'], default: 'user' })
  role: 'user' | 'staff' | 'admin';

  @CreateDateColumn()
  createdAt: Date;
}
