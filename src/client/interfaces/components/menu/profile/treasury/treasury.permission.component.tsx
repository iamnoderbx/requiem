import Roact from "@rbxts/roact";
import { markPureComponent } from "@rbxts/roact-hooked";
import { Players } from "@rbxts/services";

export default function TreasuryPermissionComponent(props: { User: number, Owner: boolean, Deleted?: (frame: Frame) => void }): Roact.Element {
    return <frame
        AutomaticSize={Enum.AutomaticSize.X}
        BackgroundColor3={Color3.fromRGB(0, 0, 0)}
        BackgroundTransparency={0.85}
        BorderColor3={Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        Position={UDim2.fromScale(0.0617, 0.203)}
        Size={new UDim2(0.98, 0, 0, 43)}
        Key={"user1"}
    >
        <textlabel
            FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
            Text={Players.GetNameFromUserIdAsync(props.User)}
            TextColor3={Color3.fromRGB(255, 255, 255)}
            TextScaled={true}
            TextSize={14}
            TextTransparency={0.31}
            TextWrapped={true}
            TextXAlignment={Enum.TextXAlignment.Left}
            TextYAlignment={Enum.TextYAlignment.Bottom}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.0224, 0.284)}
            Size={UDim2.fromScale(0.529, 0.4)}
            ZIndex={3}
            Key={"header1"}
        />

        <uicorner Key={"UICorner"} />

        <frame
            AnchorPoint={new Vector2(0.5, 0.5)}
            BackgroundColor3={Color3.fromRGB(6, 8, 12)}
            BackgroundTransparency={0.15}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.5, 0.5)}
            Size={UDim2.fromScale(1, 1)}
            ZIndex={5}
            Key={"locked"}
            Visible={false}
        >
            <uicorner Key={"UICorner"} />
        </frame>

        <textbutton
            FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
            Text={"Remove"}
            TextColor3={Color3.fromRGB(255, 85, 85)}
            TextScaled={true}
            TextSize={14}
            TextTransparency={0.41}
            TextWrapped={true}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.895, 0.226)}
            Size={UDim2.fromScale(0.086, 0.548)}
            Key={"delete1"}
            Visible={!props.Owner}
            Event={{
                MouseButton1Click: (button) => {
                    if (props.Deleted) props.Deleted(button.Parent! as Frame);
                }
            }}
        >
            <uipadding
                Key={"UIPadding1"}
                PaddingBottom={new UDim(0.2, 0)}
                PaddingTop={new UDim(0.2, 0)}
            />

            <uistroke
                Key={"UIStroke1"}
                ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
                Color={Color3.fromRGB(255, 85, 85)}
                Transparency={0.76}
            />

            <uicorner Key={"UICorner"} />

            <uiaspectratioconstraint
                Key={"UIAspectRatioConstraint1"}
                AspectRatio={3.23}
            />
        </textbutton>

        <uiaspectratioconstraint
            Key={"UIAspectRatioConstraint1"}
            AspectRatio={20.6}
        />
    </frame>
}

markPureComponent(TreasuryPermissionComponent);