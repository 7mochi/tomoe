export class Misc {
	static isNumeric(val: unknown): boolean {
		return val != null && val !== "" && !isNaN(Number(val.toString()));
	}

	static randomIntFromInterval(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}
}
