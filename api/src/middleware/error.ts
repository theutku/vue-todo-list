import * as express from "express";
import Middleware from "./base";
import config from "../config";

export var Error: ErrorMiddleware;

class ErrorMiddleware extends Middleware {

    handleError(err: any, req: express.Request, res: express.Response, next: Function) {
        if (config.nodeenv == 'production') {
            console.log(err);
            err.stack = '';
        } else {
            console.error(err.stack);
        }
        return res.status(err.statusCode).send(err);
    }

    constructor(app: express.Application) {
        super(app);
        app.use(this.handleError.bind(this));
    }
}


export default (app: express.Application) => Error = new ErrorMiddleware(app);
