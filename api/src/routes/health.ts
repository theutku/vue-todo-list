import * as express from 'express';
import IRouterBase from '../lib/interfaces/routerBase';

class HealthRouter implements IRouterBase {
    router: express.Router;

    constructor() {
        this.router = express.Router();
        this.initRoutes();
    }

    healthCheckRoute(req: express.Request, res: express.Response, next: express.NextFunction) {
        return res.send('API Status OK.');
    }

    initRoutes() {
        this.router.get('/status', this.healthCheckRoute.bind(this));
    }
}

const healthRouter = new HealthRouter();

export default healthRouter.router;