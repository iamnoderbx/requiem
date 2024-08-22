import { ClientGearComponent } from "../../classes/ClientGearComponent";
import { ClientGearStatistics } from "../../classes/ClientGearStatistics";

export default class BaseGearHolsters extends ClientGearComponent {
    constructor(statistics : ClientGearStatistics) {
        super(statistics);
    };
    
    // Updated is called every frame that a grapple is active
    public updated() {
        
    }

    // Initialization happens after all of the components have
    // been registered, and the statistics have been added
    public initialize() {}
}