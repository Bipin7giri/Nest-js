import { User } from 'src/AllEntites';
import { SoftDelete } from 'src/AllEntites/HelperEntites/SoftDelete.entites';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class Role extends SoftDelete {
  @PrimaryColumn({
    type: 'bigint',
  })
  id: number;

  @Column()
  name: string;

  @Column('text', { array: true })
  roles: string[];

  @OneToMany(() => User, (user) => user.roleId)
  userId: User[];
}
