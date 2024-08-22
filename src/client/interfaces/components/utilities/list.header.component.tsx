import Roact from "@rbxts/roact";

export default function ListHeaderComponent(props : {Text : string}): Roact.Element {
    return (
        <frame
            BackgroundColor3={Color3.fromRGB(41, 42, 48)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            LayoutOrder={-1}
            Position={UDim2.fromScale(2.95e-08, 3.91e-08)}
            Size={UDim2.fromScale(0.962, 0.0554)}
            Key={"header"}
        >
            <uicorner
                Key={"UICorner"}
                CornerRadius={new UDim(0.2, 0)}
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
                Key={"menu"}
            >
                <uicorner
                    Key={"UICorner"}
                    CornerRadius={new UDim(0, 10)}
                />
            </imagelabel>

            <textlabel
                FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                Text={props.Text}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextScaled={true}
                TextSize={14}
                TextTransparency={0.49}
                TextWrapped={true}
                TextXAlignment={Enum.TextXAlignment.Left}
                TextYAlignment={Enum.TextYAlignment.Bottom}
                AnchorPoint={new Vector2(0, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.0189, 0.5)}
                Size={UDim2.fromScale(0.82, 0.374)}
                ZIndex={3}
                Key={"text"}
            />
        </frame>
    )
}