export enum StatisticModes {
    SET, ADD, MULT, SUBTRACT
};

export type StatisticSettings = {
    Mode: StatisticModes,
    Priority: number,

    Tween?: TweenInfo,
    Lifetime?: number,
}

type StatisticSettingType = [string, number, StatisticModes, number, TweenInfo?]
type StatisticUpdated = (value : number, tween : TweenInfo | undefined) => void

export class Statistic {
    // Key, Value, Mode, Priority, Tween
    private record : StatisticSettingType[] = []
    public value = 0

    constructor(private callback: StatisticUpdated) {
        
    }

    private getHighestTotalPriority() : StatisticSettingType | undefined {
        let highest = -1
        let stored = undefined

        this.record.forEach((settings) => {
            if(settings[3] < highest) return
            highest = settings[3]
            stored = settings
        })

        return stored
    }

    private getHighestSetPriority() {
        let highest = -1
        let stored = undefined

        this.record.forEach((settings) => {
            if (settings[2] !== StatisticModes.SET) return
            if (settings[3] < highest) return

            highest = settings[3]
            stored = settings
        })

        return stored
    }
    
    private equateStatisticAbove(highest : StatisticSettingType) {
        let value = highest[1]

        this.record.forEach((settings) => {
            if (settings[3] < highest[3]) return

            if(settings[2] === StatisticModes.ADD) {
                value += settings[1]
            } else if (settings[2] === StatisticModes.SUBTRACT) {
                value -= settings[1]
            } else if (settings[2] === StatisticModes.MULT) {
                value *= settings[1]
            }
        })

        return value
    }

    private forceUpdateStatistic(tween : TweenInfo | void) {        
        let highestStatistic = this.getHighestSetPriority()
        if(!highestStatistic) return

        let value = this.equateStatisticAbove(highestStatistic)
        let highestPriority = this.getHighestTotalPriority()

        if(this.value !== value && highestPriority) {
            this.onStatisticUpdated(value, tween || highestPriority[4])
        } 

        this.value = value
    }

    private getStatisticFromKey(key : string) : StatisticSettingType | undefined {
        let highest = -1
        let stored  = undefined

        this.record.forEach((settings) => {
            if(settings[0] === key && settings[3] > highest) {
                highest = settings[3]
                stored = settings
            }
        })

        return stored
    }

    public deleteStatistic(key : string, settings : StatisticSettings | {Priority: number, Tween?: TweenInfo}) {
        let priority = settings.Priority
        let foundIndex = undefined

        for (const [index, statistic] of pairs(this.record)) {
            if (statistic[0] === key && statistic[3] === priority) {
                foundIndex = index
            }
        }

        if(foundIndex) {
            this.record.remove(foundIndex - 1)
            this.forceUpdateStatistic(settings.Tween)
        }
    }

    public onStatisticUpdated(value : number, tween? : TweenInfo) {
        //print('updated:', value)
        if(!this.callback) return
        
        this.callback(value, tween)
    }

    public adjust(key : string, value : number, settings : StatisticSettings) {
        let mode = settings.Mode
        let priority = settings.Priority
        let tween = settings.Tween
        let lifetime = settings.Lifetime

        let statisticTable = this.getStatisticFromKey(key)

        if(statisticTable) {
            statisticTable[0] = key
            statisticTable[1] = value
            statisticTable[2] = mode
            statisticTable[3] = priority
            statisticTable[4] = tween
        } else {
            this.record.push([key, value, mode, priority, tween])
        }

        if(lifetime) {
            task.delay(lifetime, () => {
                this.deleteStatistic(key, settings)
            })
        }

        this.forceUpdateStatistic()
    }
}