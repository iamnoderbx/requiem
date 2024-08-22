import Roact from "@rbxts/roact";
import { markPureComponent } from "@rbxts/roact-hooked";
import { Players } from "@rbxts/services";
import { ScaleTextToBounds } from "client/interfaces/components/utilities/textscaler.effect";

function BranchHeaderComponent(props: { Name: string, Icon: string, Commander: string, Personnel: number }): Roact.Element {
    return (
        <frame
            BackgroundColor3={Color3.fromRGB(41, 42, 48)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            ClipsDescendants={true}
            Position={UDim2.fromScale(0.0184, 0)}
            Size={UDim2.fromScale(0.962, 0.164)}
            ZIndex={5}
            Key={"header1"}
        >
            <uicorner Key={"UICorner"} />

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

            <frame
                AnchorPoint={new Vector2(0, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.139, 0.598)}
                Size={UDim2.fromScale(0.437, 0.158)}
                Key={"data1"}
            >
                <uilistlayout
                    Key={"UIListLayout1"}
                    ItemLineAlignment={Enum.ItemLineAlignment.Center}
                    Padding={new UDim(0.03, 0)}
                    FillDirection={Enum.FillDirection.Horizontal}
                    SortOrder={Enum.SortOrder.LayoutOrder}
                    VerticalAlignment={Enum.VerticalAlignment.Center}
                />

                <textbutton
                    FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                    RichText={true}
                    Text={tostring(props.Personnel) + " Personnel"}
                    TextColor3={Color3.fromRGB(124, 124, 124)}
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
                        Color={Color3.fromRGB(223, 223, 223)}
                        Transparency={0.76}
                    />

                    <uicorner Key={"UICorner"} />
                </textbutton>

                <textbutton
                    FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                    RichText={true}
                    Text={props.Commander}
                    TextColor3={Color3.fromRGB(124, 124, 124)}
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
                    Key={"price2"}
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
                        Color={Color3.fromRGB(223, 223, 223)}
                        Transparency={0.76}
                    />

                    <uicorner Key={"UICorner"} />
                </textbutton>
            </frame>

            <textlabel
                FontFace={new Font(
                    "rbxasset://fonts/families/SourceSansPro.json",
                    Enum.FontWeight.Bold,
                    Enum.FontStyle.Normal
                )}
                RichText={true}
                Text={props.Name}
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
                Position={UDim2.fromScale(0.139, 0.295)}
                Size={UDim2.fromScale(0.635, 0.164)}
                ZIndex={2}
                Key={"name1"}
            />
    
            <imagelabel
                Key={"ImageLabel1"}
                Image={props.Icon}
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.0784, 0.493)}
                Size={UDim2.fromScale(0.1, 0.88)}
            >
                <uicorner Key={"UICorner"} />
                <uiaspectratioconstraint
                    Key={"UIAspectRatioConstraint1"}
                    AspectRatio={1}
                />
            </imagelabel>

            <imagelabel
                Key={"ImageLabel2"}
                Image={props.Icon}
                ImageTransparency={0.75}
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.818, 1.83)}
                Size={UDim2.fromScale(0.498, 4.37)}
            >
                <uiaspectratioconstraint
                    Key={"UIAspectRatioConstraint1"}
                    AspectRatio={1}
                />
                <uicorner Key={"UICorner"} />

                <uigradient
                    Key={"UIGradient1"}
                    Rotation={90}
                    Transparency={new NumberSequence([
                        new NumberSequenceKeypoint(0, 0),
                        new NumberSequenceKeypoint(0.42, 1),
                        new NumberSequenceKeypoint(1, 1),
                    ])}
                />
            </imagelabel>
        </frame>
    )
}

markPureComponent(BranchHeaderComponent);
export default BranchHeaderComponent;