export const slugify = (str: string): string =>
	str
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, "")
		.replace(/[\s_-]+/g, "-")
		.replace(/^-+|-+$/g, "");

export const isNum = (value: string | undefined) => {
	return !Number.isNaN(Number(value));
};

export function toCurrency(amount: string | number) {
	return new Intl.NumberFormat("es-ES", {
		style: "currency",
		currency: "EUR",
	}).format(Number(amount));
}

export function calculatePercentage(amount: number, total: number) {
	const simpleFormat = new Intl.NumberFormat("es-ES", {
		style: "percent",
		maximumFractionDigits: 2,
	});
	return simpleFormat.format(Number(amount / total));
}

export function getTodayDate() {
	const date = new Date();
	const [year, month, day] = [
		new Intl.DateTimeFormat("es-ES", { year: "numeric" }).format(date),
		new Intl.DateTimeFormat("es-ES", { month: "2-digit" }).format(date),
		new Intl.DateTimeFormat("es-ES", { day: "2-digit" }).format(date),
	];
	return `${year}-${month}-${day}`;
}
