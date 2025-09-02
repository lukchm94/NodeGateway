import { Transaction } from "../../../src/modules/transaction/domain/transaction.entity";

describe("Transaction Entity", () => {
  it("should create a valid transaction", () => {
    const tx = Transaction.create({
      id: 1,
      amount: 100,
      currency: "USD",
      status: "PENDING",
      originCreatedAt: new Date(),
    });
    expect(tx).toBeInstanceOf(Transaction);
    expect(tx.id).toBe(1);
    expect(tx.currency).toBe("USD");
  });

  it("should throw error for invalid status", () => {
    expect(() =>
      Transaction.create({
        id: 1,
        amount: 100,
        currency: "USD",
        status: "INVALID",
        originCreatedAt: new Date(),
      })
    ).toThrow(/Invalid transaction status/);
  });

  it("should throw error for invalid currency", () => {
    expect(() =>
      Transaction.create({
        id: 1,
        amount: 100,
        currency: "XXX",
        status: "PENDING",
        originCreatedAt: new Date(),
      })
    ).toThrow(/Invalid currency type/);
  });
});
