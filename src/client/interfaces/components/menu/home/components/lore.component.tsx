import Roact from "@rbxts/roact";
import { markPureComponent, withHooks } from "@rbxts/roact-hooked";

function LoreComponentRaw(props: {clicked?: () => void}) : Roact.Element {
    return <frame
        Key={"frame5"}
        BackgroundColor3={Color3.fromRGB(29, 31, 37)}
        BorderColor3={Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        LayoutOrder={-1}
        Position={UDim2.fromScale(0.0859, 0.336)}
        Size={UDim2.fromScale(1, 0.417)}
        ZIndex={16}
    >
        <uigradient
            Key={"uIGradient2"}
            Rotation={90}
            Transparency={new NumberSequence([
                new NumberSequenceKeypoint(0, 0),
                new NumberSequenceKeypoint(0.799, 0),
                new NumberSequenceKeypoint(0.8, 1),
                new NumberSequenceKeypoint(1, 1),
            ])}
        />

        <uicorner
            Key={"uICorner10"}
            CornerRadius={new UDim(0, 10)}
        />

        <textlabel
            Key={"textLabel13"}
            FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
            Text={"Matt Vitalis"}
            TextColor3={Color3.fromRGB(255, 255, 255)}
            TextScaled={true}
            TextSize={14}
            TextTransparency={0.43}
            TextWrapped={true}
            TextXAlignment={Enum.TextXAlignment.Right}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.0391, 0.239)}
            Size={UDim2.fromScale(0.824, 0.309)}
            ZIndex={16}
        />

        <imagebutton
            Key={"imageButton1"}
            Image={"rbxassetid://11432860885"}
            ImageTransparency={0.12}
            AnchorPoint={new Vector2(1, 0)}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.954, 0.214)}
            Size={UDim2.fromScale(0.0567, 0.351)}
            ZIndex={5}
            Event={{MouseButton1Down: props.clicked}}
        />

        <textlabel
            Key={"textLabel14"}
            FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
            Text={"Lore Name"}
            TextColor3={Color3.fromRGB(255, 255, 255)}
            TextScaled={true}
            TextSize={14}
            TextTransparency={0.12}
            TextWrapped={true}
            TextXAlignment={Enum.TextXAlignment.Left}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.0391, 0.239)}
            Size={UDim2.fromScale(0.522, 0.309)}
            ZIndex={16}
        />

        <uistroke
            Key={"uIStroke1"}
            Color={Color3.fromRGB(39, 45, 54)}
        >
            <uigradient
                Key={"uIGradient3"}
                Rotation={90}
                Transparency={new NumberSequence([
                    new NumberSequenceKeypoint(0, 0),
                    new NumberSequenceKeypoint(0.799, 0),
                    new NumberSequenceKeypoint(0.8, 1),
                    new NumberSequenceKeypoint(1, 1),
                ])}
            />
        </uistroke>
    </frame>
}

markPureComponent(LoreComponentRaw)
export const LoreMenuComponent = (LoreComponentRaw)