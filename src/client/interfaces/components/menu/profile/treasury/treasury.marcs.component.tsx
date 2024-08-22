import Roact from "@rbxts/roact";
import { markPureComponent } from "@rbxts/roact-hooked";
import { ScaleTextToBounds } from "client/interfaces/components/utilities/textscaler.effect";
import { Number } from "shared/utilities/number.utilities";

export default function TreasuryMarcsComponent(props: {Marcs : number, OnWithdrawClicked: () => void, OnDepositClicked: () => void}): Roact.Element {
    return (
        <frame
            BackgroundColor3={Color3.fromRGB(41, 42, 48)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            LayoutOrder={1}
            Position={UDim2.fromScale(2.07e-07, -1.96e-08)}
            Size={UDim2.fromScale(0.962, 0.07)}
            Key={"marcs1"}
        >
            <uicorner
                Key={"UICorner1"}
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
                Key={"menu1"}
                ZIndex={0}
            >
                <uicorner
                    Key={"UICorner1"}
                    CornerRadius={new UDim(0.2, 0)}
                />
            </imagelabel>

            <frame
                AnchorPoint={new Vector2(0, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.051, 0.5)}
                Size={UDim2.fromScale(0.5, 0.343)}
                Key={"data1"}
            >
                <uilistlayout
                    Key={"UIListLayout1"}
                    Padding={new UDim(0.03, 0)}
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
                    Text={"Treasury Marcs"}
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
                    Position={UDim2.fromScale(0.0512, 0.321)}
                    Size={UDim2.fromScale(0, 1)}
                    ZIndex={2}
                    Key={"name1"}
                />

                <textbutton
                    FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                    RichText={true}
                    Text={"$" + Number.AddCommasToNumber(props.Marcs)}
                    TextColor3={Color3.fromRGB(89, 124, 80)}
                    TextSize={ScaleTextToBounds(14)}
                    AnchorPoint={new Vector2(1, 0.5)}
                    AutomaticSize={Enum.AutomaticSize.X}
                    BackgroundColor3={Color3.fromRGB(0, 0, 0)}
                    BackgroundTransparency={0.95}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    LayoutOrder={1}
                    Position={UDim2.fromScale(0.877, 0.477)}
                    Size={UDim2.fromScale(0.0398, 1)}
                    ZIndex={6}
                    Key={"price1"}
                >
                    <uipadding
                        Key={"UIPadding1"}
                        PaddingBottom={new UDim(0.2, 0)}
                        PaddingLeft={new UDim(0, 10)}
                        PaddingRight={new UDim(0, 10)}
                        PaddingTop={new UDim(0.2, 0)}
                    />

                    <uistroke
                        Key={"UIStroke1"}
                        ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
                        Color={Color3.fromRGB(143, 198, 128)}
                        Transparency={0.76}
                    />

                    <uicorner Key={"UICorner"} />
                </textbutton>
            </frame>

            <textbutton
                FontFace={new Font(
                    "rbxasset://fonts/families/SourceSansPro.json",
                    Enum.FontWeight.Bold,
                    Enum.FontStyle.Normal
                )}
                Text={"WITHDRAW"}
                TextColor3={Color3.fromRGB(202, 202, 202)}
                TextScaled={true}
                TextSize={14}
                TextTransparency={0.41}
                TextWrapped={true}
                BackgroundColor3={Color3.fromRGB(44, 61, 40)}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.863, 0.273)}
                Size={UDim2.fromScale(0.0839, 0.453)}
                Key={"withdraw1"}
                Event={{
                    MouseButton1Click: props.OnWithdrawClicked
                }}
            >
                <uipadding
                    Key={"UIPadding1"}
                    PaddingBottom={new UDim(0.2, 0)}
                    PaddingTop={new UDim(0.2, 0)}
                />

                <uistroke
                    Key={"UIStroke1"}
                    ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
                    Color={Color3.fromRGB(140, 193, 125)}
                    Transparency={1}
                />

                <uicorner Key={"UICorner"} />
            </textbutton>

            <textbutton
                FontFace={new Font(
                    "rbxasset://fonts/families/SourceSansPro.json",
                    Enum.FontWeight.Bold,
                    Enum.FontStyle.Normal
                )}
                Text={"DEPOSIT"}
                TextColor3={Color3.fromRGB(202, 202, 202)}
                TextScaled={true}
                TextSize={14}
                TextTransparency={0.41}
                TextWrapped={true}
                BackgroundColor3={Color3.fromRGB(44, 61, 40)}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.773, 0.273)}
                Size={UDim2.fromScale(0.0839, 0.453)}
                Key={"delete1"}
                Event={{
                    MouseButton1Click: props.OnDepositClicked
                }}
            >
                <uipadding
                    Key={"UIPadding1"}
                    PaddingBottom={new UDim(0.2, 0)}
                    PaddingTop={new UDim(0.2, 0)}
                />

                <uistroke
                    Key={"UIStroke1"}
                    ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
                    Color={Color3.fromRGB(140, 193, 125)}
                    Transparency={1}
                />

                <uicorner Key={"UICorner"} />
            </textbutton>
        </frame>
    )
}

markPureComponent(TreasuryMarcsComponent);