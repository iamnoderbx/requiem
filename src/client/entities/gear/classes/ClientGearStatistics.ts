export enum GearStatisticType {
    WEIGHT,             // The weight of the gear

    GRAPPLE_LENGTH,     // The length of the grapple
    GRAPPLE_SPEED,      // The speed of the grapple

    GYRO_SPEED,         // The speed of the gyroscope
    GYRO_POWER,         // The power of the gyroscope

    GAS_MULTIPLIER,     // The speed of the gas
    MAX_GAS_SPEED,      // The maximum speed of the gas

    GAS_CAPACITY,       // The capacity of the gas
    BLADE_CAPACITY,     // The capacity of the blade

    SPEED_MULTIPLIER,   // Applied to both gas, horizontal, and vertical speed.
    MOMENTUM_MULTIPLIER,   // Applied to the power of the gear

    HORIZONTAL_SPEED,   // The horizontal speed of the gear
    VERTICAL_SPEED,     // The vertical speed of the gear

    BLADE_DURABILITY,   // The durability of the blade
}

export class ClientGearStatistics {
    private statistics: Record<GearStatisticType, number> = {
        // The weight of the gear, will modify speed & drag
        [GearStatisticType.WEIGHT]: 0,

        // The maximum length you can grapple & how fast they retract/extend
        [GearStatisticType.GRAPPLE_LENGTH]: 0,
        [GearStatisticType.GRAPPLE_SPEED]: 0,

        // The speed of the gyroscope & how much power it has
        [GearStatisticType.GYRO_SPEED]: 0,
        [GearStatisticType.GYRO_POWER]: 0,

        // The speed of the gas & the maximum speed it can go
        [GearStatisticType.GAS_MULTIPLIER]: 0,
        [GearStatisticType.MAX_GAS_SPEED]: 0,

        // How much gas your cannister can hold & how much blade capacity you have
        [GearStatisticType.GAS_CAPACITY]: 0,
        [GearStatisticType.BLADE_CAPACITY]: 0,

        // The speed multiplier for gas, horizontal, and vertical speed
        [GearStatisticType.SPEED_MULTIPLIER]: 0,
        [GearStatisticType.MOMENTUM_MULTIPLIER]: 0,

        [GearStatisticType.HORIZONTAL_SPEED]: 0,
        [GearStatisticType.VERTICAL_SPEED]: 0,

        // The durability of the blade
        [GearStatisticType.BLADE_DURABILITY]: 0,
    };

    /**
     * Adds a value to a specific gear statistic.
     * @public
     * @param {GearStatisticType} __type - The type of the gear statistic.
     * @param {number} value - The value to add.
     * @example
     * this.addStatistic(GearStatisticType.WEIGHT, 10);
     * @author NodeSupport
     */
    public addStatistic(__type: GearStatisticType, value: number) {
        this.statistics[__type] += value;
    }

    /**
     * Sets a specific gear statistic to a value.
     * @public
     * @param {GearStatisticType} __type - The type of the gear statistic.
     * @param {number} value - The value to set.
     * @example
     * this.setStatistic(GearStatisticType.WEIGHT, 100);
     * @author NodeSupport
     */
    public setStatistic(__type: GearStatisticType, value: number) {
        this.statistics[__type] = value;
    }

    /**
     * Subtracts a value from a specific gear statistic.
     * @public
     * @param {GearStatisticType} __type - The type of the gear statistic.
     * @param {number} value - The value to subtract.
     * @example
     * this.removeStatistic(GearStatisticType.WEIGHT, 10);
     * @author NodeSupport
     */
    public subtractStatistic(__type: GearStatisticType, value: number) {
        this.statistics[__type] -= value;
    }

    /**
     * Divides a specific gear statistic by a value.
     * @public
     * @param {GearStatisticType} __type - The type of the gear statistic.
     * @param {number} value - The value to divide by.
     * @example
     * this.divideStatistic(GearStatisticType.WEIGHT, 2);
     * @author NodeSupport
     */
    public divideStatistic(__type: GearStatisticType, value: number) {
        this.statistics[__type] /= value;
    }

    /**
     * Multiplies a specific gear statistic by a value.
     * @public
     * @param {GearStatisticType} __type - The type of the gear statistic.
     * @param {number} value - The value to multiply by.
     * @example
     * this.multiplyStatistic(GearStatisticType.WEIGHT, 2);
     * @author NodeSupport
     */
    public multiplyStatistic(__type: GearStatisticType, value: number) {
        this.statistics[__type] *= value;
    }

    /**
     * Gets the value of a specific gear statistic.
     * @public
     * @param {GearStatisticType} __type - The type of the gear statistic.
     * @returns {number} The value of the gear statistic.
     * @example
     * const weight = this.getStatistic(GearStatisticType.WEIGHT);
     * @author NodeSupport
     */
    public getStatistic(__type: GearStatisticType): number {
        return this.statistics[__type];
    }
}