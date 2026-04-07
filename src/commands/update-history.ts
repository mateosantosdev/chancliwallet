import { getTodayDate } from "@/utils/utils.js";
import * as portfolio from "@/services/portfolio.js";

async function run() {
  console.clear();
  // Update history with today's total
  const today = getTodayDate();
  portfolio.updateHistory(today);
}

export default run;
