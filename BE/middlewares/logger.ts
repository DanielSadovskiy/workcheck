import * as express from 'express';
const loggerMiddleware = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    console.log(`${request.method} ${request.path}`);
    next();
}

export default loggerMiddleware;

