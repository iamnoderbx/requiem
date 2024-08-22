export namespace Entities {
    // Used for replication
    export enum Players {
        CLIENT      = 0,
        CHARACTER   = 1,
    }

    export enum Entities {
        HUMANOID    = 100,
        BASE_TITAN  = 110,
        HORSE       = 120,
    }

    export enum Weapons {
        GEAR    = 200,
    }

    export enum Objects {
        INTERACTION = 300,
        ITEM        = 301,
    }

    export enum Development {
        DEBUGGING   = 400,
    }

    export enum Other {
        NONE        = 1000,
    }
}