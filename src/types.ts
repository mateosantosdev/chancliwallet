export type Account = {
	id: string;
	name: string;
};

export type AccountRow = {
	date: string;
	amount: number;
};

export type AccountReport = {
	id: string;
	name: string;
	amount: number;
	percentage: string;
};

export type AccountHistoryRow = AccountRow & { notes?: string };

export type HistoryRow = {
	date: string;
	amount: string;
	notes: string;
};
