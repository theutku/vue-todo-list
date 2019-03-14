import * as express from 'express';
import IRouterBase from '../lib/interfaces/routerBase';
import { ServerError, HttpError, PermissionError, NotFoundError, ValidationError } from '../lib/http';
import * as validator from 'validator';
import DbController from '../controllers/dbController';
import AuthorizationManager from '../lib/auth';
import UserManager from '../controllers/user';
import { LoginUser } from '../db/models/user';

class AccountRouter implements IRouterBase {
	router: express.Router;

	constructor() {
		this.router = express.Router();
		this.initRoutes();
	}

	private generateUserTokenWithoutPassword(user: any) {
		return AuthorizationManager.generateToken(user)
			.then(token => {
				const { password, ...userWithoutPassword } = user;
				return {
					...userWithoutPassword,
					token
				};
			})
			.catch(err => err);
	}

	loginRoute(req: express.Request, res: express.Response, next: express.NextFunction) {
		const body = req.body;
		let loginUser = new LoginUser(body);
		return this.login(loginUser)
			.then(result => res.send(result))
			.catch((e: HttpError) => {
				next(e);
			});
	}

	private login(model: LoginUser) {
		const isModelValid = model.validate();
		if (isModelValid) {
			return DbController.getUserByEmail(model.email).then(user => {
				if (user) {
					if (!user.isActive) {
						return Promise.reject(new PermissionError('User not active.'));
					}
					return user.checkIfUnencryptedPasswordIsValid(model.password).then(success => {
						if (success) {
							user.lastLogin = new Date();
							return user.save().then(updatedUser => {
								return this.generateUserTokenWithoutPassword(updatedUser);
							}).catch(err => {
								return this.generateUserTokenWithoutPassword(user);
							});
						} else {
							return Promise.reject(new PermissionError('Kullanıcı adı veya şifre hatalı'));
						}
					});
				}
				return Promise.reject(new PermissionError('Kullanıcı adı veya şifre hatalı girilmiştir.'));
			});
		} else {
			return Promise.reject(new ValidationError('Credentials not valid.'));
		}
	}

	forgotPasswordRoute(req: express.Request, res: express.Response, next: express.NextFunction) {
		let body = req.body;
		const email = body.email;
		return this.forgotPassword(email)
			.then(() => {
				res.status(200).send('User updated');
			})
			.catch(err => {
				next(err);
			});
	}

	private forgotPassword(email: string) {
		const isEmailValid = email && validator.isEmail(email) && !validator.isEmpty(email);
		if (isEmailValid) {
			return DbController.getUserByEmail(email).then(user => {
				if (user) {
					return UserManager.resetUserPassword(user)
						.then(updatedUser => updatedUser)
						.catch(() => {
							return Promise.reject(new ServerError('Error updating User'));
						});
				}
				return Promise.reject(new NotFoundError('user not found'));
			});
		}
		return Promise.reject(new ValidationError('email not valid'));
	}

	renewTokenRoute(req: express.Request, res: express.Response, next: express.NextFunction) {
		let token = req.body.token;
		return this.renewToken(token)
			.then(response => {
				res.send({ user: response });
			})
			.catch(err => {
				next(err);
			});
	}

	private renewToken(token: string) {
		return AuthorizationManager.verifyUserToken(token).then(verification => {
			if (verification.isAuthenticated) {
				return this.generateUserTokenWithoutPassword(verification.user)
					.then(userWithoutPass => userWithoutPass)
					.catch(() => {
						return Promise.reject(new PermissionError('User not authenticated.'));
					});
			}
			return Promise.reject(new PermissionError(verification.error));
		});
	}

	initRoutes() {
		this.router.post('/login', this.loginRoute.bind(this));
		this.router.post('/forgotpassword', this.forgotPasswordRoute.bind(this));
		this.router.post('/renewtoken', this.renewTokenRoute.bind(this));
	}
}

const accountRouter = new AccountRouter();

export default accountRouter.router;
