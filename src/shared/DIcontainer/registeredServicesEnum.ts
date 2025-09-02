export enum RegisteredServicesEnum {
  // Utilities
  APP_LOGGER = "Logger",

  // Health module
  HEALTH_ROUTER = "HealthRouter",
  HEALTH_CONTROLLER = "HealthController",

  // Core services
  ROUTER_SERVICE = "RouterService",
  TOKEN_WALLET_SERVICE_CLIENT = "TokenWalletServiceClient",

  // Transaction module
  TRANSACTION_ROUTER = "TransactionRouter",
  TRANSACTION_CONTROLLER = "TransactionController",
  TRANSACTION_SERVICE = "TransactionService",
  WEBHOOK_SERVICE = "WebhookService",
  PROCESS_TRANSACTION_USE_CASE = "ProcessTransactionUseCase",
}
