import { Request, Response, Router } from "express";
import { inject, injectable } from "tsyringe";
import { RegisteredServicesEnum } from "../DIcontainer/registeredServicesEnum";
import { Route } from "../server/route";
import { HttpMethodEnum } from "../types/http-methods";
import { Logger } from "../utils/logger";
import { BaseRouter } from "./baseRouter";
import { RoutesEnum } from "./routes";

@injectable()
export class HealthRouter extends BaseRouter {
  constructor(@inject(RegisteredServicesEnum.APP_LOGGER) logger: Logger) {
    super(logger);
    this.logger.info(
      `${this.logPrefix} ${RegisteredServicesEnum.HEALTH_ROUTER} initialized`
    );
  }

  public createRouter(): Router {
    const router = Router();
    return router;
  }

  public getRoutes(): Route[] {
    this.logger.info(`${this.logPrefix} Health check route registered`);
    const routes: Route[] = [
      {
        method: HttpMethodEnum.GET,
        path: RoutesEnum.HEALTH_CHECK,
        handler: this.healthCheckHandler.bind(this),
      },
    ];
    this.logger.info(
      `${this.logPrefix} Total health routes registered for ${RegisteredServicesEnum.HEALTH_ROUTER}: ${routes.length}`
    );
    return routes;
  }

  private healthCheckHandler(req: Request, res: Response): void {
    this.logger.info(
      `${this.logPrefix} Processing health check request: ${req.url}`
    );
    res.status(200).send({ status: "OK" });
  }
}
