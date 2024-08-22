import Roact from "@rbxts/roact";
import { markPureComponent } from "@rbxts/roact-hooked";
import { Treasury } from "shared/types/Treasury";

export default function TreasuryContentComponent(props: { MaxWeight: number, Weight: number, Items: Treasury.Item[] }): Roact.Element {
    return (
        <frame
            BackgroundColor3={Color3.fromRGB(41, 42, 48)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            LayoutOrder={3}
            Position={UDim2.fromScale(0.0188, 0.336)}
            Size={UDim2.fromScale(0.962, 0.66)}
            Key={"content1"}
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
                Position={UDim2.fromScale(0.499, 0.498)}
                Size={UDim2.fromScale(1, 0.998)}
                Key={"menu1"}
            >
                <uicorner
                    Key={"UICorner1"}
                    CornerRadius={new UDim(0, 10)}
                />
            </imagelabel>

            <frame
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.499, 0.432)}
                Size={UDim2.fromScale(1, 0.864)}
                Key={"content1"}
            >
                <frame
                    BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                    BackgroundTransparency={1}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    LayoutOrder={-1}
                    Position={UDim2.fromScale(0.0518, -4.87e-07)}
                    Size={UDim2.fromScale(0.896, 0.145)}
                    Key={"progbar1"}
                >
                    <frame
                        AnchorPoint={new Vector2(0.5, 0)}
                        BackgroundColor3={Color3.fromRGB(47, 47, 54)}
                        BorderColor3={Color3.fromRGB(0, 0, 0)}
                        BorderSizePixel={0}
                        Position={UDim2.fromScale(0.5, 0.691)}
                        Size={UDim2.fromScale(1, 0.05)}
                        Key={"bar1"}
                    >
                        <uicorner
                            Key={"UICorner1"}
                            CornerRadius={new UDim(1, 0)}
                        />

                        <frame
                            AnchorPoint={new Vector2(0, 0.5)}
                            BackgroundColor3={Color3.fromRGB(147, 174, 255)}
                            BorderColor3={Color3.fromRGB(0, 0, 0)}
                            BorderSizePixel={0}
                            Position={UDim2.fromScale(0, 0.5)}
                            Size={UDim2.fromScale(props.Weight / props.MaxWeight, 1)}
                            Key={"fill1"}
                        >
                            <uicorner
                                Key={"UICorner1"}
                                CornerRadius={new UDim(1, 0)}
                            />
                        </frame>
                    </frame>

                    <textlabel
                        FontFace={new Font(
                            "rbxasset://fonts/families/SourceSansPro.json",
                            Enum.FontWeight.Bold,
                            Enum.FontStyle.Normal
                        )}
                        Text={"Treasury Content"}
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
                        Position={UDim2.fromScale(-0.000236, -0.0814)}
                        Size={UDim2.fromScale(0.529, 0.31)}
                        ZIndex={3}
                        Key={"header1"}
                    />

                    <textlabel
                        FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                        Text={"You must be within the vacinity of your treasury location in order to access it's content."}
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
                        Position={UDim2.fromScale(-0.000236, 0.492)}
                        Size={UDim2.fromScale(0.742, -0.258)}
                        ZIndex={3}
                        Key={"description1"}
                    />

                    <textlabel
                        FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                        Text={"Total Weight " + props.Weight + " / " + props.MaxWeight}
                        TextColor3={Color3.fromRGB(255, 255, 255)}
                        TextScaled={true}
                        TextSize={14}
                        TextTransparency={0.49}
                        TextWrapped={true}
                        TextXAlignment={Enum.TextXAlignment.Right}
                        TextYAlignment={Enum.TextYAlignment.Bottom}
                        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                        BackgroundTransparency={1}
                        BorderColor3={Color3.fromRGB(0, 0, 0)}
                        BorderSizePixel={0}
                        Position={UDim2.fromScale(0.0916, 0.492)}
                        Size={UDim2.fromScale(0.9, -0.258)}
                        ZIndex={3}
                        Key={"description2"}
                    />
                </frame>

                <uilistlayout
                    Key={"UIListLayout1"}
                    Padding={new UDim(0.01, 0)}
                    HorizontalAlignment={Enum.HorizontalAlignment.Center}
                    SortOrder={Enum.SortOrder.LayoutOrder}
                />

                <uipadding
                    Key={"UIPadding1"}
                    PaddingTop={new UDim(0.05, 0)}
                />

                <imagelabel
                    Image={"rbxassetid://16255699706"}
                    ImageColor3={Color3.fromRGB(149, 197, 255)}
                    ImageTransparency={0.99}
                    ScaleType={Enum.ScaleType.Crop}
                    AnchorPoint={new Vector2(0.5, 0.5)}
                    BackgroundColor3={Color3.fromRGB(28, 30, 35)}
                    BackgroundTransparency={0.5}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.499, 0.573)}
                    Size={UDim2.fromScale(0.896, 0.86)}
                    Key={"menu1"}
                >
                    <uicorner
                        Key={"UICorner1"}
                        CornerRadius={new UDim(0, 10)}
                    />

                    <uistroke
                        Key={"UIStroke1"}
                        Color={Color3.fromRGB(59, 61, 72)}
                    />

                    <scrollingframe
                        Key={"ScrollingFrame1"}
                        AutomaticCanvasSize={Enum.AutomaticSize.Y}
                        CanvasSize={new UDim2}
                        ScrollBarImageColor3={Color3.fromRGB(0, 0, 0)}
                        ScrollBarImageTransparency={0.61}
                        ScrollBarThickness={3}
                        Active={true}
                        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                        BackgroundTransparency={1}
                        BorderColor3={Color3.fromRGB(0, 0, 0)}
                        BorderSizePixel={0}
                        Size={UDim2.fromScale(1, 1)}
                    >
                        <uipadding
                            Key={"UIPadding1"}
                            PaddingBottom={new UDim(0, 10)}
                            PaddingLeft={new UDim(0, 10)}
                            PaddingRight={new UDim(0, 10)}
                            PaddingTop={new UDim(0, 10)}
                        />

                        {props.Items.map((item, index) => {
                            return <></> 
                        })}

                        <uilistlayout
                            Key={"UIListLayout1"}
                            Padding={new UDim(0.01, 0)}
                            SortOrder={Enum.SortOrder.LayoutOrder}
                        />
                    </scrollingframe>

                    <uipadding
                        Key={"UIPadding1"}
                        PaddingBottom={new UDim(0, 10)}
                        PaddingLeft={new UDim(0, 10)}
                        PaddingRight={new UDim(0, 10)}
                        PaddingTop={new UDim(0, 10)}
                    />

                    <uiaspectratioconstraint
                        Key={"UIAspectRatioConstraint1"}
                        AspectRatio={2.45}
                    />
                </imagelabel>
            </frame>
        </frame>
    )
}

markPureComponent(TreasuryContentComponent);