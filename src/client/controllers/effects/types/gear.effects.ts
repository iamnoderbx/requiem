import { BubbleEffects } from "shared/utilities/network/Events";
import { ClientBubbleEffect } from "../ClientBubbleEffect";

export default class implements ClientBubbleEffect {
    readonly EVENT_ID = BubbleEffects.GEAR;

    public execute(buffer: buffer): void {
        print("Executing gear effect");
    }
}