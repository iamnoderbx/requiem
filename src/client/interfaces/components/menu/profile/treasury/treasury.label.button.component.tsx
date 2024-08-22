import Roact from "@rbxts/roact";
import { markPureComponent } from "@rbxts/roact-hooked";

export default function TreasuryLabelButtonComponent(props: {Header : string, Body : string, Clicked: () => void, Visible: boolean}): Roact.Element {
    return (
        <frame
            BackgroundColor3={Color3.fromRGB(41, 42, 48)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            LayoutOrder={2}
            Position={UDim2.fromScale(-5.9e-08, 0.0764)}
            Size={UDim2.fromScale(0.962, 0.0546)}
            Key={"audits1"}
        >
            <uicorner
                Key={"UICorner1"}
                CornerRadius={new UDim(0.2, 0)}
            />

            <textbutton
                Size={UDim2.fromScale(1, 1)}
                BackgroundTransparency={1}
                BorderSizePixel={0}
                TextTransparency={1}
                Text={""}
                Event={{
                    MouseButton1Click: props.Clicked
                }}
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
            >
                <uicorner
                    Key={"UICorner1"}
                    CornerRadius={new UDim(0.2, 0)}
                />
            </imagelabel>

            <imagelabel
                Key={"ImageLabel1"}
                Image={"rbxassetid://11422142913"}
                ImageTransparency={0.24}
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.941, 0.482)}
                Size={UDim2.fromScale(0.0171, 0.306)}
                ZIndex={2}
            >
                <uiaspectratioconstraint
                    Key={"UIAspectRatioConstraint1"}
                    AspectRatio={1.02}
                />
            </imagelabel>

            <textlabel
                Key={"TextLabel1"}
                FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                Text={props.Header}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextScaled={true}
                TextSize={14}
                TextTransparency={0.54}
                TextWrapped={true}
                TextXAlignment={Enum.TextXAlignment.Left}
                TextYAlignment={Enum.TextYAlignment.Bottom}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.0512, 0.281)}
                Size={UDim2.fromScale(0.291, 0.424)}
                ZIndex={2}
            />

            <textlabel
                Key={"TextLabel2"}
                FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                Text={props.Body}
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
                Position={UDim2.fromScale(0.301, 0.321)}
                Size={UDim2.fromScale(0.625, 0.343)}
                ZIndex={2}
            />
        </frame>
    )
}

markPureComponent(TreasuryLabelButtonComponent);