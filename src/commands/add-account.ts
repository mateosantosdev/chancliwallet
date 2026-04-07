import { text, isCancel } from "@clack/prompts";
import { slugify } from "@/utils/utils.js";
import { appendCSV, writeCSV } from "@/utils/csv.js";

async function run() {
  const name = await text({
    message: "Enter the account name",
  });

  if (isCancel(name)) {
    return;
  }

  const slug = slugify(name);
  appendCSV("accounts.csv", {
    id: slug,
    name,
  });

  // Create the csv file for data
  writeCSV(`accounts/${slug}.csv`, []);
}

export default run;
