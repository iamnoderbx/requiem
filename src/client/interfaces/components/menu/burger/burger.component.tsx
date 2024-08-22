import Roact from "@rbxts/roact";
import { markPureComponent } from "@rbxts/roact-hooked";
 
export default function MenuBurgerComponent() : Roact.Element {
    return <frame
        Key={"buttons"}
        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
        BackgroundTransparency={1}
        BorderColor3={Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        Position={UDim2.fromScale(0.0266, 0.164)}
        Size={UDim2.fromScale(0.0577, 0.103)}
        ZIndex={2}
    >
        <imagebutton
            Key={"menu1"}
            AutoButtonColor={false}
            AnchorPoint={new Vector2(0.5, 0.5)}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={0.95}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.5, 0.5)}
            Size={UDim2.fromScale(1, 1)}
        >
            <uicorner
                Key={"corner"}
                CornerRadius={new UDim(1, 0)}
            />

            <imagelabel
                Key={"icon"}
                Image={"rbxassetid://11295285432"}
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.5, 0.5)}
                Size={UDim2.fromScale(0.45, 0.45)}
            >
                <uiscale />
                <uiaspectratioconstraint />
            </imagelabel>

            <uigradient
                Key={"gradient"}
                Enabled={false}
                Transparency={new NumberSequence([
                    new NumberSequenceKeypoint(0, 0),
                    new NumberSequenceKeypoint(1, 0.331),
                ])}
            />
        </imagebutton>

        <uiaspectratioconstraint />
    </frame>
}

markPureComponent(MenuBurgerComponent);