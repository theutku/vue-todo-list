import { User } from '../db/entity/User';
import DbController from './dbController';
import * as bcrypt from 'bcryptjs';
import { ValidationError } from '../lib/http';
import { RegisterUser } from '../db/models/user';
import { UserRole } from '../db/entity/UserRole';

export default class UserManager extends DbController {
	constructor() {
		super();
	}

	static createUser(model: RegisterUser) {
		return this.checkForExistingEmail(model.email).then(() => {
			const newUser = new User();
			newUser.fillProps(model);
			newUser.fillMeta()
			newUser.hashPassword();

			return UserRole.findOne({ name: 'user' }).then((role) => {
				newUser.role = role;
				return newUser.save().then(registeredUser => {
					return registeredUser;
				}).catch(err => {
					return err;
				});
			});
		}).catch(err => err);
	}

	static resetUserPassword(user: User) {
		const randomPassword = Math.floor(Math.random() * 1000000).toString();
		const passwordSalt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(randomPassword, passwordSalt);
		user.password = hash;

		// TODO: EMAIL NEW PASS (randomPassword)
		return user.save().then(updatedUser => {
			return updatedUser;
		}).catch(err => err);
	}

	static updateUser(user: User) {
		return this.connection.manager.save(user).then(updatedUser => {
			return updatedUser;
		}).catch(err => err);
	}

	private static checkForExistingEmail(email: string) {
		return User.findOne({
			email: email
		}).then(user => {
			if (user)
				return Promise.reject(new ValidationError('A user with the e-mail already exists.'));
			return Promise.resolve();
		}).catch(err => err);
	}
}
