import Roact from "@rbxts/roact";
import { markPureComponent } from "@rbxts/roact-hooked";

export function EntryLargeComponent(props: {} & Roact.PropsWithChildren): Roact.Element {
    return (
        <frame
            BackgroundColor3={Color3.fromRGB(41, 42, 48)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            ClipsDescendants={true}
            Position={UDim2.fromScale(0.000967, 0)}
            Size={UDim2.fromScale(0.962, 0.164)}
            ZIndex={5}
            Key={"header1"}
        >
            <uicorner Key={"UICorner"} />

            <uiaspectratioconstraint
                Key={"UIAspectRatioConstraint1"}
                AspectRatio={8.77}
            />

            <imagelabel
                Image={"rbxassetid://16255699706"}
                ImageColor3={Color3.fromRGB(149, 197, 255)}
                ImageTransparency={0.97}
                ScaleType={Enum.ScaleType.Crop}
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={Color3.fromRGB(31, 33, 39)}
                BackgroundTransparency={0.35}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                LayoutOrder={-1}
                Position={UDim2.fromScale(0.5, 0.5)}
                Size={UDim2.fromScale(1, 1)}
                ZIndex={0}
                Key={"menu1"}
            >
                <uicorner Key={"UICorner"} />
            </imagelabel>

            {props[Roact.Children]}
        </frame>
    )
}

export default function EntryComponent(props: { Size?: UDim2, LayoutOrder?: number, Ratio?: number } & Roact.PropsWithChildren): Roact.Element {
    return (
        <frame
            BackgroundColor3={Color3.fromRGB(41, 42, 48)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(2.07e-07, -1.96e-08)}
            Size={props.Size ?? UDim2.fromScale(1, 0.07)}
            Key={"detachment1"}
            LayoutOrder={props.LayoutOrder}
            ClipsDescendants={true}
        >
            <uicorner
                Key={"UICorner1"}
                CornerRadius={new UDim(0, 8)}
            />

            <imagelabel
                Image={"rbxassetid://16255699706"}
                ImageColor3={Color3.fromRGB(149, 197, 255)}
                ImageTransparency={0.97}
                ScaleType={Enum.ScaleType.Crop}
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={Color3.fromRGB(31, 33, 39)}
                BackgroundTransparency={0.35}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.5, 0.5)}
                Size={UDim2.fromScale(1, 1)}
                Key={"menu1"}
                ZIndex={0}
            >
                <uicorner
                    Key={"UICorner1"}
                    CornerRadius={new UDim(0, 8)}
                />
            </imagelabel>

            <uiaspectratioconstraint
                Key={"UIAspectRatioConstraint1"}
                AspectRatio={props.Ratio ?? 21.4}
            />

            {props[Roact.Children]}
        </frame>
    )
}

markPureComponent(EntryComponent);