import Roact from "@rbxts/roact";
import { useEffect, useMutable, useRef } from "@rbxts/roact-hooked";
import { GuiService, StarterGui, Workspace } from "@rbxts/services";
import { Requiem } from "shared/Requiem";

const signal = new Instance("BindableEvent")
const tooltips: Map<string, Frame> = new Map();

export default function TooltipsRoute(): Roact.Element {
    const ref = useRef<Frame>()
    const listener = useMutable<RBXScriptConnection>()

    useEffect(() => {
        if (!ref.getValue()) return
        if (listener.current) listener.current.Disconnect()

        const frame = ref.getValue()

        listener.current = signal.Event.Connect((key: number, position: Vector2, header: string, message: string) => {
            if (key === 0) {
                const resolution = Workspace.CurrentCamera?.ViewportSize.Y ?? 0;
                const maxTextSize = 27;

                // Calculate the text size based on the resolution, and the maximum text size.
                let textSize = (resolution / 1080) * maxTextSize;

                const tooltip = Requiem.Assets.other.tooltip.Clone()
                tooltip.body.header.Text = header
                tooltip.body.body.Text = message

                tooltip.body.body.TextSize = textSize
                tooltip.Parent = frame

                // Get the top bar size.
                const [ topBarVector ] = GuiService.GetGuiInset()
                
                // Adjust the position considering the anchor point
                const adjustedPosition = new Vector2(
                    position.X,
                    (position.Y + tooltip.AbsoluteSize.Y / 2) - (topBarVector.Y + 15)
                );

                tooltip.Position = UDim2.fromOffset(adjustedPosition.X, adjustedPosition.Y)
                tooltips.set(`${position.X}-${position.Y}`, tooltip)
            } else {
                const tooltip = tooltips.get(`${position.X}-${position.Y}`)
                if (tooltip) {
                    tooltip.Destroy()
                    tooltips.delete(`${position.X}-${position.Y}`)
                }
            }
        })
    }, [ref])

    return (
        <frame
            Key={"tooltips"}
            AnchorPoint={new Vector2(0, 0)}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0, 0)}
            Size={UDim2.fromScale(1, 1)}
            Ref={ref}
        />
    )
}

export namespace Tooltip {
    export function show(position: Vector2, header: string, message: string) {
        signal.Fire(0, position, header, message)
    }

    export function hide(position: Vector2) {
        signal.Fire(1, position)
    }
}