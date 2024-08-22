import Roact from "@rbxts/roact";
import { useEffect, useMutable, useRef } from "@rbxts/roact-hooked";
import { ReplicatedStorage, TweenService } from "@rbxts/services";
import { NetworkBubble } from "client/network/ClientBubbles";
import { Requiem } from "shared/Requiem";
import BufferWrapper from "shared/utilities/BufferWrapper/BufferWrapper";
import { NetworkEvent } from "shared/utilities/network/Events";

const signal = new Instance("BindableEvent")
const frames : Map<CanvasGroup, UDim2> = new Map();

export default function ToastRoute(): Roact.Element {
    const ref = useRef<Frame>()
    const listener = useMutable<RBXScriptConnection>()

    useEffect(() => {
        if(!ref.getValue()) return
    
        if(listener.current) listener.current.Disconnect()
        
        const frame = ref.getValue()

        listener.current = signal.Event.Connect((toastType : number, message : string) => {
            const toastFrame = toastType === 0 ? Requiem.Assets.other.error.Clone() : toastType === 1 ? Requiem.Assets.other.success.Clone() : Requiem.Assets.other.info.Clone()
            toastFrame.Position = UDim2.fromScale(0.5, -0.25)
            toastFrame.TextLabel.Text = message
            toastFrame.Parent = frame

            toastFrame.GroupTransparency = 1

            frame?.GetChildren().forEach((child) => {
                if(!child.IsA("CanvasGroup")) return
                if(child === toastFrame) return
                
                frames.set(child, frames.get(child)!.add(new UDim2(0, 0, toastFrame.Size.Y.Scale, 3)))
                TweenService.Create(child, new TweenInfo(0.3, Enum.EasingStyle.Linear, Enum.EasingDirection.InOut), {
                    Position: frames.get(child)
                }).Play()
            })

            TweenService.Create(toastFrame, new TweenInfo(0.3, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut), {
                Position: UDim2.fromScale(0.5, 0),
                GroupTransparency: 0
            }).Play()

            frames.set(toastFrame, UDim2.fromScale(0.5, 0));
            task.wait(3)

            TweenService.Create(toastFrame, new TweenInfo(0.1, Enum.EasingStyle.Linear, Enum.EasingDirection.InOut), {
                GroupTransparency: 1
            }).Play()

            task.delay(0.1, () => {
                toastFrame.Destroy()
                frames.delete(toastFrame)
            })
        })
    }, [ ref ])

    return (
        <frame
            Key={"toasts"}
            AnchorPoint={new Vector2(0.5, 0.5)}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.5, 0.5)}
            Size={UDim2.fromScale(1, 1)}
            ZIndex={100}
        >
            <frame
                Key={"frame"}
                AnchorPoint={new Vector2(0.5, 0)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.5, 0.064)}
                Size={UDim2.fromScale(0.9, 0.8)}
                Ref={ref}
            >
                <uiaspectratioconstraint
                    Key={"uIAspectRatioConstraint"}
                    AspectRatio={1.98}
                />
            </frame>
        </frame>
    )
}

export namespace Toasts {
    export function failed(message : string) {
        signal.Fire(0, message)
    }

    export function success(message : string) {
        signal.Fire(1, message)
    }

    export function info(message : string) {
        signal.Fire(2, message)
    }

    NetworkBubble.listen(NetworkEvent.Toast, (buffer : buffer) => {
        const parser = BufferWrapper();
        const [ message, isError, isInfo ] = parser.deserialize(buffer) as [ string, boolean, boolean ];

        if(isInfo) {
            info(message)
        } else if(isError) {
            failed(message)
        } else {
            success(message)
        }
    })
}