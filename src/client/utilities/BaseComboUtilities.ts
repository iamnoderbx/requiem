export class BaseCombo {
    // Starts at -1 so that the first increment is 0.
    private combo : number = -1;
    private swung : number = tick() - 10;

    private maxCombo : number = 3;

    public setMaximumCombo(combo : number) {
        this.maxCombo = combo
    }

    public reset() {
        this.combo = -1
        return this.combo
    }

    public increment() {
        if(tick() - this.swung > 1) {
            this.swung = tick() 
            return this.combo = 0
        }

        this.swung = tick()

        if(this.combo === this.maxCombo) return (this.combo = 0)
        this.combo = math.clamp(this.combo + 1, 0, this.maxCombo)

        return this.combo
    }
}