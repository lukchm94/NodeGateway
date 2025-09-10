import { WebhookService } from "../../../src/modules/transaction/domain/services/webhook.service";
import { Transaction } from "../../../src/modules/transaction/domain/transaction.entity";
import { WebhookClient } from "../../../src/shared/clients/webhook/webhook.client";
import { Logger } from "../../../src/shared/utils/logger";

describe("WebhookService", () => {
  let service: WebhookService;
  let mockLogger: Logger;
  let mockClient: WebhookClient;

  beforeEach(() => {
    mockLogger = { info: jest.fn(), error: jest.fn() } as any;
    mockClient = {
      sendRequest: jest
        .fn()
        .mockResolvedValue({ status: 200, statusText: "OK" }),
    } as any;
    service = new WebhookService(mockLogger, mockClient);
  });

  it("should send transaction webhook and return response", async () => {
    const tx = new Transaction(
      1,
      100,
      "USD" as any,
      "COMPLETED" as any,
      new Date()
    );
    const resp = await service.sendTransactionWebhook(
      tx,
      "http://localhost/webhook"
    );
    expect(resp.status).toBe(200);
    expect(mockClient.sendRequest).toHaveBeenCalled();
  });

  it("should throw error if webhook client fails", async () => {
    mockClient.sendRequest = jest.fn().mockRejectedValue(new Error("fail"));
    const tx = new Transaction(
      1,
      100,
      "USD" as any,
      "COMPLETED" as any,
      new Date()
    );
    await expect(
      service.sendTransactionWebhook(tx, "http://localhost/webhook")
    ).rejects.toThrow("fail");
    expect(mockLogger.error).toHaveBeenCalled();
  });

  it("should build correct payload", () => {
    const tx = new Transaction(
      1,
      100,
      "USD" as any,
      "COMPLETED" as any,
      new Date()
    );
    const payload = (service as any).buildPayload(tx);
    expect(payload.id).toBe(1);
    expect(payload.amount).toBe(100);
  });
});
