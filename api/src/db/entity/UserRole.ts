import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany } from 'typeorm';
import { User } from './User';

@Entity()
export class UserRole extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@OneToMany(type => User, user => user.role, {
		cascade: true
	})
	users: User[];
}
