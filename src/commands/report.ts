import { Alignment, table } from "table";
import { getLatestRowFromCSV, readCSV } from "@/utils/csv.js";
import { calculatePortfolioTotal } from "@/services/portfolio.js";
import { Account, AccountReport, AccountRow, HistoryRow } from "@/types.js";
import { calculatePercentage, toCurrency } from "@/utils/utils.js";
import { styleText } from "node:util";

function printHistoryReport() {
  const rows = readCSV<HistoryRow[]>("history.csv");

  const sorted = [...rows].sort((a, b) => b.date.localeCompare(a.date));

  const tableData = [
    ["date", "amount", "diff", "notes"],
    ...sorted.map((row, i) => {
      const amount = Number(row.amount);
      const prev = sorted[i + 1];
      const notes = row.notes;

      let diffCell: string;
      if (!prev) {
        diffCell = "-";
      } else {
        const prevAmount = Number(prev.amount);
        const diff = calculatePercentage(amount - prevAmount, prevAmount);
        diffCell = styleText(amount >= prevAmount ? "green" : "red", diff);
      }

      return [row.date, toCurrency(amount), diffCell, notes];
    }),
  ];

  const tableConfig = {
    columns: [
      { alignment: "left" as Alignment },
      { alignment: "right" as Alignment },
      { alignment: "right" as Alignment },
      { alignment: "left" as Alignment },
    ],
  };

  // History header
  console.log(styleText(["green", "bold"], `History`));
  console.log(table(tableData, tableConfig));
}

async function run() {
  console.clear();

  const accounts = readCSV<Account[]>("accounts.csv");
  const total = calculatePortfolioTotal(accounts);

  const formatted: AccountReport[] = [];

  accounts.forEach((account) => {
    const row = getLatestRowFromCSV<AccountRow>(`accounts/${account.id}.csv`);
    if (row) {
      formatted.push({
        id: account.id,
        name: account.name,
        amount: Number(row.amount),
        percentage: "0%",
      });
    }
  });

  const tableData = [
    ["name", "amount", "%"],
    ...formatted
      .sort((a, b) => b.amount - a.amount)
      .map((account) => [
        account.name,
        toCurrency(account.amount),
        calculatePercentage(Number(account.amount), total),
      ]),
  ];

  // Total header
  console.log(
    styleText(
      ["green", "bold"],
      `Total: ${new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "EUR",
      }).format(total)}`,
    ),
  );

  // Output the table
  const tableConfig = {
    columnDefault: {},
    columns: [
      { alignment: "left" as Alignment },
      { alignment: "right" as Alignment },
      { alignment: "right" as Alignment },
    ],
  };
  console.log(table(tableData, tableConfig));

  printHistoryReport();
}

export default run;
