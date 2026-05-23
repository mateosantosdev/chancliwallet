import { readFileSync, unlinkSync, writeFileSync } from "node:fs";
import Papa, { UnparseConfig } from "papaparse";
import { join } from "node:path";

const DIR = "data-demo";
export function readCSV<T>(filename: string) {
  try {
    const path = join(process.cwd(), DIR, filename);
    const content = readFileSync(path, "utf8");
    return Papa.parse(content, { header: true }).data as T;
  } catch (error) {
    throw error;
  }
}

export function writeCSV<T>(
  filename: string,
  data: T[],
  config?: UnparseConfig,
) {
  try {
    const path = join(process.cwd(), DIR, filename);
    writeFileSync(path, Papa.unparse(data, config), "utf8");
  } catch (error) {
    throw error;
  }
}

export function appendCSV(filename: string, data: Record<string, string>) {
  try {
    const path = join(process.cwd(), DIR, filename);
    const content = readFileSync(path, "utf8");
    const csvContent = Papa.parse(content, { header: true }).data;
    csvContent.push(data);
    writeFileSync(path, Papa.unparse(csvContent), "utf8");
  } catch (error) {
    throw error;
  }
}

export function removeCSV(filename: string) {
  try {
    const path = join(process.cwd(), DIR, filename);
    unlinkSync(path);
  } catch (error) {
    throw error;
  }
}

export function getLatestRowFromCSV<T>(filename: string) {
  try {
    const path = join(process.cwd(), DIR, filename);
    const content = readFileSync(path, "utf8");
    const data = Papa.parse(content, { header: true }).data;
    return data.at(-1) as T;
  } catch (error) {
    throw error;
  }
}
