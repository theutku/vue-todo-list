import * as express from 'express';
import * as http from 'http';
import * as bp from 'body-parser';
import * as morgan from 'morgan';
import * as cors from 'cors';
import * as path from 'path';
import config from './config';

import DbManager from './db';
import errorHandler from './middleware/error';
import authInterceptor from './middleware/auth';

import protectedRouters from './routes';
import accountRouter from './routes/account';
import healthRouter from './routes/health';
import tokenRouter from './routes/token';


class ApiApp {
	app: express.Application;
	appRouter: express.Router;

	constructor() {
		this.app = express();
		this.appRouter = express.Router();
	}

	init() {
		return DbManager.connect()
			.then(() => {
				this.setupBasicElements();
				this.setupRoutes();

				authInterceptor(protectedRouters.getRouters());

				const server = http.createServer(this.app);
				server.listen(config.port, err => {
					if (err) {
						process.exit(2);
					} else {
						console.log('Started listening at port: ' + config.port);
						return Promise.resolve();
					}
				});

				errorHandler(this.app);
			})
			.catch(err => {
				console.log(`Unable to launch application: ${err}`);
				process.exit(1);
			});
	}

	private setupBasicElements() {
		this.app.use(cors());
		this.app.use(morgan('dev'));

		this.app.use(bp.json());
		this.app.use(bp.urlencoded({ extended: false }));

		var staticPublicPath = path.join(__dirname, '../public');
		this.app.use('/', express.static(staticPublicPath));

		this.app.set('view engine', 'ejs');
		this.app.set('views', path.join(__dirname, '../content/views'));
	}

	private setupRoutes() {
		this.app.use('/api/v1', this.appRouter);
		this.appRouter.use('/account', accountRouter);
		this.appRouter.use('/health', healthRouter);
		this.appRouter.use('/token', tokenRouter.router);
	}
}

export var App: ApiApp;

export default () => (App = new ApiApp());
