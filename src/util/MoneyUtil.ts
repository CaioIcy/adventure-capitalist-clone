export class MoneyUtil {
    public static moneyToString(cost: number): string {
        const moneyConstants = ['', 'k', 'M', 'B', 'T'];
        const costSimplification = Math.floor(Math.min((cost.toFixed(0).length - 1)/3, moneyConstants.length));
        cost /= Math.pow(1000, costSimplification);
        const mark = moneyConstants[costSimplification];
        return `$${cost.toFixed(2)}${mark}`;
    }
}