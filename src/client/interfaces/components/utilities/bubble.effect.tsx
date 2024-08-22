import { TweenService } from "@rbxts/services";
import { Toasts } from "client/interfaces/routes/toasts.route";
import { Requiem } from "shared/Requiem";

let BUTTON_LAST_PRESSED = tick();
let REMOVE_LOADING_EFFECT: (() => void) | undefined
let LOADING_FRAME: Frame | undefined

export namespace LoadingBubbleEffect {
    export function create(parent : Instance) {
        const frame = Requiem.Assets.other.bubbles.Clone()
        frame.Parent = parent;

        const thread = coroutine.create(() => {
            // Loop from 0 to 2
            while(true) {
                if(!frame || !parent || !frame.Parent) return;

                for(let i = 0; i < 3; i++) {
                    const bubbleFrame = frame.FindFirstChild(tostring(i)) as Frame;
                    if(!bubbleFrame) continue
                    
                    const circle = bubbleFrame.FindFirstChild("Frame") as Frame;
                    TweenService.Create(circle, new TweenInfo(0.8), {BackgroundTransparency: 0.3}).Play()

                    if(!frame || !parent || !frame.Parent) return;
                    task.wait(0.2);
                    if(!frame || !parent || !frame.Parent) return;

                    task.spawn(() => {
                        task.wait(0.3);
                        if(!frame || !parent || !frame.Parent) return;
                        TweenService.Create(circle, new TweenInfo(0.8), {BackgroundTransparency: 1}).Play()
                    })
                }
                task.wait(1)
            }
        })

        coroutine.resume(thread);

        return () => {
            frame.Destroy();
            coroutine.close(thread);
        }
    }

    export const HandleLoadingBubbles = (frame : Frame) : boolean => {
        const locked = frame.FindFirstChild("locked") as Frame;
        if (locked && locked.Visible) return true
    
        if (tick() - BUTTON_LAST_PRESSED < 3) {
            Toasts.info("We get it, slow down! You're clicking too fast.")
            return true
        }
    
        BUTTON_LAST_PRESSED = tick()
    
        locked.Visible = true;
    
        REMOVE_LOADING_EFFECT = LoadingBubbleEffect.create(locked);
        LOADING_FRAME = locked;
        return false;
    }
    
    export const CleanupLoadingBubbles = () => {
        if (REMOVE_LOADING_EFFECT) {
            REMOVE_LOADING_EFFECT();
            REMOVE_LOADING_EFFECT = undefined;
        }
    
        if (LOADING_FRAME) {
            LOADING_FRAME.Visible = false;
            LOADING_FRAME = undefined;
        }
    }
}