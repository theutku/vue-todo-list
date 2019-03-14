import * as express from 'express';

export default interface IRouterBase {
    router: express.Router;
    initRoutes();
}

export interface IRouterExport {
    router: express.Router;
    controller: any;
}