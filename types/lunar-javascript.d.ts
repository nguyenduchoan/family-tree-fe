declare module 'lunar-javascript' {
    export class Solar {
        static fromYmd(year: number, month: number, day: number): Solar;
        static fromDate(date: Date): Solar;
        getLunar(): Lunar;
        toFullString(): string;
    }

    export class Lunar {
        static fromYmd(year: number, month: number, day: number): Lunar;
        getDay(): number;
        getMonth(): number;
        getYear(): number;
        toFullString(): string;
    }
}
