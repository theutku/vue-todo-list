import * as express from 'express';
import IRouterBase, { IRouterExport } from '../lib/interfaces/routerBase';
import { PermissionError } from '../lib/http';
import AuthorizationManager from '../lib/auth';

const router = express.Router();

class TokenRouter implements IRouterBase {

	constructor(public router: express.Router) {
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

	renewTokenRoute(req: express.Request, res: express.Response, next: express.NextFunction) {
		let token = req.body.token;
		return this.renewToken(token)
			.then(user => {
				res.send(user);
			})
			.catch(err => {
				next(err);
			});
	}

	private renewToken(token: string) {
		return AuthorizationManager.verifyUserToken(token).then(verification => {
			if (verification.isAuthenticated) {
				return this.generateUserTokenWithoutPassword(verification.user)
					.catch(() => {
						return Promise.reject(new PermissionError('User not authenticated.'));
					});
			}
			return Promise.reject(new PermissionError(verification.error));
		});
	}

	initRoutes() {
		this.router.post('/renewtoken', this.renewTokenRoute.bind(this));
	}
}

let tokenRouter: IRouterExport = {
	router: router,
	controller: TokenRouter
};

export default tokenRouter;
