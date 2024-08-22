import Roact from "@rbxts/roact";
import { markPureComponent, withHooks } from "@rbxts/roact-hooked";

function NourishmentRawComponent(props: {clicked?: () => void}): Roact.Element {
    return <frame
        Key={"frame6"}
        BackgroundColor3={Color3.fromRGB(29, 31, 37)}
        BorderColor3={Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        Position={UDim2.fromScale(0, 0.646)}
        Size={UDim2.fromScale(1, 0.467)}
        ZIndex={16}
    >
        <textlabel
            Key={"textLabel15"}
            FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
            Text={"Nourishment"}
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
            Position={UDim2.fromScale(0.0362, 0.359)}
            Size={UDim2.fromScale(0.907, 0.276)}
            ZIndex={16}
        />

        <frame
            Key={"container4"}
            AnchorPoint={new Vector2(0.5, 0)}
            BackgroundColor3={Color3.fromRGB(64, 67, 81)}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.451, 0.73)}
            Size={UDim2.fromScale(0.824, 0.0649)}
        >
            <uicorner
                Key={"uICorner11"}
                CornerRadius={new UDim(1, 0)}
            />

            <frame
                Key={"container5"}
                AnchorPoint={new Vector2(0, 0.5)}
                BackgroundColor3={Color3.fromRGB(181, 193, 231)}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0, 0.574)}
                Size={UDim2.fromScale(0.764, 0.947)}
            >
                <uicorner
                    Key={"uICorner12"}
                    CornerRadius={new UDim(1, 0)}
                />
            </frame>
        </frame>

        <uigradient
            Key={"uIGradient4"}
            Rotation={270}
            Transparency={new NumberSequence([
                new NumberSequenceKeypoint(0, 0),
                new NumberSequenceKeypoint(0.799, 0),
                new NumberSequenceKeypoint(0.8, 1),
                new NumberSequenceKeypoint(1, 1),
            ])}
        />

        <uicorner
            Key={"uICorner13"}
            CornerRadius={new UDim(0, 10)}
        />

        <imagebutton
            Key={"imageButton2"}
            Image={"rbxassetid://11432860885"}
            ImageTransparency={0.12}
            AnchorPoint={new Vector2(1, 0)}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.954, 0.486)}
            Size={UDim2.fromScale(0.057, 0.311)}
            ZIndex={5}
            Event={{MouseButton1Down: props.clicked}}
        />

        <uistroke
            Key={"uIStroke2"}
            Color={Color3.fromRGB(39, 45, 54)}
        >
            <uigradient
                Key={"uIGradient5"}
                Rotation={270}
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

markPureComponent(NourishmentRawComponent);
export const NourishmentMenuComponent = (NourishmentRawComponent)