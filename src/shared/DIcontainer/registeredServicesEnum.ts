export enum RegisteredServicesEnum {
  // Utilities
  APP_LOGGER = "Logger",

  // Health module
  HEALTH_ROUTER = "HealthRouter",
  HEALTH_CONTROLLER = "HealthController",

  // Core services
  ROUTER_SERVICE = "RouterService",

  // Webhook client and service
  WEBHOOK_CLIENT = "WebhookClient",
  WEBHOOK_SERVICE = "WebhookService",

  // Transaction module
  TRANSACTION_ROUTER = "TransactionRouter",
  TRANSACTION_CONTROLLER = "TransactionController",
  TRANSACTION_SERVICE = "TransactionService",
  PROCESS_TRANSACTION_USE_CASE = "ProcessTransactionUseCase",
}
