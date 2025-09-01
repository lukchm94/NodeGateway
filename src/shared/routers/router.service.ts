import { inject, injectable } from "tsyringe";
import { RegisteredServicesEnum } from "../DIcontainer/registeredServicesEnum";
import { Route } from "../server/route";
import { Logger } from "../utils/logger";
import { HealthRouter } from "./health";

@injectable()
export class RouterService {
  private get logPrefix(): string {
    return `[${this.constructor.name}]`;
  }
  constructor(
    @inject(RegisteredServicesEnum.APP_LOGGER)
    private readonly appLogger: Logger,
    @inject(RegisteredServicesEnum.HEALTH_ROUTER)
    private readonly healthRouter: HealthRouter
  ) {
    this.appLogger = appLogger;
    this.healthRouter = healthRouter;
    this.appLogger.info(
      `${this.logPrefix} ${RegisteredServicesEnum.ROUTER_SERVICE} initialized`
    );
  }

  public setupRouters(): Route[] {
    this.appLogger.info(`${this.logPrefix} Setting up routers`);
    const routes: Route[] = [
      ...this.healthRouter.getRoutes(),
      // Add other routers here as needed
    ];
    this.appLogger.info(
      `${this.logPrefix} Total routes registered: ${routes.length}`
    );
    return routes;
  }
}
