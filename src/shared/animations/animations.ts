export enum Animations {
    DEFAULT,
    GEAR,
    TITAN,
};

export enum Actions {
    GEAR = "Gear",
    COMBAT = "Combat",
    MOVEMENT = "Movement",
    TITANS = "Titans",
    MISCELLANEOUS = "Miscellaneous",
    CHARACTERS = "Characters",
}

export enum Movements { IDLE, WALK, SPRINT }

export default {
    [ Animations.DEFAULT ]: {
        [Movements.IDLE]: "rbxassetid://16899236519",
        [Movements.WALK]: "rbxassetid://17355372840",
        [Movements.SPRINT]: "rbxassetid://17355370555",
    },

    [ Animations.GEAR ]: {
        [Movements.IDLE]: "rbxassetid://16983783147",
        [Movements.WALK]: "rbxassetid://16983788695",
        [Movements.SPRINT]: "rbxassetid://16983785906",
    },

    [ Animations.TITAN ]: {
        [Movements.IDLE]: "rbxassetid://17055959610",
        [Movements.WALK]: "rbxassetid://17055966392",
        [Movements.SPRINT]: "rbxassetid://17055963505",
    },

    [ Actions.MISCELLANEOUS ]: {
        SUMMON_HORSE: "rbxassetid://17846970775",
        RIDE_HORSE: "rbxassetid://17851033451",
        HORSE_IDLE: "rbxassetid://17854032290",
        HORSE_WALK: "rbxassetid://17854130341",
        HORSE_RUN: "rbxassetid://17854478029",
    },

    [ Actions.CHARACTERS ]: {
        STABLEMEN: {
            IDLE: "rbxassetid://17859169009",
        },

        LAND_PROPRIETOR: {
            IDLE: "rbxassetid://18293185473",
        },

        DRAFTSMAN: {
            IDLE: "rbxassetid://18332950577",
        }
    },

    [ Actions.MOVEMENT ]: {
        SLIDE: "rbxassetid://16733096125",
        SLIDE_JUMP: "rbxassetid://16778158204",

        JUMP: "rbxassetid://16740824989",
        FALL: "rbxassetid://17018449458",

        ROLLS: {
            FORWARD: "rbxassetid://16750607940",
            BACKWARD: "rbxassetid://16750606033",
            LEFT: "rbxassetid://16750610056",
            RIGHT: "rbxassetid://16750611941",
        }
    },

    [ Actions.TITANS ]: {
        BLIND_GRAPPLE_GRAB: "rbxassetid://17079325573",

        SIDE_STEP_LEFT: "rbxassetid://17083773904",
        SIDE_STEP_RIGHT: "rbxassetid://17083777099",

        NAPE_GRAB: "rbxassetid://17133489032",
    },

    [ Actions.COMBAT ]: {
        STUNS : [
            "rbxassetid://16713394370",
            "rbxassetid://16713404944",
        ],

        PARRY: "rbxassetid://16736889432",
        PARRIED: "rbxassetid://16736879770",

        PARRY_ATTEMPT: "rbxassetid://16738095782",
        SUCCESSFUL_PARRY: "rbxassetid://16741947568",
    },

    [ Actions.GEAR ]: {
        WALL_SLIDES :{
            RELEASE: {
                LEFT: "rbxassetid://16942767247",
                RIGHT: "rbxassetid://16942769926",
            },

            IDLES: {
                LEFT: "rbxassetid://16941677482",
                RIGHT: "rbxassetid://16941688366",
            }
        },

        DRAW: "rbxassetid://16983458381",
        UNDRAW: "rbxassetid://17018418849",

        AIR_DASHES : {
            FORWARD: "rbxassetid://16954125654",
            BACKWARD: "rbxassetid://16954122718",
            LEFT: "rbxassetid://16954128107",
            RIGHT: "rbxassetid://16954129829",
        },

        AIR_HOOKS: {
            LEFT: "rbxassetid://16899790393",
            RIGHT: "rbxassetid://16899794050",
        },

        GROUND_HOOKS: {
            LEFT: "rbxassetid://16899799073",
            RIGHT: "rbxassetid://16899802532",
        },

        FREE_FALL_HOOKS: {
            LEFT: "rbxassetid://16900079358",
            RIGHT: "rbxassetid://16900081162",
        },

        RELEASES : {
            LEFT: ["rbxassetid://16899902126", "rbxassetid://16899905457", "rbxassetid://16899907657"],
            RIGHT: ["rbxassetid://16899909637", "rbxassetid://16899911826", "rbxassetid://16899914089"],
        },

        ORBITS : {
            LEFT: "rbxassetid://16900263775",
            RIGHT: "rbxassetid://16900266699",
        },

        UNHOLSTER: "rbxassetid://16898597465",
        HOLSTER : "rbxassetid://16898586866",

        UNSHEATHE: "rbxassetid://16731304639",
        BLOCK: "rbxassetid://16735414227",
        AIR_JUMP: "rbxassetid://16741078061",

        BLOCK_HIT: "rbxassetid://16741939386",
        HEAVY: "rbxassetid://16822535611",

        UPPERCUT: "rbxassetid://16822755626",

        SWINGS: [
            "rbxassetid://17018475262",
            "rbxassetid://17018476456",
        ]
    }
}