import { Controller } from "shared/utilities/decorators/ServiceControllers";
import { BubbleEffects } from "shared/utilities/network/Events";

export abstract class ClientBubbleEffect {
    public abstract EVENT_ID: BubbleEffects;

    public abstract execute(buffer: buffer): void;
}

@Controller()
export default class {
    public initialize() {
        
    }
}