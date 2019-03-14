import * as express from 'express';

let appRoutes = [
	'./token'
];

export default class ProtectedRouteLoader {
	static getRouters(): express.Router[] {
		let routings = [];
		appRoutes.forEach(file => {
			const routing: express.Router = require(file).default;
			routings.push(routing);
		});
		return routings;
	}
}
