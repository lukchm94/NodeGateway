import { inject } from "tsyringe";
import { RegisteredServicesEnum } from "../DIcontainer/registeredServicesEnum";
import { Logger } from "./logger";

export abstract class BaseClass {
  protected get logPrefix(): string {
    return `[${this.constructor.name}]`;
  }
  constructor(
    @inject(RegisteredServicesEnum.APP_LOGGER)
    protected readonly appLogger: Logger
  ) {}
}
