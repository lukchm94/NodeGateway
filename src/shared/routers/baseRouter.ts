import { Router } from "express";
import { Logger } from "../utils/logger";
import { Route } from "./route.interface";

/**
 * An abstract base class for all routers in the application.
 * This class provides common functionality, such as a logger,
 * and enforces that all concrete routers implement the getRoutes method.
 */
export abstract class BaseRouter {
  /**
   * Private getter for a standardized log prefix.
   * This helps in identifying logs from this specific class.
   */
  protected get logPrefix(): string {
    return `[${this.constructor.name}]`;
  }

  /**
   * The constructor initializes a Router with a Logger and logs a message indicating that the Router
   * has been initialized.
   * @param {Logger} logger - The `logger` parameter is an instance of the `Logger` class that is being
   * injected into the constructor of the class. It is marked as `private` and `readonly`, which means
   * that it can only be accessed within the class and cannot be reassigned to a different value once
   * it is initialized
   */
  constructor(protected readonly logger: Logger) {}

  /**
   * Abstract method to be implemented by all concrete router classes.
   * This method must return an array of routes.
   * @returns {Route[]} An array of Route objects.
   */
  public abstract getRoutes(): Route[];

  public abstract createRouter(): Router;
}
