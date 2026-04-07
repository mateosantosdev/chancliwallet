import { styleText } from "node:util";
import { Command } from "commander";
const program = new Command();
import addAccount from "@/commands/add-account.js";
import listAccounts from "@/commands/list-accounts.js";
import removeAccount from "@/commands/remove-account.js";
import addAccountRow from "@/commands/add-account-row.js";
import report from "@/commands/report.js";
import updateHistory from "@/commands/update-history.js";
import { select } from "@clack/prompts";

program
  .name("investments")
  .description("Personal investment portfolio tracker")
  .version("0.1.0");

program.action(async () => {
  console.log("=================");
  console.log("= " + styleText(["blue", "bold"], "ChancliWallet") + " =");
  console.log("=================");
  let shouldContinue = true;
  while (shouldContinue) {
    try {
      const value = await select({
        message: "Pick an option",
        options: [
          { value: "new", label: "Add balance" },
          {
            value: "separator_accounts",
            label: styleText(["cyan", "bold"], "── Accounts ──────"),
          },
          { value: "add", label: "  Create" },
          { value: "list", label: "  List" },
          { value: "remove", label: "  Remove" },
          {
            value: "separator_history",
            label: styleText(["cyan", "bold"], "── History ──────"),
          },

          { value: "report", label: "  Show report" },
          { value: "update_history", label: "  Update data" },
        ],
      });

      console.clear();
      switch (value) {
        case "add":
          await addAccount();
          break;
        case "list":
          await listAccounts();
          break;
        case "new":
          await addAccountRow();
          break;
        case "remove":
          await removeAccount();
          break;
        case "report":
          await report();
          break;
        case "update_history":
          await updateHistory();
          break;
        default:
          shouldContinue = false;
      }
    } catch (error) {
      console.error("An error occurred:", error);
      process.exit(1);
    }
  }
});

await program.parseAsync();
