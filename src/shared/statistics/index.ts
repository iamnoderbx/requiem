import { Statistic } from "./classes/Statistic";

export class BaseStatistic extends Statistic {
    private __callback : ((value : number, tween : TweenInfo | undefined) => void) | undefined;

    constructor() {
        const callback = (value : number, tween : TweenInfo | undefined) => {
            if(!this.__callback) return;
            this.__callback(value, tween);
        }

        super(callback)
    }

    async connect(callback : (value : number, tween : TweenInfo | undefined) => void) {
        this.__callback = callback;
    }
}

export class Statistics<T extends Map<string, BaseStatistic>> {
    private statistics: T = new Map() as T;

    constructor() {}

    async create(str: string) {
        this.statistics.set(str, new BaseStatistic());
        return this.statistics.get(str)!;
    }

    get(str: string) {
        return this.statistics.get(str);
    }
}