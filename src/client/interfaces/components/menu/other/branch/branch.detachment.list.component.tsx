import Roact from "@rbxts/roact";
import { DetachmentData } from "selectors/BranchMemberSelector";

export default function BranchDetachmentListComponent(props: {Detachment: DetachmentData, Deleted: () => void}): Roact.Element {
    return (
        <frame
            BackgroundColor3={Color3.fromRGB(41, 42, 48)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(2.07e-07, -1.96e-08)}
            Size={UDim2.fromScale(1, 0.07)}
            Key={"detachment1"}
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
                ZIndex={0}
                Key={"menu1"}
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
                Position={UDim2.fromScale(0.0621, 0.5)}
                Size={UDim2.fromScale(0.489, 0.343)}
                Key={"content1"}
            >
                <textlabel
                    FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                    RichText={true}
                    Text={props.Detachment.abbreviation}
                    TextColor3={Color3.fromRGB(255, 255, 255)}
                    TextScaled={true}
                    TextSize={14}
                    TextTransparency={0.71}
                    TextWrapped={true}
                    TextXAlignment={Enum.TextXAlignment.Left}
                    TextYAlignment={Enum.TextYAlignment.Bottom}
                    AutomaticSize={Enum.AutomaticSize.X}
                    BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                    BackgroundTransparency={1}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    LayoutOrder={1}
                    Position={UDim2.fromScale(0.0924, 0.0714)}
                    Size={UDim2.fromScale(0.0723, 0.857)}
                    ZIndex={2}
                    Key={"age1"}
                />

                <uilistlayout
                    Key={"UIListLayout1"}
                    ItemLineAlignment={Enum.ItemLineAlignment.Center}
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
                    Text={props.Detachment.detachment_name}
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
                    Text={tostring(props.Detachment.players) + " Personnel"}
                    TextColor3={Color3.fromRGB(191, 191, 191)}
                    TextSize={14}
                    TextTransparency={0.38}
                    AnchorPoint={new Vector2(1, 0.5)}
                    AutomaticSize={Enum.AutomaticSize.X}
                    BackgroundColor3={Color3.fromRGB(0, 0, 0)}
                    BackgroundTransparency={0.95}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    LayoutOrder={-1}
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
                        Color={Color3.fromRGB(198, 198, 198)}
                        Transparency={0.76}
                    />

                    <uicorner Key={"UICorner"} />
                </textbutton>
            </frame>

            <frame
                Key={"Frame1"}
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={new Color3(props.Detachment.r, props.Detachment.g, props.Detachment.b)}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.0345, 0.5)}
                Size={UDim2.fromOffset(14, 14)}
            >
                <uicorner
                    Key={"UICorner1"}
                    CornerRadius={new UDim(1, 0)}
                />
            </frame>

            <textbutton
                FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                Text={"Remove"}
                TextColor3={Color3.fromRGB(255, 85, 85)}
                TextScaled={true}
                TextSize={14}
                TextTransparency={0.41}
                TextWrapped={true}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.901, 0.245)}
                Size={UDim2.fromScale(0.08, 0.508)}
                Key={"delete1"}
                Event={{
                    MouseButton1Click: props.Deleted
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
                    Color={Color3.fromRGB(255, 85, 85)}
                    Transparency={0.76}
                />

                <uicorner Key={"UICorner"} />

                <uiaspectratioconstraint
                    Key={"UIAspectRatioConstraint1"}
                    AspectRatio={3.23}
                />
            </textbutton>
        </frame>
    )
}