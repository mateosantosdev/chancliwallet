import { date, isCancel, select, text } from "@clack/prompts";
import { updateHistory } from "@/services/portfolio.js";
import type { Account } from "@/types.js";
import { appendCSV, readCSV } from "@/utils/csv.js";
import { getTodayDate, isNum } from "@/utils/utils.js";

async function run() {
	const accounts = readCSV<Account[]>("accounts.csv");

	const accountId = await select({
		message: "Select account",
		options: accounts.map((account) => ({
			value: account.id,
			label: account.name,
		})),
	});
	if (isCancel(accountId)) return;

	const rowDate = await date({
		message: "Date:",
		format: "YMD",
		locale: "es-ES",
		defaultValue: new Date(),
	});
	if (isCancel(rowDate)) return;

	const amount = await text({
		message: "Amount:",
		validate(value) {
			if (!value) return `Value is required!`;
			if (!isNum(value)) return "Value is not a valid number";
			return undefined;
		},
	});
	if (isCancel(amount)) return;

	// Append row to account file
	appendCSV(`accounts/${accountId}.csv`, {
		date: rowDate.toISOString().split("T")[0] || "-",
		amount,
	});

	// Update history with today's total
	const today = getTodayDate();
	updateHistory(today);
}

export default run;
