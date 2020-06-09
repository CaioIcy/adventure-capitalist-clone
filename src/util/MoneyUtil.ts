export class MoneyUtil {
	public static moneyToString(cost: number): string {
		// TODO smarter way?
		let append = '';
		if(cost.toFixed(0).length >= 13) {
			cost /= 1000000000000;
			append = 'T';
		}
		else if(cost.toFixed(0).length >= 10) {
			cost /= 1000000000;
			append = 'B';
		}
		else if(cost.toFixed(0).length >= 7) {
			cost /= 1000000;
			append = 'M';
		}
		else if(cost.toFixed(0).length >= 4) {
			cost /= 1000;
			append = 'k';
		}
		return `$! ${cost.toFixed(2)}${append}`;
	}
}