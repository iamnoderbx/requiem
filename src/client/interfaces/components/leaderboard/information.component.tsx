import Roact from "@rbxts/roact";
import { markPureComponent } from "@rbxts/roact-hooked";

export function LeaderboardInformationComponent(props : {icon : string, username: string, health : number, maxhealth : number}) : Roact.Element {
    return <frame
        Key={"frame1"}
        BackgroundColor3={Color3.fromRGB(29, 31, 37)}
        BackgroundTransparency={0.25}
        BorderColor3={Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        Position={UDim2.fromScale(-0.0146, -0.00598)}
        Size={UDim2.fromScale(1.01, 0.148)}
    >
        <uicorner
            Key={"uICorner"}
            CornerRadius={new UDim(0, 5)}
        />

        <frame
            Key={"frame2"}
            AnchorPoint={new Vector2(1, 0.5)}
            BackgroundColor3={Color3.fromRGB(29, 31, 37)}
            BackgroundTransparency={0.25}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(-0.022, 0.5)}
            Size={UDim2.fromScale(0.176, 0.993)}
        >
        <uiaspectratioconstraint/>
        <uicorner
            Key={"uICorner1"}
            CornerRadius={new UDim(0, 5)}
        />

        <imagelabel
            Key={"imageLabel"}
            Image={props.icon} // "rbxassetid://5346876856"
            AnchorPoint={new Vector2(0.5, 0.5)}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.5, 0.5)}
            Size={UDim2.fromScale(0.8, 0.8)}
        />
        </frame>

        <uipadding
            Key={"uIPadding"}
            PaddingLeft={new UDim(0, 2)}
            />

            <frame
            Key={"container"}
            AnchorPoint={new Vector2(0.5, 0)}
            BackgroundColor3={Color3.fromRGB(37, 39, 47)}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.485, 0.681)}
            Size={UDim2.fromScale(0.894, 0.0718)}
        >
        <uicorner
            Key={"uICorner2"}
            CornerRadius={new UDim(1, 0)}
        />

        <frame
            Key={"container1"}
            AnchorPoint={new Vector2(0, 0.5)}
            BackgroundColor3={Color3.fromRGB(151, 255, 135)}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0, 0.574)}
            Size={UDim2.fromScale(props.health / props.maxhealth, 0.947)}
        >
            <uicorner
                Key={"uICorner3"}
                CornerRadius={new UDim(1, 0)}
            />
        </frame>

        <uiaspectratioconstraint
            Key={"uIAspectRatioConstraint2"}
            AspectRatio={71.1}
        />
        </frame>

        <textlabel
            Key={"textLabel"}
            FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
            Text={props.username}
            TextColor3={Color3.fromRGB(255, 255, 255)}
            TextScaled={true}
            TextSize={14}
            TextWrapped={true}
            TextXAlignment={Enum.TextXAlignment.Left}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.0427, 0.2)}
            Size={UDim2.fromScale(0.84, 0.373)}
        />
    </frame>
}

markPureComponent(LeaderboardInformationComponent);