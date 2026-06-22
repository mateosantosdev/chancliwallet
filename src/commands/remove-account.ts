import { styleText } from "node:util";
import { confirm, isCancel, select } from "@clack/prompts";
import * as portfolio from "@/services/portfolio.js";
import type { Account } from "@/types.js";
import { readCSV, removeCSV, writeCSV } from "@/utils/csv.js";
import { getTodayDate } from "@/utils/utils.js";

const FILENAME = "accounts.csv";
async function run() {
	const accounts = readCSV<Account[]>(FILENAME);
	const selected = await select({
		message: "Select an account to remove",
		options: accounts.map((account) => ({
			value: account.id,
			label: `${account.id} - ${account.name}`,
		})),
	});

	if (isCancel(selected)) {
		return;
	}

	const shouldProceed = await confirm({
		message: "Do you want to continue?",
		vertical: true,
	});
	if (!shouldProceed) {
		return;
	}

	const filteredAccounts = accounts.filter(
		(account) => account.id !== selected,
	);
	writeCSV(FILENAME, filteredAccounts);

	// Remove specific file
	removeCSV(`accounts/${selected}.csv`);

	// Update history with today's total
	const today = getTodayDate();
	portfolio.updateHistory(today);

	console.log(`Removed account: ${styleText(["green", "bold"], selected)}`);
}

export default run;
