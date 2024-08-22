import Roact from "@rbxts/roact";
import { markPureComponent } from "@rbxts/roact-hooked";

export function LeaderboardHolderComponent(props : {Visible: boolean} & Roact.PropsWithChildren) : Roact.Element {
    return <frame
        Key={"leaderboard"}
        AnchorPoint={new Vector2(1, 0)}
        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
        BackgroundTransparency={1}
        BorderColor3={Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        Position={new UDim2(1, -3, 0, 3)}
        Size={UDim2.fromScale(0.196, 0.412)}
        Visible={props.Visible}
        ZIndex={0}
    >
        <uilistlayout
            Key={"uIListLayout"}
            Padding={new UDim(0, 2)}
            HorizontalAlignment={Enum.HorizontalAlignment.Right}
            SortOrder={Enum.SortOrder.LayoutOrder}
        />
        <uiaspectratioconstraint
            Key={"uIAspectRatioConstraint3"}
            AspectRatio={0.848}
        />

        <uisizeconstraint
            Key={"uISizeConstraint"}
            MaxSize={new Vector2(250, math.huge)}
        />

        {props[Roact.Children]}
    </frame>
}

markPureComponent(LeaderboardHolderComponent);