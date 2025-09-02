import { ProcessTransactionUseCase } from "../../../src/modules/transaction/application/process-transaction-use-case/process-transaction.use-case";
import { TransactionService } from "../../../src/modules/transaction/domain/services/transaction.service";
import { WebhookService } from "../../../src/modules/transaction/domain/services/webhook.service";
import { Logger } from "../../../src/shared/utils/logger";

describe("ProcessTransactionUseCase", () => {
  let useCase: ProcessTransactionUseCase;
  let mockLogger: Logger;
  let mockWebhookService: WebhookService;
  let mockTransactionService: TransactionService;

  beforeEach(() => {
    mockLogger = { info: jest.fn() } as any;
    mockWebhookService = {
      sendTransactionWebhook: jest
        .fn()
        .mockResolvedValue({ status: 200, statusText: "OK" }),
    } as any;
    mockTransactionService = {
      processTransaction: jest.fn().mockReturnValue({ id: 1 }),
    } as any;
    useCase = new ProcessTransactionUseCase(
      mockLogger,
      mockWebhookService,
      mockTransactionService
    );
  });

  it("should process transaction and send webhook", async () => {
    const input = {
      id: 1,
      amount: 100,
      currency: "USD",
      status: "PENDING",
      originCreatedAt: new Date(),
    };
    const resp = await useCase.run(input, "http://localhost/webhook");
    expect(mockTransactionService.processTransaction).toHaveBeenCalledWith(
      input
    );
    expect(mockWebhookService.sendTransactionWebhook).toHaveBeenCalled();
    expect(resp.status).toBe(200);
  });
});
