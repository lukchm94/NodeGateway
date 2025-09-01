import { container } from "tsyringe";
import { HealthRouter } from "../routers/health";
import { RouterService } from "../routers/router.service";
import { Logger } from "../utils/logger";
import { RegisteredServicesEnum } from "./registeredServicesEnum";

container.register<Logger>(RegisteredServicesEnum.APP_LOGGER, {
  useClass: Logger,
});
container.register<HealthRouter>(RegisteredServicesEnum.HEALTH_ROUTER, {
  useClass: HealthRouter,
});
container.register<RouterService>(RegisteredServicesEnum.ROUTER_SERVICE, {
  useClass: RouterService,
});

export const DIContainer = container;
