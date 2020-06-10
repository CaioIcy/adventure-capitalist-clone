export class TimeUtil {
    public static secondsToString(seconds: number): string {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds - (hours * 3600)) / 60);

        if(hours > 0) {
            // return `${hours}h${minutes.toFixed(0)}m`;
            return `${hours}h`;
        }
        if(minutes > 0) {
            seconds -= (minutes * 60);
            // return `${minutes}m${seconds.toFixed(0)}s`;
            return `${minutes}m`;
        }
        return `${seconds.toFixed(0)}s`;
    }

    public static nowS(): number {
        return Date.now() / 1000;
    }
}