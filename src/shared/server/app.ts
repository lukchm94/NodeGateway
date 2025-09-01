import bodyParser from "body-parser";
import express, { type Express } from "express";
import { Logger } from "../utils/logger";
import type { Route } from "./route";

export class App {
  private get logPrefix(): string {
    return `[${this.constructor.name}]`;
  }
  private app: Express;

  constructor(
    private port: number,
    private routes: any[],
    private readonly logger: Logger
  ) {
    this.port = port ? port : 4000;
    this.app = express();
    this.app.use(bodyParser.json());
    this.registerRoutes();
    this.logger = logger;
  }

  private registerRoutes(): void {
    this.routes.forEach((route: Route) => {
      this.app[route.method](route.path, route.handler);
    });
  }

  public start(): void {
    this.app.listen(this.port, () => {
      this.logger.info(
        `${this.logPrefix} Server is running on port ${this.port}`
      );
    });
  }
}
