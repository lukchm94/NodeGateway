import { container } from "tsyringe";
import { HealthController } from "../../modules/health/interfaces/health.controller";
import { HealthRouter } from "../../modules/health/interfaces/health.router";
import { ProcessTransactionUseCase } from "../../modules/transaction/application/process-transaction-use-case/process-transaction.use-case";
import { TransactionService } from "../../modules/transaction/domain/services/transaction.service";
import { WebhookService } from "../../modules/transaction/domain/services/webhook.service";
import { TransactionController } from "../../modules/transaction/interfaces/transaction.controller";
import { TransactionRouter } from "../../modules/transaction/interfaces/transaction.router";
import { TokenWalletServiceClient } from "../clients/tokenWalletService/token-wallet-service.client";
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
container.register<TokenWalletServiceClient>(
  RegisteredServicesEnum.TOKEN_WALLET_SERVICE_CLIENT,
  {
    useClass: TokenWalletServiceClient,
  }
);

// Health module
container.register<HealthRouter>(RegisteredServicesEnum.HEALTH_ROUTER, {
  useClass: HealthRouter,
});
container.register<HealthController>(RegisteredServicesEnum.HEALTH_CONTROLLER, {
  useClass: HealthController,
});

// Transaction module
container.register<WebhookService>(RegisteredServicesEnum.WEBHOOK_SERVICE, {
  useClass: WebhookService,
});
container.register<TransactionService>(
  RegisteredServicesEnum.TRANSACTION_SERVICE,
  {
    useClass: TransactionService,
  }
);
container.register<ProcessTransactionUseCase>(
  RegisteredServicesEnum.PROCESS_TRANSACTION_USE_CASE,
  {
    useClass: ProcessTransactionUseCase,
  }
);
container.register<TransactionController>(
  RegisteredServicesEnum.TRANSACTION_CONTROLLER,
  { useClass: TransactionController }
);
container.register<TransactionRouter>(
  RegisteredServicesEnum.TRANSACTION_ROUTER,
  { useClass: TransactionRouter }
);
export const DIContainer = container;
