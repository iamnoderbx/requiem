import Roact from "@rbxts/roact";
import { markPureComponent } from "@rbxts/roact-hooked";
import { Animals } from "shared/Animals";

export default function HorsePurchaseListComponent(props: { Visible?: boolean, Purchased: (frame: Frame) => void, Horse: { name: string, price: number, available: boolean, meta: unknown[] } }): Roact.Element {
    const gender = props.Horse.meta[1] as number;
    const isHorseFemale = gender === Animals.Gender.Female ? true : false;

    const horseId = props.Horse.meta[0] as number;
    const horseStats = props.Horse.meta[2] as number[];

    // Add all of the horse's stats together and divide by the number of stats to get the average.
    const average = horseStats.reduce((a, b) => a + b, 0) / horseStats.size();
    let tag = "Poor"

    // Excellent, Great, Good, Fair, Poor
    if (average >= 80) tag = "Excellent"
    else if (average >= 60) tag = "Great"
    else if (average >= 40) tag = "Good"
    else if (average >= 20) tag = "Fair"
    else tag = "Poor"

    let additionalTags = [];

    if (horseStats[0] >= 80) additionalTags.push("Strong Legs");
    if (horseStats[0] < 80 && horseStats[0] >= 60) additionalTags.push("Good Legs");

    if (horseStats[1] >= 80) additionalTags.push("Excellent Reflexes");
    if (horseStats[1] < 80 && horseStats[1] >= 60) additionalTags.push("Great Reflexes");

    if (horseStats[3] >= 80) additionalTags.push("Longlasting Endurance");
    if (horseStats[3] < 80 && horseStats[2] >= 60) additionalTags.push("Great Endurance");

    return (
        <frame
            BackgroundColor3={Color3.fromRGB(41, 42, 48)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(2.07e-07, -1.96e-08)}
            Size={UDim2.fromScale(0.962, 0.07)}
            LayoutOrder={-props.Horse.price}
            Visible={props.Visible}
        >
            <uicorner
                Key={"UICorner"}
                CornerRadius={new UDim(0.2, 0)}
            />

            <frame
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={Color3.fromRGB(6, 8, 12)}
                BackgroundTransparency={0.15}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.5, 0.5)}
                Size={UDim2.fromScale(1, 1)}
                ZIndex={5}
                Key={"locked"}
                Visible={false}
            >
                <uicorner Key={"UICorner"} />
            </frame>

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
                    CornerRadius={new UDim(0.2, 0)}
                />
            </imagelabel>

            <imagelabel
                Image={"rbxassetid://11419717444"}
                ImageColor3={isHorseFemale ? Animals.GenderColors[Animals.Gender.Female] : Animals.GenderColors[Animals.Gender.Male]}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.021, 0.3)}
                Size={UDim2.fromScale(0.022, 0.395)}
                ZIndex={2}
                Key={"gender"}
            >
                <uiaspectratioconstraint
                    Key={"UIAspectRatioConstraint"}
                    AspectRatio={1.02}
                />
            </imagelabel>

            <textlabel
                FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                Text={"Overall Rating " + tag}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextScaled={true}
                TextSize={14}
                TextTransparency={0.67}
                TextWrapped={true}
                TextXAlignment={Enum.TextXAlignment.Right}
                TextYAlignment={Enum.TextYAlignment.Bottom}
                AnchorPoint={new Vector2(0, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.691, 0.5)}
                Size={UDim2.fromScale(0.184, 0.3)}
                ZIndex={2}
                Key={"label"}
            />

            <frame
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.0502, 0.291)}
                Size={UDim2.fromOffset(714, 21)}
                Key={"content"}
            >
                <uilistlayout
                    Key={"UIListLayout"}
                    Padding={new UDim(0, 5)}
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
                    Text={props.Horse.name + " the Horse"}
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
                    Position={UDim2.fromScale(0.077, 0.107)}
                    Size={UDim2.fromScale(0, 0.786)}
                    ZIndex={2}
                    Key={"horse"}
                >
                    <uipadding
                        Key={"UIPadding"}
                        PaddingLeft={new UDim(0, 3)}
                        PaddingRight={new UDim(0, 10)}
                    />
                </textlabel>

                <frame
                    BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                    BackgroundTransparency={1}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.164, -0.0308)}
                    Size={UDim2.fromScale(0.531, 1.06)}
                    Key={"tags"}
                >
                    <uilistlayout
                        Key={"UIListLayout"}
                        Padding={new UDim(0, 5)}
                        FillDirection={Enum.FillDirection.Horizontal}
                        SortOrder={Enum.SortOrder.LayoutOrder}
                        VerticalAlignment={Enum.VerticalAlignment.Center}
                    />

                    {additionalTags.map((tag, index) => {
                        return <textbutton
                            FontFace={new Font(
                                "rbxasset://fonts/families/SourceSansPro.json",
                                Enum.FontWeight.Bold,
                                Enum.FontStyle.Normal
                            )}
                            RichText={true}
                            Text={tag}
                            TextColor3={Color3.fromRGB(255, 255, 255)}
                            TextSize={14}
                            TextTransparency={0.66}
                            AutomaticSize={Enum.AutomaticSize.X}
                            BackgroundColor3={Color3.fromRGB(0, 0, 0)}
                            BackgroundTransparency={1}
                            BorderColor3={Color3.fromRGB(0, 0, 0)}
                            BorderSizePixel={0}
                            Position={UDim2.fromScale(0, 0.0582)}
                            Size={UDim2.fromScale(0, 0.884)}
                            Key={"equip"}
                        >
                            <uipadding
                                Key={"UIPadding"}
                                PaddingBottom={new UDim(0.2, 0)}
                                PaddingLeft={new UDim(0, 10)}
                                PaddingRight={new UDim(0, 10)}
                                PaddingTop={new UDim(0.2, 0)}
                            />

                            <uistroke
                                Key={"UIStroke"}
                                ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
                                Color={Color3.fromRGB(255, 255, 255)}
                                Transparency={0.87}
                            />

                            <uicorner Key={"UICorner"} />
                        </textbutton>
                    })}

                </frame>

                <textbutton
                    FontFace={new Font(
                        "rbxasset://fonts/families/SourceSansPro.json",
                        Enum.FontWeight.Bold,
                        Enum.FontStyle.Normal
                    )}
                    RichText={true}
                    Text={"$" + props.Horse.price}
                    TextColor3={Color3.fromRGB(89, 124, 80)}
                    TextSize={14}
                    AutomaticSize={Enum.AutomaticSize.X}
                    BackgroundColor3={Color3.fromRGB(0, 0, 0)}
                    BackgroundTransparency={0.95}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    LayoutOrder={-1}
                    Position={UDim2.fromScale(0, 0.0141)}
                    Size={UDim2.fromScale(0.077, 0.972)}
                    Key={"equip"}
                >
                    <uipadding
                        Key={"UIPadding"}
                        PaddingBottom={new UDim(0.2, 0)}
                        PaddingLeft={new UDim(0, 10)}
                        PaddingRight={new UDim(0, 10)}
                        PaddingTop={new UDim(0.2, 0)}
                    />

                    <uistroke
                        Key={"UIStroke"}
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
                Text={"PURCHASE"}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextScaled={true}
                TextSize={14}
                TextTransparency={0.41}
                TextWrapped={true}
                AnchorPoint={new Vector2(1, 0.5)}
                BackgroundColor3={Color3.fromRGB(35, 49, 35)}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.98, 0.5)}
                Size={UDim2.fromScale(0.0938, 0.4)}
                Key={"buy"}
                Event={{
                    MouseButton1Click: (frame) => {
                        props.Purchased(frame.Parent! as Frame);
                    }
                }}
            >
                <uipadding
                    Key={"UIPadding"}
                    PaddingBottom={new UDim(0.195, 0)}
                    PaddingTop={new UDim(0.2, 0)}
                />

                <uistroke
                    Key={"UIStroke"}
                    ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
                    Color={Color3.fromRGB(18, 50, 18)}
                    Transparency={0.65}
                />

                <uicorner Key={"UICorner"} CornerRadius={new UDim(0, 5)} />
            </textbutton>
        </frame>
    )
}

markPureComponent(HorsePurchaseListComponent);