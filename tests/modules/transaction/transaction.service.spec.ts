import { TransactionService } from "../../../src/modules/transaction/domain/services/transaction.service";
import { Logger } from "../../../src/shared/utils/logger";

describe("TransactionService", () => {
  let service: TransactionService;
  let mockLogger: Logger;

  beforeEach(() => {
    mockLogger = { info: jest.fn() } as any;
    service = new TransactionService(mockLogger);
  });

  it("should process transaction and return Transaction", () => {
    const input = {
      id: 1,
      amount: 100,
      currency: "USD",
      status: "PENDING",
      originCreatedAt: new Date(),
    };
    const tx = service.processTransaction(input);
    expect(tx).toBeDefined();
    expect(tx.id).toBe(1);
    expect(["COMPLETED", "FAILED"]).toContain(tx.status);
  });

  it("should validate status and return COMPLETED or FAILED", () => {
    const status = service["validate"]("PENDING");
    expect(["COMPLETED", "FAILED"]).toContain(status);
  });
});
