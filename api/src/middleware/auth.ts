import * as express from 'express';
import Middleware from './base';
import { IApiRequest } from '../lib/http';
import { User } from '../db/entity/User';
import AuthorizationManager from '../lib/auth';

export interface ITokenVerificationResponse {
    isAuthenticated: boolean;
    user: User;
    error: any;
}

class AuthorizationMiddleware extends Middleware {

    constructor(routers: any) {
        super(routers);
        routers.forEach(router => {
            router.router.use(this.verifyUser.bind(this))
            new router.controller(router.router);
        });
    }

    private async verifyUser(req: IApiRequest, res: express.Response, next: express.NextFunction) {
        const bearerHeader = <string>req.headers['authorization'];
        if (typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(' ');
            const token = bearer[1];

            await AuthorizationManager.verifyUserToken(token).then((result: ITokenVerificationResponse) => {
                if (result.isAuthenticated) {
                    req.user = result.user;
                    next();
                } else {
                    res.status(403).send(result.error);
                }
            });
        } else {
            res.status(403).send('Not authorized');
        }
    }

}

let authorizationInterceptor: AuthorizationMiddleware;
export default ((routers: express.IRouter<any>[]) => authorizationInterceptor = new AuthorizationMiddleware(routers))