import Roact from "@rbxts/roact";
import { markPureComponent } from "@rbxts/roact-hooked";

export default function EntrySliderComponent(props: { Header: string, Body: string } & Roact.PropsWithChildren): Roact.Element {
    return (
        <frame
            BackgroundColor3={Color3.fromRGB(41, 42, 48)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            LayoutOrder={-2}
            Position={UDim2.fromScale(-3.07e-08, 8.83e-08)}
            Size={UDim2.fromScale(1, 0.123)}
            Key={"detachment1"}
        >
            
            {props[Roact.Children]}
            
            <textlabel
                FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                Text={props.Body}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextScaled={true}
                TextSize={14}
                TextTransparency={0.49}
                TextWrapped={true}
                TextXAlignment={Enum.TextXAlignment.Left}
                TextYAlignment={Enum.TextYAlignment.Bottom}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.0262, 0.602)}
                Size={UDim2.fromScale(0.642, -0.177)}
                ZIndex={3}
                Key={"description2"}
            />

            <textlabel
                FontFace={new Font(
                    "rbxasset://fonts/families/SourceSansPro.json",
                    Enum.FontWeight.Bold,
                    Enum.FontStyle.Normal
                )}
                Text={props.Header}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextScaled={true}
                TextSize={14}
                TextTransparency={0.24}
                TextWrapped={true}
                TextXAlignment={Enum.TextXAlignment.Left}
                TextYAlignment={Enum.TextYAlignment.Bottom}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.0262, 0.201)}
                Size={UDim2.fromScale(0.457, 0.212)}
                ZIndex={3}
                Key={"header1"}
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
                ZIndex={0}
                Key={"menu1"}
            >
                <uicorner
                    Key={"UICorner1"}
                    CornerRadius={new UDim(0, 6)}
                />
            </imagelabel>
        </frame>
    )
}

markPureComponent(EntrySliderComponent)