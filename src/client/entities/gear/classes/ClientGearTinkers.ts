export enum GearTinkerType {
    MOMENTUM_THROTTLE_GEAR,             // The time it takes to max the momentum multiplier
	MOMENTUM_THROTTLE_RELEASE, 			// The time it takes to reset the momentum multiplier

	AERIAL_MOMENTUM_GEAR, 				// The time it takes to release the aerial momentum force

	AERIAL_DIRECTION_GEAR, 				// The time it takes to max the aerial direction force
	AERIAL_DIRECTION_RELEASE, 			// The time it takes to reset the aerial direction force

	SPEED_MULTIPLIER_GEAR, 				// The time it takes to max the speed multiplier
	SPEED_MULTIPLIER_RELEASE, 			// The time it takes to reset the speed multiplier

	GAS_BOOST_GEAR, 					// The time it takes to max the gas boost force
	GAS_BOOST_RELEASE, 					// The time it takes to reset the gas boost force

	GRAPPLE_FORCE_DELTA, 				// The time it takes to max the grapple force
}

export type GearTinkerBase = {
	max: number;
	min: number;
	
	value: number;
}

export class ClientGearTinkers {
    private statistics: Record<GearTinkerType, GearTinkerBase> = {
        [GearTinkerType.MOMENTUM_THROTTLE_GEAR]: {max: 0, min: 0, value : 0},
		[GearTinkerType.MOMENTUM_THROTTLE_RELEASE]: {max: 0, min: 0, value : 0},

		[GearTinkerType.AERIAL_MOMENTUM_GEAR]: {max: 0, min: 0, value : 0},

		[GearTinkerType.AERIAL_DIRECTION_GEAR]: {max: 0, min: 0, value : 0},
		[GearTinkerType.AERIAL_DIRECTION_RELEASE]: {max: 0, min: 0, value : 0},

		[GearTinkerType.SPEED_MULTIPLIER_GEAR]: {max: 0, min: 0, value : 0},
		[GearTinkerType.SPEED_MULTIPLIER_RELEASE]: {max: 0, min: 0, value : 0},

		[GearTinkerType.GAS_BOOST_GEAR]: {max: 0, min: 0, value : 0},
		[GearTinkerType.GAS_BOOST_RELEASE]: {max: 0, min: 0, value : 0},

		[GearTinkerType.GRAPPLE_FORCE_DELTA]: {max: 0, min: 0, value : 0},
	};

}