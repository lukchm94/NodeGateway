import { HttpStatusCode } from "axios";
import bodyParser from "body-parser";
import express, {
  NextFunction,
  Request,
  Response,
  Router,
  type Express,
} from "express";
import { RoutesEnum } from "../routers/routes.enum";
import { Logger } from "../utils/logger";

export class App {
  private get logPrefix(): string {
    return `[${this.constructor.name}]`;
  }
  private app: Express;

  constructor(
    private port: number,
    private routers: Array<{ prefix: RoutesEnum; router: Router }>,
    private readonly logger: Logger
  ) {
    this.port = port ? port : 4000;
    this.app = express();
    this.app.use(bodyParser.json());
    this.registerRoutes();
    this.logger = logger;
  }

  private registerRoutes(): void {
    this.routers.forEach(({ prefix, router }) => {
      this.app.use(prefix, router);
    });

    this.app.use(
      (err: any, req: Request, res: Response, next: NextFunction) => {
        const errMsg = `${this.logPrefix} - ${req.url} Unhandled error: ${err}`;
        this.logger.error(errMsg);
        res.status(HttpStatusCode.InternalServerError).json({ error: errMsg });
      }
    );
  }

  public start(): void {
    this.app.listen(this.port, () => {
      this.logger.info(
        `${this.logPrefix} Server is running on port ${this.port}`
      );
    });
  }
}
