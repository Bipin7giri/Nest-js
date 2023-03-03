import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/AllEntites';
import { SoftDelete } from 'src/AllEntites/HelperEntites/SoftDelete.entites';
@Entity()
export class User extends SoftDelete {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'user_id',
  })
  id: number;
  @ApiProperty()
  @Column({
    nullable: false,
    default: '',
  })
  username: string;
  @ApiProperty()
  @Column({
    name: 'email_address',
    nullable: false,
    default: '',
  })
  email: string;
  @ApiProperty()
  @Column({
    nullable: false,
    default: '',
  })
  password: string;
  @ManyToOne(() => Role, (role) => role.userId)
  @JoinColumn({ name: 'role_id' })
  roleId: Role;
}
