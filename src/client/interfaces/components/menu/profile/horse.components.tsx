import Roact from "@rbxts/roact";
import { markPureComponent } from "@rbxts/roact-hooked";
import { Animals } from "shared/Animals";
import { Number } from "shared/utilities/number.utilities";

export default function HorseListComponent(props: { horse: Animals.Horse, Clicked: () => void }): Roact.Element {
    const tag = Number.GetLeadingTimestamp(props.horse.created)
    
    return (
        <frame
            BackgroundColor3={Color3.fromRGB(41, 42, 48)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(2.07e-07, -1.96e-08)}
            Size={UDim2.fromScale(0.962, 0.07)}
            Key={"horse"}
        >
            <uicorner
                Key={"UICorner"}
                CornerRadius={new UDim(0.2, 0)}
            />

            <textbutton
                Text={""}
                TextTransparency={1}
                BackgroundTransparency={1}
                Size={UDim2.fromScale(1, 1)}
                Event={{MouseButton1Down: props.Clicked}}
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
                    CornerRadius={new UDim(0.2, 0)}
                />
            </imagelabel>

            <imagelabel
                Key={"ImageLabel"}
                Image={"rbxassetid://11422142913"}
                ImageTransparency={0.24}
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.971, 0.482)}
                Size={UDim2.fromScale(0.0171, 0.306)}
                ZIndex={2}
            >
                <uiaspectratioconstraint
                    Key={"UIAspectRatioConstraint"}
                    AspectRatio={1.02}
                />
            </imagelabel>

            <imagelabel
                Image={"rbxassetid://11419717444"}
                ImageColor3={Animals.GenderColors[props.horse.gender]}
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
                Key={"TextLabel"}
                FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                Text={props.horse.gender === Animals.Gender.Male ? "Male Horse" : "Female Horse"}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextScaled={true}
                TextSize={14}
                TextTransparency={0.67}
                TextWrapped={true}
                TextXAlignment={Enum.TextXAlignment.Right}
                TextYAlignment={Enum.TextYAlignment.Bottom}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.95, 0.5)}
                Size={UDim2.fromScale(0.2, 0.343)}
                AnchorPoint={new Vector2(1, 0.5)}
                ZIndex={2}
            />

            <frame
                AnchorPoint={new Vector2(0, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.051, 0.5)}
                Size={UDim2.fromScale(0.5, 0.343)}
                Key={"content"}
            >
                <textlabel
                    FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                    RichText={true}
                    Text={tag + " of age."}
                    TextColor3={Color3.fromRGB(255, 255, 255)}
                    TextScaled={true}
                    TextSize={14}
                    TextTransparency={0.71}
                    TextWrapped={true}
                    TextXAlignment={Enum.TextXAlignment.Left}
                    TextYAlignment={Enum.TextYAlignment.Center}
                    AutomaticSize={Enum.AutomaticSize.X}
                    BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                    BackgroundTransparency={1}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    LayoutOrder={1}
                    Position={UDim2.fromScale(0.0924, 0.0714)}
                    Size={UDim2.fromScale(0.0723, 0.857)}
                    ZIndex={2}
                    Key={"age"}
                />

                <uilistlayout
                    Key={"UIListLayout"}
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
                    Text={props.horse.name}
                    TextColor3={Color3.fromRGB(255, 255, 255)}
                    TextScaled={true}
                    TextSize={14}
                    TextTransparency={0.24}
                    TextWrapped={true}
                    TextXAlignment={Enum.TextXAlignment.Left}
                    TextYAlignment={Enum.TextYAlignment.Center}
                    AutomaticSize={Enum.AutomaticSize.X}
                    BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                    BackgroundTransparency={1}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.0512, 0.321)}
                    Size={UDim2.fromScale(0, 1)}
                    ZIndex={2}
                    Key={"name"}
                />
            </frame>
        </frame>
    )
}

markPureComponent(HorseListComponent)