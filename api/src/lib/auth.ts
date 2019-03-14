import * as jwt from 'jsonwebtoken';
import config from '../config';
import { ITokenVerificationResponse } from '../middleware/auth';
import DbController from '../controllers/dbController';
import { User } from '../db/entity/User';
import { PermissionError, NotFoundError } from './http';

export default class AuthorizationManager {
	static generateToken(user: User) {
		return new Promise((resolve, reject) => {
			jwt.sign(
				{
					exp: Math.floor(Date.now() / 1000) + 60 * 60,
					sub: user.id.toString()
				},
				config.jwtSecret,
				(err, token) => {
					if (err) reject(err);
					else resolve(token);
				}
			);
		});
	}

	static isUserDomainAdmin(userId: number) {
		return User.findOne(userId, { relations: ['role'] }).then((user) => {
			if (!user)
				return Promise.reject(new NotFoundError('User not found'));
			if (user.role.name === 'domainAdmin')
				return Promise.resolve();
			return Promise.reject(new PermissionError('User not authorized.'));
		});
	}

	static async verifyUserToken(token: string) {
		let verificationResult: ITokenVerificationResponse = {
			isAuthenticated: false,
			user: null,
			error: null
		};

		return new Promise<ITokenVerificationResponse>(resolve => {
			jwt.verify(token, config.jwtSecret, (err, result: any) => {
				if (err) {
					verificationResult.error = err;
					resolve(verificationResult);
				} else {
					let userId = result.sub;
					DbController.getUserById(userId).then(user => {
						if (!user) {
							verificationResult.error = 'User not found';
						} else {
							verificationResult.isAuthenticated = true;
							verificationResult.user = user;
						}
						resolve(verificationResult);
					}).catch(error => {
						verificationResult.error = error;
						resolve(verificationResult);
					});
				}
			});
		});
	}
}
