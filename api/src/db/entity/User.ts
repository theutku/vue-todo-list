import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany } from 'typeorm';
import { UserRole } from './UserRole';
import { Patient } from './Patient';
import { Reminder } from './Reminder';
import * as bcrypt from 'bcryptjs';
import { RegisterUser } from '../models/user';


@Entity()
export class User extends BaseEntity {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	email: string;

	@Column()
	firstName: string;

	@Column()
	lastName: string;

	@Column()
	password: string;

	@Column()
	phoneNumber: string;

	@Column()
	createdDate: Date;

	@Column()
	lastLogin?: Date;

	@Column()
	isActive: boolean;

	@ManyToOne(type => UserRole, userRole => userRole.users)
	role: UserRole;

	@OneToMany(type => Patient, patient => patient.user, {
		cascade: true,
		onDelete: 'CASCADE'
	})
	patients: Patient[];

	@OneToMany(type => Reminder, reminder => reminder.user, {
		cascade: true,
		onDelete: 'CASCADE'
	})
	reminders: Reminder[];




	fillProps(registerModel: RegisterUser) {
		this.email = registerModel.email;
		this.firstName = registerModel.firstName;
		this.lastName = registerModel.lastName;
		this.phoneNumber = registerModel.phoneNumber;
		this.password = registerModel.password;
	}

	fillMeta() {
		this.createdDate = new Date();
		this.lastLogin = new Date();
		this.isActive = true;
	}

	hashPassword() {
		const passwordSalt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(this.password, passwordSalt);
		this.password = hash;
	}

	checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
		return bcrypt.compare(unencryptedPassword, this.password);
	}
}
