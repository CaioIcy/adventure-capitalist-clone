export class TimeUtil {
    public static secondsToString(seconds: number): string {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds - (hours * 3600)) / 60);

        if(hours > 0) {
            return `${hours}h${minutes.toFixed(2)}m`;
        }
        if(minutes > 0) {
            return `${minutes}m${seconds.toFixed(2)}s`;
        }
        return `${seconds.toFixed(0)}s`;
    }

    public static nowS(): number {
        return Date.now() / 1000;
    }
}