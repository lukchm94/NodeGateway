import { Router } from "express";
import { inject, injectable } from "tsyringe";
import { RegisteredServicesEnum } from "../../../shared/DIcontainer/registeredServicesEnum";
import { BaseRouter } from "../../../shared/routers/baseRouter";
import { RoutesEnum } from "../../../shared/routers/routes.enum";
import { Logger } from "../../../shared/utils/logger";
import { HealthController } from "./health.controller";

@injectable()
export class HealthRouter extends BaseRouter {
  constructor(
    @inject(RegisteredServicesEnum.APP_LOGGER) readonly logger: Logger,
    @inject(RegisteredServicesEnum.HEALTH_CONTROLLER)
    private readonly healthController: HealthController
  ) {
    super(logger);
    this.healthController = healthController;
    this.logger.info(
      `${this.logPrefix} ${RegisteredServicesEnum.HEALTH_ROUTER} initialized`
    );
  }

  public createRouter(): Router {
    const router = Router();
    this.logger.info(`${this.logPrefix} Router instance created`);

    router.route(RoutesEnum.HOME).get(this.healthController.healthCheck);
    return router;
  }
}
