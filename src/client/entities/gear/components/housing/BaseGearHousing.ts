import { ClientGearComponent } from "../../classes/ClientGearComponent";
import { ClientGearStatistics } from "../../classes/ClientGearStatistics";
import { ClientGearTinkers } from "../../classes/ClientGearTinkers";

export default class BaseGearHousing extends ClientGearComponent {
    constructor(statistics : ClientGearStatistics, tinkers : ClientGearTinkers) {
        super(statistics, tinkers);
    };
    
    // Updated is called every frame that a grapple is active
    public updated() {
        
    }

    // Initialization happens after all of the components have
    // been registered, and the statistics have been added
    public initialize() {

    }
}