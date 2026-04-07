import { Account, AccountHistoryRow, AccountRow } from "@/types.js";
import { getLatestRowFromCSV, readCSV, writeCSV } from "@/utils/csv.js";
import { styleText } from "node:util";

export function calculatePortfolioTotal(accounts: Account[]): number {
  let total = 0;

  accounts.forEach((account) => {
    const row = getLatestRowFromCSV<AccountRow>(`accounts/${account.id}.csv`);
    if (row) {
      total += Number(row.amount);
    }
  });

  return Math.round(total * 100) / 100;
}

export function updateHistory(today: string) {
  try {
    const historyFileName = "history.csv";
    const accounts = readCSV<Account[]>("accounts.csv");
    const total = calculatePortfolioTotal(accounts);

    let validHistory: AccountHistoryRow[] = [];

    try {
      const allHistory = readCSV<AccountHistoryRow[]>(historyFileName);
      validHistory = allHistory.filter((row) => row && row.date);
    } catch {
      // File doesn't exist yet, start with empty array
      validHistory = [];
    }

    const existingIndex = validHistory.findIndex((row) => row.date === today);

    if (existingIndex !== -1) {
      // Update existing record
      validHistory[existingIndex] = {
        date: today,
        amount: total,
      };
    } else {
      // Add new record
      validHistory.push({
        date: today,
        amount: total,
      });
    }

    console.log(
      `Total in accounts: ${styleText(["green", "bold"], String(total))}`,
    );

    writeCSV<AccountHistoryRow>(historyFileName, validHistory, {
      columns: ["date", "amount", "notes"],
    });
  } catch (error) {
    throw error;
  }
}
