import Roact from "@rbxts/roact";
import { markPureComponent } from "@rbxts/roact-hooked";

function BranchShoutComponent(props: { Shout: string }): Roact.Element {
    return (
        <frame
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            LayoutOrder={2}
            Position={UDim2.fromScale(0.0174, 0.171)}
            Size={UDim2.fromScale(0.962, 0.118)}
            Key={"shout1"}
        >
            <textlabel
                FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                Text={props.Shout}
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
                Position={UDim2.fromScale(0.0312, 0.546)}
                Size={UDim2.fromScale(0.962, 0.197)}
                ZIndex={3}
                Key={"description1"}
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
                <uicorner Key={"UICorner"} />
            </imagelabel>

            <frame
                AnchorPoint={new Vector2(0, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.0312, 0.345)}
                Size={UDim2.fromScale(0.436, 0.222)}
                Key={"data1"}
            >
                <uilistlayout
                    Key={"UIListLayout1"}
                    ItemLineAlignment={Enum.ItemLineAlignment.Center}
                    Padding={new UDim(0.015, 0)}
                    FillDirection={Enum.FillDirection.Horizontal}
                    SortOrder={Enum.SortOrder.LayoutOrder}
                    VerticalAlignment={Enum.VerticalAlignment.Center}
                />

                <textlabel
                    FontFace={new Font(
                        "rbxasset://fonts/families/SourceSansPro.json",
                        Enum.FontWeight.Bold,
                        Enum.FontStyle.Normal
                    )}
                    RichText={true}
                    Text={"Branch Shout"}
                    TextColor3={Color3.fromRGB(255, 255, 255)}
                    TextScaled={true}
                    TextSize={14}
                    TextTransparency={0.24}
                    TextWrapped={true}
                    TextXAlignment={Enum.TextXAlignment.Left}
                    TextYAlignment={Enum.TextYAlignment.Bottom}
                    AutomaticSize={Enum.AutomaticSize.X}
                    BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                    BackgroundTransparency={1}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.0023, 0)}
                    Size={UDim2.fromScale(0.21, 1)}
                    ZIndex={2}
                    Key={"name1"}
                />
            </frame>
        </frame>
    )
}

export default markPureComponent(BranchShoutComponent);;