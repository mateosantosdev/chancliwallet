import { describe, expect, it } from "vitest";
import {
	calculatePercentage,
	getTodayDate,
	isNum,
	slugify,
	toCurrency,
} from "./utils.js";

describe("slugify", () => {
	it("lowercases and trims", () => {
		expect(slugify("  Hello World  ")).toBe("hello-world");
	});

	it("replaces spaces and underscores with hyphens", () => {
		expect(slugify("foo bar_baz")).toBe("foo-bar-baz");
	});

	it("collapses multiple separators", () => {
		expect(slugify("foo  --  bar")).toBe("foo-bar");
	});

	it("strips leading and trailing hyphens", () => {
		expect(slugify("-hello-")).toBe("hello");
	});

	it("removes special characters", () => {
		expect(slugify("café & résumé!")).toBe("caf-rsum");
	});

	it("handles already-slug strings", () => {
		expect(slugify("my-account")).toBe("my-account");
	});
});

describe("isNum", () => {
	it("returns true for integer strings", () => {
		expect(isNum("42")).toBe(true);
	});

	it("returns true for decimal strings", () => {
		expect(isNum("3.14")).toBe(true);
	});

	it("returns true for zero", () => {
		expect(isNum("0")).toBe(true);
	});

	it("returns true for negative numbers", () => {
		expect(isNum("-5")).toBe(true);
	});

	it("returns false for non-numeric strings", () => {
		expect(isNum("abc")).toBe(false);
	});

	it("returns true for empty string (coerces to 0)", () => {
		// Number("") === 0, which is not NaN
		expect(isNum("")).toBe(true);
	});

	it("returns true for undefined (coerces to NaN check via Number)", () => {
		// Number(undefined) === NaN, isNaN(NaN) === true, so !true === false
		expect(isNum(undefined)).toBe(false);
	});
});

describe("toCurrency", () => {
	it("formats a number as EUR", () => {
		const result = toCurrency(1000);
		expect(result).toContain("1");
		expect(result).toContain("000");
		expect(result).toContain("€");
	});

	it("accepts a string input", () => {
		const result = toCurrency("2500.5");
		expect(result).toContain("€");
		expect(result).toContain("2");
	});

	it("formats zero", () => {
		const result = toCurrency(0);
		expect(result).toContain("0");
		expect(result).toContain("€");
	});
});

describe("calculatePercentage", () => {
	it("returns 100% when amount equals total", () => {
		const result = calculatePercentage(100, 100);
		expect(result).toContain("100");
		expect(result).toContain("%");
	});

	it("returns 50% for half", () => {
		const result = calculatePercentage(50, 100);
		expect(result).toContain("50");
		expect(result).toContain("%");
	});

	it("handles fractional percentages", () => {
		const result = calculatePercentage(1, 3);
		expect(result).toContain("%");
	});
});

describe("getTodayDate", () => {
	it("returns a string in YYYY-MM-DD format", () => {
		const result = getTodayDate();
		expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
	});

	it("returns the current year", () => {
		const result = getTodayDate();
		const year = result.split("-")[0];
		expect(year).toBe(String(new Date().getFullYear()));
	});
});
