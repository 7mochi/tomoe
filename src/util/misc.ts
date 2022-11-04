export class Misc {
	static isNumeric(val: unknown): boolean {
		return val != null && val !== "" && !isNaN(Number(val.toString()));
	}
}
