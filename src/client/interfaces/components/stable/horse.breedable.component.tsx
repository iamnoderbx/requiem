import Roact from "@rbxts/roact";
import { markPureComponent } from "@rbxts/roact-hooked";
import { Animals } from "shared/Animals";

const NUMBER_STRINGS = [
    "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth",
    "tenth", "eleventh", "twelfth", "thirteenth", "fourteenth", "fifteenth", "sixteenth",
]

export function HorseBreedingStallComponent(props: { Index: number, Breedable: boolean, Breeded: (frame: Frame) => void } & Roact.PropsWithChildren): Roact.Element {
    return (
        <frame
            BackgroundColor3={Color3.fromRGB(41, 42, 48)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.0188, 0)}
            Size={UDim2.fromScale(0.962, 0.372)}
            Key={"breeder"}
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


            <frame
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.5, 0.5)}
                Size={UDim2.fromScale(1, 1)}
                Key={"content"}
                ZIndex={3}
            >
                <frame
                    BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                    BackgroundTransparency={1}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    LayoutOrder={-1}
                    Position={UDim2.fromScale(0.0198, 0.0913)}
                    Size={UDim2.fromScale(0.96, 0.139)}
                    Key={"header"}
                >
                    <textlabel
                        FontFace={new Font(
                            "rbxasset://fonts/families/SourceSansPro.json",
                            Enum.FontWeight.Bold,
                            Enum.FontStyle.Normal
                        )}
                        Text={"Stable " + tostring(props.Index + 1)}
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
                        Position={UDim2.fromScale(0, 0.319)}
                        Size={UDim2.fromScale(0.528, -0.464)}
                        ZIndex={3}
                        Key={"header"}
                    />

                    <textlabel
                        FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                        Text={"Please put your desired horses within the " + NUMBER_STRINGS[props.Index] + " stable to breed them."}
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
                        Position={UDim2.fromScale(0, 0.754)}
                        Size={UDim2.fromScale(0.742, -0.406)}
                        ZIndex={3}
                        Key={"description"}
                    />

                    <textbutton
                        FontFace={new Font(
                            "rbxasset://fonts/families/SourceSansPro.json",
                            Enum.FontWeight.Bold,
                            Enum.FontStyle.Normal
                        )}
                        Text={"BREED"}
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
                        Size={UDim2.fromScale(0.0938, 0.6)}
                        Key={"buy"}
                        Visible={props.Breedable}
                        Event={{
                            MouseButton1Down: (textbutton) => {
                                return props.Breeded(textbutton.Parent!.Parent!.Parent! as Frame);
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

                        <uicorner Key={"UICorner"} />
                    </textbutton>

                    <textlabel
                        FontFace={new Font(
                            "rbxasset://fonts/families/SourceSansPro.json",
                            Enum.FontWeight.Bold,
                            Enum.FontStyle.Normal
                        )}
                        RichText={true}
                        Text={"$30"}
                        TextColor3={Color3.fromRGB(89, 124, 80)}
                        TextSize={14}
                        AnchorPoint={new Vector2(1, 0.5)}
                        AutomaticSize={Enum.AutomaticSize.X}
                        BackgroundColor3={Color3.fromRGB(0, 0, 0)}
                        BackgroundTransparency={0.95}
                        BorderColor3={Color3.fromRGB(0, 0, 0)}
                        BorderSizePixel={0}
                        LayoutOrder={-1}
                        Position={UDim2.fromScale(0.877, 0.477)}
                        Size={UDim2.fromScale(0.0398, 0.554)}
                        ZIndex={6}
                        Key={"price"}
                        Visible={props.Breedable}
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
                    </textlabel>
                </frame>

                <uilistlayout
                    Key={"UIListLayout"}
                    Padding={new UDim(0.08, 0)}
                    HorizontalAlignment={Enum.HorizontalAlignment.Center}
                    SortOrder={Enum.SortOrder.LayoutOrder}
                    VerticalAlignment={Enum.VerticalAlignment.Center}
                />

                {props[Roact.Children]}
            </frame>
        </frame>
    )
}

markPureComponent(HorseBreedingStallComponent);

export default function HorseBreedableComponent(props: { Horse?: Animals.Horse, IsMaleExpected?: boolean, IsAdult?: boolean, IsOnCooldown?: boolean}): Roact.Element {
    const isHorseAdult = props.IsAdult ?? false;
    const isHorseOnCooldown = props.IsOnCooldown ?? false;

    return <frame
        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
        BackgroundTransparency={1}
        BorderColor3={Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        Position={UDim2.fromScale(0.0502, 0.379)}
        Size={UDim2.fromScale(0.925, 0.219)}
    >
        <frame
            AnchorPoint={new Vector2(0.5, 0.5)}
            BackgroundColor3={Color3.fromRGB(6, 8, 12)}
            BackgroundTransparency={0.5}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            ClipsDescendants={true}
            Position={UDim2.fromScale(0.5, 0.394)}
            Size={UDim2.fromScale(1.02, 1.2)}
            Visible={props.Horse === undefined}
            ZIndex={5}
            Key={"locked"}
        >
            <uicorner Key={"UICorner"} />

            <textlabel
                Key={"TextLabel"}
                FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                Text={"No " + (props.IsMaleExpected ? "male" : "female") + " horse within the stable."}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextScaled={true}
                TextSize={14}
                TextTransparency={0.47}
                TextWrapped={true}
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.5, 0.45)}
                Size={UDim2.fromScale(0.487, 0.266)}
                ZIndex={3}
            />

            <imagelabel
                Key={"ImageLabel"}
                Image={"rbxassetid://11419717444"}
                ImageColor3={Animals.GenderColors[props.IsMaleExpected ? Animals.Gender.Male : Animals.Gender.Female]}
                ImageTransparency={0.83}
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.5, 1.3)}
                Size={UDim2.fromScale(0.133, 1.89)}
                ZIndex={2}
            >
                <uiaspectratioconstraint
                    Key={"UIAspectRatioConstraint"}
                    AspectRatio={1.02}
                />
            </imagelabel>
        </frame>

        <frame
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Size={UDim2.fromScale(1, 1)}
            Key={"content"}
            Visible={props.Horse !== undefined}
        >
            <textlabel
                FontFace={new Font(
                    "rbxasset://fonts/families/SourceSansPro.json",
                    Enum.FontWeight.Bold,
                    Enum.FontStyle.Normal
                )}
                Text={props.Horse?.name ?? "Unknown"}
                TextColor3={Animals.GenderColors[props.Horse?.gender ?? Animals.Gender.Male]}
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
                Position={UDim2.fromScale(-0.000236, 0.512)}
                Size={UDim2.fromScale(0.529, -0.31)}
                ZIndex={3}
                Key={"header"}
            />

            <textlabel
                FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                Text={
                    isHorseAdult ? 
                        isHorseOnCooldown ? 
                            "This horse is currently on cooldown. Please come back later." : 
                            "This " + ((props.Horse?.gender === Animals.Gender.Female) ? "female" : "male") + " horse is owned by " + (props.Horse?.owner ?? "Unknown") + "." : 
                            
                        "This horse is not yet an adult. Please come back later."
                }
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
                Position={UDim2.fromScale(0.0214, 0.785)}
                Size={UDim2.fromScale(0.965, -0.258)}
                ZIndex={3}
                Key={"description"}
            />

            <imagelabel
                Image={"rbxassetid://11422155687"}
                ImageTransparency={0.36}
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.00651, 0.667)}
                Size={UDim2.fromScale(0.0149, 0.229)}
                ZIndex={2}
                Key={"info"}
            >
                <uiaspectratioconstraint
                    Key={"UIAspectRatioConstraint"}
                    AspectRatio={1.02}
                />
            </imagelabel>
        </frame>
    </frame>
}

markPureComponent(HorseBreedableComponent);