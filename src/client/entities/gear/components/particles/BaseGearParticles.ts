import { NetworkEntity } from "client/network/NetworkEntity";
import { ClientGearComponent, GearComponentsList } from "../../classes/ClientGearComponent";

export class BaseGearParticles extends ClientGearComponent {
    public emit(particle : string) {
        print("Emitting:", particle)
    }

    // This is a placeholder for the particles component
    initialize(components: GearComponentsList, network: NetworkEntity): void {}
}