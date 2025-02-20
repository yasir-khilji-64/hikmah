import { Router } from 'express';

import { IndexController } from './index.controller';
import { Database } from '../../utils';

class IndexRoute {
  private router: Router;
  private database: Database;
  private indexController: IndexController;

  constructor() {
    this.router = Router();
    this.database = Database.GetInstance();
    this.indexController = new IndexController(this.database);
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.indexController.index.bind(this.indexController));
    this.router.get(
      '/health-check',
      this.indexController.healthCheck.bind(this.indexController),
    );
  }

  public getRoutes(): Router {
    return this.router;
  }
}

export { IndexRoute };
