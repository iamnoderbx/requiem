import Roact from "@rbxts/roact";
import { markPureComponent } from "@rbxts/roact-hooked";
import { TeamUtilities, Teams } from "shared/types/Teams";

export default function LeaderboardTeamComponent(props : {team : Teams, visible : boolean}) : Roact.Element {
    const displayName = TeamUtilities.getTeamName(props.team);
    const [color1, color2] = TeamUtilities.getTeamColor(props.team);

    const icon = TeamUtilities.getTeamIcon(props.team);

    return <frame
        Key={"frame3"}
        AnchorPoint={new Vector2(1, 0)}
        BackgroundColor3={Color3.fromRGB(37, 29, 29)}
        BackgroundTransparency={1}
        BorderColor3={Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        ClipsDescendants={true}
        Position={UDim2.fromScale(0.998, 0)}
        Size={UDim2.fromScale(1, 0.11)}
        LayoutOrder={(props.team * 250) - 1}
        Visible={props.visible}
    >
        <uicorner
            Key={"uICorner4"}
            CornerRadius={new UDim(0, 5)}
        />

        <frame
            Key={"frame4"}
            AnchorPoint={new Vector2(1, 0)}
            BackgroundColor3={color1}
            BackgroundTransparency={0.15}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(1, -1.16e-07)}
            Size={UDim2.fromScale(1, 2.02)}
        >
            <uicorner
                Key={"uICorner5"}
                CornerRadius={new UDim(0, 5)}
            />
        </frame>

        <frame
            Key={"frame5"}
            BackgroundColor3={color2}
            BackgroundTransparency={0.8}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Size={UDim2.fromScale(1, 1)}
            ZIndex={3}
        >
            <uigradient
                Key={"uIGradient"}
                Rotation={90}
                Transparency={new NumberSequence([
                    new NumberSequenceKeypoint(0, 1),
                    new NumberSequenceKeypoint(1, 0),
                ])}
            />
        </frame>

        <frame
            Key={"frame6"}
            AnchorPoint={new Vector2(0.5, 0.5)}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.5, 0.5)}
            Size={UDim2.fromScale(1, 1)}
            ZIndex={3}
        >
            <textlabel
                Key={"textLabel1"}
                FontFace={new Font(
                    "rbxasset://fonts/families/SourceSansPro.json",
                    Enum.FontWeight.Bold,
                    Enum.FontStyle.Normal
                )}
                Text={displayName}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextScaled={true}
                TextSize={14}
                TextTransparency={0.24}
                TextWrapped={true}
                TextXAlignment={Enum.TextXAlignment.Left}
                AnchorPoint={new Vector2(0, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.148, 0.5)}
                Size={UDim2.fromScale(0.685, 0.543)}
            />

            <imagelabel
                Key={"imageLabel1"}
                Image={icon}
                ImageTransparency={0.75}
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.898, 0.492)}
                Size={UDim2.fromScale(0.309, 2.53)}
            >
                <uiaspectratioconstraint
                    Key={"uIAspectRatioConstraint4"}
                    AspectRatio={1.03}
                />

                <uigradient
                    Key={"uIGradient1"}
                    Rotation={-180}
                    Transparency={new NumberSequence([
                        new NumberSequenceKeypoint(0, 0),
                        new NumberSequenceKeypoint(0.834, 1),
                        new NumberSequenceKeypoint(1, 1),
                    ])}
                />
            </imagelabel>

            <imagelabel
                Key={"imageLabel2"}
                Image={icon}
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.0839, 0.492)}
                Size={UDim2.fromScale(0.101, 0.83)}
                ZIndex={2}
            >
                <uiaspectratioconstraint
                    Key={"uIAspectRatioConstraint5"}
                    AspectRatio={1.03}
                />
            </imagelabel>
        </frame>
    </frame>
}

markPureComponent(LeaderboardTeamComponent);