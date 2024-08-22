import Roact from "@rbxts/roact";
import { markPureComponent } from "@rbxts/roact-hooked";
import { Players } from "@rbxts/services";
import { ScaleTextToBounds } from "client/interfaces/components/utilities/textscaler.effect";
import UserThumbnailComponent from "client/interfaces/components/utilities/user.thumbnail.component";

export default function BranchMemberPreviewComponent(props: {Username : string, UserId: number, Visible: boolean, Detachment: {detachment_name : string, r: number, g: number, b: number, detachment_id: number, abbreviation: string }}): Roact.Element {
    
    return <frame
        Key={"Frame1"}
        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
        BackgroundTransparency={1}
        BorderColor3={Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        Size={UDim2.fromScale(0.0946, 0.5)}
    >
        <UserThumbnailComponent
            UserId={props.UserId}
            Visible={props.Visible}
        >
            <uicorner
                Key={"UICorner1"}
                CornerRadius={new UDim(1, 0)}
            />

            <uiaspectratioconstraint Key={"UIAspectRatioConstraint"} />

            <textbutton
                FontFace={new Font(
                    "rbxasset://fonts/families/SourceSansPro.json",
                    Enum.FontWeight.Bold,
                    Enum.FontStyle.Normal
                )}
                RichText={true}
                Text={props.Detachment.abbreviation}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextSize={13}
                AnchorPoint={new Vector2(0.5, 0.5)}
                AutomaticSize={Enum.AutomaticSize.X}
                BackgroundColor3={new Color3(props.Detachment.r, props.Detachment.g, props.Detachment.b)}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                LayoutOrder={1}
                Position={UDim2.fromOffset(34, 105)}
                Size={UDim2.fromOffset(42, 17)}
                ZIndex={6}
                Key={"price1"}
                Visible={props.Detachment.detachment_id !== -1}
            >
                <uipadding
                    Key={"UIPadding1"}
                    PaddingBottom={new UDim(0.4, 0)}
                    PaddingLeft={new UDim(0, 10)}
                    PaddingRight={new UDim(0, 10)}
                    PaddingTop={new UDim(0.4, 0)}
                />

                <uicorner Key={"UICorner"} />
            </textbutton>
        </UserThumbnailComponent>

        <textlabel
            FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
            RichText={true}
            Text={props.Username}
            TextColor3={Color3.fromRGB(255, 255, 255)}
            TextScaled={false}
            TextSize={ScaleTextToBounds(16)}
            TextTransparency={0.48}
            TextWrapped={false}
            TextYAlignment={Enum.TextYAlignment.Bottom}
            AnchorPoint={new Vector2(0.5, 0)}
            AutomaticSize={Enum.AutomaticSize.X}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.5, 0.637)}
            Size={UDim2.fromScale(1, 0.135)}
            ZIndex={2}
            TextTruncate={Enum.TextTruncate.AtEnd}
            Key={"name1"}
        />

        <uiaspectratioconstraint
            Key={"UIAspectRatioConstraint1"}
            AspectRatio={0.704}
        />
    </frame>
}

markPureComponent(BranchMemberPreviewComponent);