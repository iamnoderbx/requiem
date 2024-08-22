import { ClientGearComponent } from "../../classes/ClientGearComponent";
import { ClientGearStatistics, GearStatisticType } from "../../classes/ClientGearStatistics";

export default class BaseGearSpooling extends ClientGearComponent {
    constructor(statistics : ClientGearStatistics) {
        super(statistics);

        statistics.addStatistic(GearStatisticType.GRAPPLE_LENGTH, 2000)
    };
    
    // Updated is called every frame that a grapple is active
    public updated() {
        
    }

    // Initialization happens after all of the components have
    // been registered, and the statistics have been added
    public initialize() {

    }
}