import { SharedReputationsComponent } from "server/components/Locations/SharedReputationsComponent";
import { BasePlayerEntity } from "../../BasePlayerEntity";
import ReputationAPIServiceRunner from "./ReputationAPIServiceRunner";

export default class PlayerReputationService {
	public static reputations : SharedReputationsComponent.Component;

    constructor(private player: BasePlayerEntity) { }

    public initialize(): Promise<string> {
        return new Promise(async (resolve, reject) => {
			if(!PlayerReputationService.reputations) {
				const results = await ReputationAPIServiceRunner.getEverything();
				PlayerReputationService.reputations = new SharedReputationsComponent.Component(PlayerReputationService.reputations || results);
			}

            this.player.addComponent(PlayerReputationService.reputations);
            resolve("Successfully initialized reputations service.")
        })
    }
}