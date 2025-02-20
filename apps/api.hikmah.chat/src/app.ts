import cors from 'cors';
import type { Express } from 'express';
import express, { json } from 'express';
import helmet from 'helmet';

import { RouteRegistrar } from './api/route-registrar';
import { MiddlewareRegistrar } from './middlewares/middleware-registrar';

const app: Express = express();

app.use(cors());
app.use(helmet());
app.use(json());

RouteRegistrar.register(app);
MiddlewareRegistrar.register(app);

export { app };
