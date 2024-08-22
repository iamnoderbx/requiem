import { NetworkBubble } from "client/network/ClientBubbles";
import { Entities } from "shared/EntitySignatures";
import { Listeners } from "shared/utilities/decorators/EntityListensFor";
import { BaseEntity } from "../BaseEntity";
import { ClientGearStatistics } from "./classes/ClientGearStatistics";
import { GearComponents, ClientGearComponent } from "./classes/ClientGearComponent";
import { States } from "../player/ClientPlayerStates";
import { Memory } from "shared/utilities/memory.utilities";
import { GearActions } from "shared/utilities/network/Events";
import { UtilitySharedSelectors } from "selectors/UtilitySharedSelectors";
import { Players } from "@rbxts/services";
import Object from "@rbxts/object-utils";

import BaseGearMovement from "./components/movement/BaseGearMovement";
import BaseGearBlades from "./components/blades/BaseGearBlades";
import BaseGearGyroscope from "./components/gyroscope/BaseGearGyroscope";
import BaseGearHousing from "./components/housing/BaseGearHousing";
import BaseGearSpooling from "./components/spooling/BaseGearSpooling";
import BaseGearTurbine from "./components/turbine/BaseGearTurbine";
import BaseGearWinches from "./components/winches/BaseGearWinches";
import BaseGearHolsters from "./components/holsters/BaseGearHolsters";
import BaseGearCannister from "./components/cannisters/BaseGearCannister";
import BaseGearEjector from "./components/ejector/BaseGearEjector";
import BaseGearHandles from "./components/handles/BaseGearHandles";
import BaseGearGrapples from "./components/grapples/BaseGearGrapples";
import { BaseGearParticles } from "./components/particles/BaseGearParticles";

// Register the entity to listen for the EntityPopulation with
// signature of Client
@Listeners.EntityReplicatedWith(Entities.Weapons.GEAR)
export class ClientDefaultGear extends BaseEntity {
    private statistics : ClientGearStatistics = new ClientGearStatistics();
    private components! : Record<GearComponents, ClientGearComponent>

    private isNetworkOwner : boolean = false;

    constructor(data : NetworkBubble.RawEntityDataType) {
        super(data, () => this.initialize())

        // Check if the player owns the entity
        const ownership = UtilitySharedSelectors.getNumber(this.getBufferFromIndex(1))
        if(ownership !== Players.LocalPlayer.UserId) return;

        this.isNetworkOwner = true;

        this.components = {
            [GearComponents.GYROSCOPE]:     new BaseGearGyroscope(this.statistics),
            [GearComponents.HOUSING]:       new BaseGearHousing(this.statistics),
            [GearComponents.SPOOLING]:      new BaseGearSpooling(this.statistics),
            [GearComponents.TURBINE]:       new BaseGearTurbine(this.statistics),
            [GearComponents.WINCHES]:       new BaseGearWinches(this.statistics),
            [GearComponents.HOLSTERS]:      new BaseGearHolsters(this.statistics),
            [GearComponents.CANNISTERS]:    new BaseGearCannister(this.statistics),
            [GearComponents.EJECTOR]:       new BaseGearEjector(this.statistics),
            [GearComponents.HANDLES]:       new BaseGearHandles(this.statistics),
            [GearComponents.GRAPPLES]:      new BaseGearGrapples(this.statistics),
            [GearComponents.MOVEMENT]:      new BaseGearMovement(this.statistics),
            [GearComponents.BLADES]:        new BaseGearBlades(this.statistics),
        }
    }

    public getComponent<T>(component : GearComponents) {
        return this.components[component as unknown as GearComponents] as T;
    }
    
    private listeners() {
        const particles = new BaseGearParticles(this.statistics);
        this.network.listen(GearActions.PARTICLES, (particle : string) => particles.emit(particle))
    }

    private initialize() {
        // Initialize the components
        this.listeners()

        // Check if the player owns the entity
        if(!this.isNetworkOwner) return;

        // Initialize the components
        for(const component of Object.values(this.components)) {
            component.initialize(this.components, this.network);
        }

        // Listen for the holster state
        const holster = States.States.subscription("holstered")
        Memory.changed(holster, (value) => this.network.action(GearActions.UNHOLSTER, value))
    }
}
