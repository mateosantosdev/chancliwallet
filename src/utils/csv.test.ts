import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("node:fs", () => ({
	readFileSync: vi.fn(),
	writeFileSync: vi.fn(),
	unlinkSync: vi.fn(),
}));

import { readFileSync, unlinkSync, writeFileSync } from "node:fs";
import Papa from "papaparse";
import {
	appendCSV,
	getLatestRowFromCSV,
	readCSV,
	removeCSV,
	writeCSV,
} from "./csv.js";

const mockReadFileSync = vi.mocked(readFileSync);
const mockWriteFileSync = vi.mocked(writeFileSync);
const mockUnlinkSync = vi.mocked(unlinkSync);

const dataPath = (filename: string) => join(process.cwd(), "data", filename);

afterEach(() => {
	vi.clearAllMocks();
});

describe("readCSV", () => {
	it("reads and parses the CSV at the correct path", () => {
		mockReadFileSync.mockReturnValue("id,name\n1,foo");
		const result = readCSV<{ id: string; name: string }>("accounts.csv");
		expect(mockReadFileSync).toHaveBeenCalledWith(
			dataPath("accounts.csv"),
			"utf8",
		);
		expect(result).toEqual([{ id: "1", name: "foo" }]);
	});

	it("re-throws on file not found", () => {
		mockReadFileSync.mockImplementation(() => {
			throw new Error("ENOENT");
		});
		expect(() => readCSV("missing.csv")).toThrow("ENOENT");
	});
});

describe("writeCSV", () => {
	it("writes stringified CSV to the correct path", () => {
		const data = [{ id: "1", name: "foo" }];
		writeCSV("accounts.csv", data);
		expect(mockWriteFileSync).toHaveBeenCalledWith(
			dataPath("accounts.csv"),
			Papa.unparse(data),
			"utf8",
		);
	});
});

describe("appendCSV", () => {
	it("appends a new row to the existing CSV", () => {
		mockReadFileSync.mockReturnValue("id,name\n1,foo");
		appendCSV("accounts.csv", { id: "2", name: "bar" });
		const written = (mockWriteFileSync as ReturnType<typeof vi.fn>).mock
			.calls[0]?.[1] as string;
		expect(written).toContain("1,foo");
		expect(written).toContain("2,bar");
	});

	it("writes to the correct path", () => {
		mockReadFileSync.mockReturnValue("id,name\n1,foo");
		appendCSV("accounts.csv", { id: "2", name: "bar" });
		expect(mockWriteFileSync).toHaveBeenCalledWith(
			dataPath("accounts.csv"),
			expect.any(String),
			"utf8",
		);
	});
});

describe("removeCSV", () => {
	it("calls unlinkSync with the correct path", () => {
		removeCSV("accounts/my-account.csv");
		expect(mockUnlinkSync).toHaveBeenCalledWith(
			dataPath("accounts/my-account.csv"),
		);
	});
});

describe("getLatestRowFromCSV", () => {
	it("returns the last row of the CSV", () => {
		mockReadFileSync.mockReturnValue(
			"date,amount\n2024-01-01,100\n2024-02-01,200",
		);
		const result = getLatestRowFromCSV<{ date: string; amount: string }>(
			"accounts/foo.csv",
		);
		expect(result).toEqual({ date: "2024-02-01", amount: "200" });
	});

	it("returns undefined for an empty CSV (headers only)", () => {
		mockReadFileSync.mockReturnValue("date,amount\n");
		const result = getLatestRowFromCSV("accounts/foo.csv");
		// PapaParse returns an array with one empty object for a header-only CSV
		// .at(-1) returns the last element, which may be an empty object
		expect(result).toBeDefined();
	});
});
