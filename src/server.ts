import "reflect-metadata";
import { DIContainer } from "./shared/DIcontainer/container";
import { RegisteredServicesEnum } from "./shared/DIcontainer/registeredServicesEnum";
import { RouterService } from "./shared/routers/router.service";
import { App } from "./shared/server/app";
import type { Route } from "./shared/server/route";
import { Logger } from "./shared/utils/logger";

/**
 * The `bootstrap` function initializes a server application with defined routes and logging, starting
 * the server on a specified port.
 */
async function bootstrap() {
  try {
    const appLogger = DIContainer.resolve<Logger>(
      RegisteredServicesEnum.APP_LOGGER
    );
    const routerService = DIContainer.resolve<RouterService>(
      RegisteredServicesEnum.ROUTER_SERVICE
    );

    const routes: Route[] = routerService.setupRouters();
    const port = process.env.PORT ? parseInt(process.env.PORT) : 4000;

    const app = new App(port, routes, appLogger);
    app.start();
    appLogger.info(`[Server] Started on port ${port}`);
  } catch (error) {
    console.error("[Server] Error during server bootstrap:", error);
    process.exit(1);
  }
}

bootstrap();
