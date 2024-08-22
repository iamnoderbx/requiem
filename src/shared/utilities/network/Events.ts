export enum NetworkEvent {
    EntityPopulation,
    EntityStateUpdate,
    EntityCreation,
    EntityAction,
    EntityRequest,

    Container,
    Replicator,

    Chat,
    Bloodline,
    Command,
    Toast,

    Respawn,
    Interaction,
}

export enum BubbleEffects {
    GEAR,
}

export enum TitanActions {
    ABILITY,
    NETWORK,
}

export enum GearActions {
    UNHOLSTER,
    SHEATHE,
    DAMAGE,
    BLOCK,

    DRAW,

    SHINE,

    UNSHEATHED,
    ANIMATION,

    SWING,
    PARTICLES,

    GRAPPLED,
}

export enum StoreActions {
    REQUEST,
    PURCHASE,
}

export enum PlotActions {
    REQUEST,
    PURCHASE,
}

export enum StableActions {
    REQUEST,
    PURCHASE,
    BREED,
}

export enum HorseActions {
    Equip,
    Unequip,
    Ride,
    Breed,
    Delete,
    Summon,
    Unmount,
}

export enum TreasuryActions {
    Audits,
    Notices,
    Rename,
    Permissions,
    ClaimIncome,
    
    AddUserPermission,
    RemoveUserPermission,
}

export enum BranchMemberActions {
    Pagination,
    Search,
    Filter,
    Limit,
    Rank,
    Action,
    Audits,
    AuditsPagination,
    AuditsFilter,
    Transfers,
}

export enum PlayerActions {
    Respawn,
    Horse,
    Stable,
    Treasury,
    Branch,
    Plot,
    Stores,
}