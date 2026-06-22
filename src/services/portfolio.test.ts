import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Account, AccountHistoryRow, AccountRow } from "../types.js";

vi.mock("../utils/csv.js", () => ({
	getLatestRowFromCSV: vi.fn(),
	readCSV: vi.fn(),
	writeCSV: vi.fn(),
}));

import { getLatestRowFromCSV, readCSV, writeCSV } from "../utils/csv.js";
import { calculatePortfolioTotal, updateHistory } from "./portfolio.js";

const mockGetLatest = vi.mocked(getLatestRowFromCSV);
const mockReadCSV = vi.mocked(readCSV);
const mockWriteCSV = vi.mocked(writeCSV);

afterEach(() => {
	vi.clearAllMocks();
});

describe("calculatePortfolioTotal", () => {
	it("returns 0 for an empty accounts array", () => {
		expect(calculatePortfolioTotal([])).toBe(0);
	});

	it("returns the amount for a single account", () => {
		mockGetLatest.mockReturnValue({
			date: "2024-01-01",
			amount: 1500,
		} satisfies AccountRow);
		const accounts: Account[] = [{ id: "savings", name: "Savings" }];
		expect(calculatePortfolioTotal(accounts)).toBe(1500);
	});

	it("sums amounts from multiple accounts", () => {
		mockGetLatest
			.mockReturnValueOnce({
				date: "2024-01-01",
				amount: 1000,
			} satisfies AccountRow)
			.mockReturnValueOnce({
				date: "2024-01-01",
				amount: 2500,
			} satisfies AccountRow);
		const accounts: Account[] = [
			{ id: "savings", name: "Savings" },
			{ id: "stocks", name: "Stocks" },
		];
		expect(calculatePortfolioTotal(accounts)).toBe(3500);
	});

	it("skips accounts with no latest row", () => {
		mockGetLatest.mockReturnValueOnce(undefined).mockReturnValueOnce({
			date: "2024-01-01",
			amount: 800,
		} satisfies AccountRow);
		const accounts: Account[] = [
			{ id: "empty", name: "Empty" },
			{ id: "stocks", name: "Stocks" },
		];
		expect(calculatePortfolioTotal(accounts)).toBe(800);
	});

	it("rounds to 2 decimal places", () => {
		mockGetLatest
			.mockReturnValueOnce({
				date: "2024-01-01",
				amount: 100.005,
			} satisfies AccountRow)
			.mockReturnValueOnce({
				date: "2024-01-01",
				amount: 200.006,
			} satisfies AccountRow);
		const accounts: Account[] = [
			{ id: "a", name: "A" },
			{ id: "b", name: "B" },
		];
		// 100.005 + 200.006 = 300.011, rounded to 2dp = 300.01
		expect(calculatePortfolioTotal(accounts)).toBe(300.01);
	});
});

describe("updateHistory", () => {
	const today = "2024-06-01";

	beforeEach(() => {
		vi.spyOn(console, "log").mockImplementation(() => undefined);
		mockReadCSV.mockImplementation((filename: string) => {
			if (filename === "accounts.csv") {
				return [{ id: "savings", name: "Savings" }] as Account[];
			}
			return [] as AccountHistoryRow[];
		});
		mockGetLatest.mockReturnValue({
			date: "2024-01-01",
			amount: 5000,
		} satisfies AccountRow);
	});

	it("appends a new entry when today is not in history", () => {
		const existingHistory: AccountHistoryRow[] = [
			{ date: "2024-05-31", amount: 4800 },
		];
		mockReadCSV.mockImplementation((filename: string) => {
			if (filename === "accounts.csv")
				return [{ id: "savings", name: "Savings" }];
			return existingHistory;
		});

		updateHistory(today);

		const written = mockWriteCSV.mock.calls[0]?.[1] as AccountHistoryRow[];
		expect(written).toHaveLength(2);
		expect(written.at(-1)?.date).toBe(today);
		expect(written.at(-1)?.amount).toBe(5000);
	});

	it("updates an existing entry when today already exists in history", () => {
		const existingHistory: AccountHistoryRow[] = [
			{ date: today, amount: 4000 },
		];
		mockReadCSV.mockImplementation((filename: string) => {
			if (filename === "accounts.csv")
				return [{ id: "savings", name: "Savings" }];
			return existingHistory;
		});

		updateHistory(today);

		const written = mockWriteCSV.mock.calls[0]?.[1] as AccountHistoryRow[];
		expect(written).toHaveLength(1);
		expect(written[0]?.date).toBe(today);
		expect(written[0]?.amount).toBe(5000);
	});

	it("starts with empty history when history.csv does not exist", () => {
		mockReadCSV.mockImplementation((filename: string) => {
			if (filename === "accounts.csv")
				return [{ id: "savings", name: "Savings" }];
			throw new Error("ENOENT");
		});

		updateHistory(today);

		const written = mockWriteCSV.mock.calls[0]?.[1] as AccountHistoryRow[];
		expect(written).toHaveLength(1);
		expect(written[0]?.date).toBe(today);
	});

	it("writes to history.csv with the correct column config", () => {
		mockReadCSV.mockImplementation((filename: string) => {
			if (filename === "accounts.csv")
				return [{ id: "savings", name: "Savings" }];
			return [];
		});

		updateHistory(today);

		expect(mockWriteCSV).toHaveBeenCalledWith(
			"history.csv",
			expect.any(Array),
			{ columns: ["date", "amount", "notes"] },
		);
	});
});
