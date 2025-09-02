import { container } from "tsyringe";
import { HealthController } from "../../modules/health/interfaces/health.controller";
import { HealthRouter } from "../../modules/health/interfaces/health.router";
import { RouterService } from "../routers/router.service";
import { Logger } from "../utils/logger";
import { RegisteredServicesEnum } from "./registeredServicesEnum";

// Utilities
container.register<Logger>(RegisteredServicesEnum.APP_LOGGER, {
  useClass: Logger,
});

container.register<RouterService>(RegisteredServicesEnum.ROUTER_SERVICE, {
  useClass: RouterService,
});

// Health module
container.register<HealthRouter>(RegisteredServicesEnum.HEALTH_ROUTER, {
  useClass: HealthRouter,
});
container.register<HealthController>(RegisteredServicesEnum.HEALTH_CONTROLLER, {
  useClass: HealthController,
});

export const DIContainer = container;
