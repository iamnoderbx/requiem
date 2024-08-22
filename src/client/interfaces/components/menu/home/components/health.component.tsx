import Roact from "@rbxts/roact";
import { markPureComponent, withHooks } from "@rbxts/roact-hooked";

function HealthComponentRaw(props: {clicked?: () => void}) : Roact.Element {
    return <frame
        Key={"frame4"}
        BackgroundColor3={Color3.fromRGB(29, 31, 37)}
        BorderColor3={Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        Position={UDim2.fromScale(0, 0.309)}
        Size={UDim2.fromScale(1, 0.37)}
        ZIndex={16}
    >
        <textlabel
            Key={"textLabel12"}
            FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
            Text={"Health"}
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
            Position={UDim2.fromScale(0.0391, 0.187)}
            Size={UDim2.fromScale(0.907, 0.348)}
            ZIndex={16}
        />

        <imagebutton
            Key={"imageButton"}
            Image={"rbxassetid://11432860885"}
            ImageTransparency={0.12}
            AnchorPoint={new Vector2(1, 0)}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.954, 0.289)}
            Size={UDim2.fromScale(0.0567, 0.403)}
            ZIndex={5}
            Event={{MouseButton1Down: props.clicked}}
        />

        <frame
            Key={"container2"}
            AnchorPoint={new Vector2(0.5, 0)}
            BackgroundColor3={Color3.fromRGB(64, 67, 81)}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.451, 0.622)}
            Size={UDim2.fromScale(0.824, 0.0819)}
        >
            <uicorner
                Key={"uICorner7"}
                CornerRadius={new UDim(1, 0)}
            />

            <frame
                Key={"container3"}
                AnchorPoint={new Vector2(0, 0.5)}
                BackgroundColor3={Color3.fromRGB(181, 193, 231)}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0, 0.574)}
                Size={UDim2.fromScale(0.391, 0.947)}
            >
                <uicorner
                    Key={"uICorner8"}
                    CornerRadius={new UDim(1, 0)}
                />
            </frame>
        </frame>

        <uistroke
            Key={"uIStroke"}
            Color={Color3.fromRGB(39, 45, 54)}
        />
    </frame>
}

markPureComponent(HealthComponentRaw);
export const HealthBarMenuComponent = (HealthComponentRaw);