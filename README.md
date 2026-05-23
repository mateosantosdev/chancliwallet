# ChancliWallet

A personal investment portfolio tracker CLI tool. Manage multiple investment accounts and track your portfolio history in CSV format.

## Features

- **Add accounts** — Register new investment accounts
- **List accounts** — View all accounts in a formatted table
- **Remove accounts** — Delete accounts from your portfolio
- **Add rows** — Add investment entries to existing accounts
- **Report** — Display a formatted table with each account's current amount and portfolio percentage
- **Update history** — Snapshot today's total portfolio value into `history.csv`

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `commander` | 14.0.3 | CLI argument parsing |
| `@clack/prompts` | 1.2.0 | Interactive terminal prompts |
| `papaparse` | 5.5.3 | CSV parsing and stringifying |
| `table` | 6.9.0 | Formatted table output |

### Dev Dependencies

- `tsx` — TypeScript execution
- `@types/node` — Node.js type definitions
- `@types/papaparse` — PapaParse type definitions
- `@biomejs/biome` — Code linting and formatting

## Requirements

- Node.js >= 24
- pnpm >= 10

## Installation

```bash
pnpm install
```

## Running the App

```bash
pnpm dev
```

This launches an interactive menu with the following options:

**Accounts**

- Add account
- List accounts
- Remove account

**History**
- Add row to an existing account
- Report
- Update history

## Creating Initial CSV Files

ChancliWallet stores data in CSV format in the `/data` directory. To start from scratch:

### 1. Create the data directory

```bash
mkdir -p data/accounts
```

### 2. Create the main accounts CSV file

Create `data/accounts.csv` with the following structure:

```csv
id,name
savings_account,My Savings Account
stock_portfolio,Stock Portfolio
```

The `id` must be unique and will be used as the filename for account-specific CSV files.

### 3. Create account-specific CSV files

For each account, create a corresponding CSV file under `data/accounts/`:

**`data/accounts/savings_account.csv`**
```csv
date,amount
2026-04-01,1000
2026-04-07,1500
```

### 4. (Optional) Create the history CSV file

`data/history.csv` is created/updated automatically by the **Update history** command, but you can seed it manually:

```csv
date,amount,notes
2026-04-07,2500,
```

## Project Structure

```
chancliwallet/
├── src/
│   ├── commands/
│   │   ├── add-account.ts
│   │   ├── add-account-row.ts
│   │   ├── list-accounts.ts
│   │   ├── remove-account.ts
│   │   ├── report.ts
│   │   └── update-history.ts
│   ├── services/
│   │   └── portfolio.ts       (portfolio total & history logic)
│   ├── utils/
│   │   ├── csv.ts             (CSV read/write helpers)
│   │   └── utils.ts           (formatting & calculation helpers)
│   ├── types.ts
│   └── index.ts               (main CLI entry point)
├── data/
│   ├── accounts.csv
│   ├── history.csv
│   └── accounts/              (account-specific movement files)
├── package.json
├── tsconfig.json
└── README.md
```

## Data Format

All data is stored in comma-separated CSV format.

### `data/accounts.csv`

| Column | Type | Description |
|--------|------|-------------|
| `id` | string | Unique account identifier (slug) |
| `name` | string | Human-readable account name |

### `data/accounts/<id>.csv`

| Column | Type | Description |
|--------|------|-------------|
| `date` | string | Entry date (`YYYY-MM-DD`) |
| `amount` | number | Account value at that date |

### `data/history.csv`

| Column | Type | Description |
|--------|------|-------------|
| `date` | string | Snapshot date (`YYYY-MM-DD`) |
| `amount` | number | Total portfolio value |
| `notes` | string | Optional notes |
