import { ProcessTransactionUseCase } from "../../../src/modules/transaction/application/process-transaction-use-case/process-transaction.use-case";
import { TransactionController } from "../../../src/modules/transaction/interfaces/transaction.controller";
import { Logger } from "../../../src/shared/utils/logger";

describe("TransactionController", () => {
  let controller: TransactionController;
  let mockLogger: Logger;
  let mockProcessTransactionUseCase: ProcessTransactionUseCase;
  let mockReq: any;
  let mockResp: any;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockLogger = { info: jest.fn(), error: jest.fn() } as any;
    mockProcessTransactionUseCase = { run: jest.fn() } as any;
    controller = new TransactionController(
      mockLogger,
      mockProcessTransactionUseCase
    );
    mockReq = {};
    mockResp = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    mockNext = jest.fn();
  });

  describe("processTransaction", () => {
    it("should process transaction and send result", async () => {
      mockReq.safeFields = {
        id: 1,
        amount: 100,
        currency: "USD",
        status: "PENDING",
        originCreatedAt: new Date(),
      };
      mockReq.webhookUrl = "http://localhost/webhook";
      (mockProcessTransactionUseCase.run as jest.Mock).mockResolvedValue(
        "success"
      );

      await controller.processTransaction(mockReq, mockResp, mockNext);

      expect(mockLogger.info).toHaveBeenCalled();
      expect(mockProcessTransactionUseCase.run).toHaveBeenCalledWith(
        mockReq.safeFields,
        mockReq.webhookUrl
      );
      expect(mockResp.status).toHaveBeenCalledWith(200);
      expect(mockResp.send).toHaveBeenCalledWith({ result: "success" });
    });

    it("should handle errors and call next", async () => {
      (mockProcessTransactionUseCase.run as jest.Mock).mockRejectedValue(
        new Error("fail")
      );
      mockReq.safeFields = {};
      mockReq.webhookUrl = "url";

      await controller.processTransaction(mockReq, mockResp, mockNext);

      expect(mockLogger.error).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("validateTransaction", () => {
    it("should validate body and header and call next", async () => {
      mockReq.body = {
        id: 1,
        amount: 100,
        currency: "USD",
        status: "PENDING",
        originCreatedAt: new Date().toISOString(),
      };
      mockReq.headers = {
        webhook: "http://localhost/webhook",
      };
      mockReq.safeFields = {};

      await controller.validateTransaction(mockReq, mockResp, mockNext);

      expect(mockReq.safeFields.id).toBe(1);
      expect(mockReq.webhookUrl).toBe("http://localhost/webhook");
      expect(mockNext).toHaveBeenCalledWith();
    });

    it("should call next with ValidationError on invalid body", async () => {
      mockReq.body = {};
      mockReq.headers = { "webhook-url": "http://localhost/webhook" };

      await controller.validateTransaction(mockReq, mockResp, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should call next with ValidationError on invalid header", async () => {
      mockReq.body = {
        id: 1,
        amount: 100,
        currency: "USD",
        status: "PENDING",
        originCreatedAt: new Date().toISOString(),
      };
      mockReq.headers = {};

      await controller.validateTransaction(mockReq, mockResp, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("get", () => {
    it("should send status message", async () => {
      mockReq.baseUrl = "/api/transaction";

      await controller.get(mockReq, mockResp, mockNext);

      expect(mockLogger.info).toHaveBeenCalled();
      expect(mockResp.status).toHaveBeenCalledWith(200);
      expect(mockResp.send).toHaveBeenCalled();
    });

    it("should handle errors and call next", async () => {
      mockLogger.info = jest.fn(() => {
        throw new Error("fail");
      });

      await controller.get(mockReq, mockResp, mockNext);

      expect(mockLogger.error).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });
  });
});
