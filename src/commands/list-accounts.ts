import { table } from "table";
import type { Account } from "@/types.js";
import { readCSV } from "@/utils/csv.js";

async function run() {
	const accounts = readCSV<Account[]>("accounts.csv");

	const tableData = [
		["id", "name"],
		...accounts.map((account) => [account.id, account.name]),
	];

	console.log(table(tableData));
}

export default run;
