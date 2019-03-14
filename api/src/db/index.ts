import 'reflect-metadata';
import { createConnection, Connection } from 'typeorm';
import { User } from './entity/User';
import config from '../config';
import { UserRole } from './entity/UserRole';
import { RegisterUser } from './models/user';

interface IDbOptions {
	type: 'mysql';
	host: string;
	port: number;
	username: string;
	password: string;
	database: string;
	synchronize: boolean;
	logging: boolean;
	entities: any[];
	migrations: any[];
	subscribers: any[];
	autoSchemaSync: boolean;
}

export default class DbManager {
	static connection: Connection;

	private static dbOptions: IDbOptions = {
		type: 'mysql',
		host: config.dbaddress,
		port: config.dbport,
		database: config.dbname,
		username: config.dbuser,
		password: config.dbpwd,
		logging: false,
		synchronize: true,
		entities: [User, UserRole],
		migrations: ['src/db/migration/**/*.ts'],
		subscribers: ['src/db/subscriber/**/*.ts'],
		autoSchemaSync: true
	};

	static connect() {
		return new Promise((resolve, reject) => {
			createConnection(this.dbOptions).then(async connection => {
				return this.seed().then(() => {
					DbManager.connection = connection;
					console.log('Database connection established.');
					resolve();
				}).catch(err => err);
			}).catch(error => reject(error));
		});
	}

	private static seed() {
		const userRole = new UserRole();
		userRole.name = 'user';

		const domainAdminRole = new UserRole();
		domainAdminRole.name = 'domainAdmin';

		return UserRole.findAndCount().then(value => {
			let savedRoles = value[0];
			if (!savedRoles.some(role => role.name == userRole.name)) userRole.save();
			if (!savedRoles.some(role => role.name == domainAdminRole.name)) domainAdminRole.save();
		}).then(() => {
			return DbManager.seedDomainAdmin();
		}).catch(err => err);
	}

	private static seedDomainAdmin() {
		return User.findOne({ email: 'admin@admin.com' }).then((user) => {
			if (!user) {
				const model = new RegisterUser({
					email: 'admin@admin.com',
					firstName: 'Admin',
					lastName: 'Adminoglu',
					password: '123456',
					confirmPassword: '123456',
					phoneNumber: '+1234567890',
					createdById: 0
				});

				const newUser = new User();
				newUser.fillProps(model);
				newUser.fillMeta()
				newUser.hashPassword();

				return UserRole.findOne({ name: 'domainAdmin' }).then((role) => {
					newUser.role = role;
					return newUser.save().then(registeredUser => {
						return registeredUser;
					}).catch(err => {
						return err;
					});
				});
			}
			return Promise.resolve();
		});
	}
}
