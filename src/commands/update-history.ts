import * as portfolio from "@/services/portfolio.js";
import { getTodayDate } from "@/utils/utils.js";

async function run() {
	console.clear();
	// Update history with today's total
	const today = getTodayDate();
	portfolio.updateHistory(today);
}

export default run;
