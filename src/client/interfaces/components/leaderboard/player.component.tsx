import Roact from "@rbxts/roact";
import { markPureComponent } from "@rbxts/roact-hooked";
import { Teams } from "shared/types/Teams";

export default function LeaderboardPlayerComponent(props: {username : string, team : Teams, index: number}) : Roact.Element {
    return <frame
        Key={"frame7"}
        BackgroundColor3={Color3.fromRGB(20, 22, 26)}
        BackgroundTransparency={0.25}
        BorderColor3={Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        Position={UDim2.fromScale(0, 0.127)}
        Size={UDim2.fromScale(1, 0.099)}
        LayoutOrder={(props.team * 250) + props.index}
    >
        <textlabel
            Key={"textLabel2"}
            FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
            Text={props.username}
            TextColor3={Color3.fromRGB(255, 255, 255)}
            TextScaled={true}
            TextSize={14}
            TextTransparency={0.03}
            TextWrapped={true}
            TextXAlignment={Enum.TextXAlignment.Left}
            AnchorPoint={new Vector2(0.5, 0.5)}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.453, 0.532)}
            Size={UDim2.fromScale(0.886, 0.75)}
        />

        <uipadding
            Key={"uIPadding1"}
            PaddingBottom={new UDim(0, 4)}
            PaddingLeft={new UDim(0, 8)}
            PaddingRight={new UDim(0, 8)}
            PaddingTop={new UDim(0, 4)}
        />

        <textlabel
            Key={"textLabel3"}
            FontFace={new Font(
                "rbxasset://fonts/families/SourceSansPro.json",
                Enum.FontWeight.Regular,
                Enum.FontStyle.Italic
            )}
            Text={"Scouting Legion Commander"}
            TextColor3={Color3.fromRGB(255, 255, 255)}
            TextScaled={true}
            TextSize={14}
            TextTransparency={0.64}
            TextWrapped={true}
            TextXAlignment={Enum.TextXAlignment.Right}
            AnchorPoint={new Vector2(0.5, 0.5)}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.699, 0.5)}
            Size={UDim2.fromScale(0.601, 0.8)}
        />
    </frame>
}

markPureComponent(LeaderboardPlayerComponent);