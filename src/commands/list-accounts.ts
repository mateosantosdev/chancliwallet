import { table } from "table";
import { readCSV } from "@/utils/csv.js";
import { Account } from "@/types.js";

async function run() {
  const accounts = readCSV<Account[]>("accounts.csv");

  const tableData = [
    ["id", "name"],
    ...accounts.map((account) => [account.id, account.name]),
  ];

  console.log(table(tableData));
}

export default run;
