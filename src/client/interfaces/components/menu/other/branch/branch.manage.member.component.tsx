import Roact from "@rbxts/roact";
import UserThumbnailComponent from "client/interfaces/components/utilities/user.thumbnail.component";
import { Branches } from "shared/Branches";

export default function BranchManageMemberComponent(props: { Username: string, UserId: number, Visible: boolean, Rank: number, DetachmentClicked: (button : TextButton) => void, Detachment: { detachment_name: string, r: number, g: number, b: number, detachment_id: number } } & Roact.PropsWithChildren): Roact.Element {
    return (
        <frame
            Key={"Frame1"}
            BackgroundColor3={Color3.fromRGB(0, 0, 0)}
            BackgroundTransparency={0.95}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(9.82e-08, 7.39e-08)}
            Size={UDim2.fromScale(0.291, 0.299)}
        >
            <UserThumbnailComponent
                UserId={props.UserId}
                Visible={props.Visible}
                Size={UDim2.fromScale(0.219, 0.482)}
                Position={UDim2.fromScale(0.145, 0.318)}
            >
                <uicorner
                    Key={"UICorner1"}
                    CornerRadius={new UDim(1, 0)}
                />

                <uiaspectratioconstraint Key={"UIAspectRatioConstraint"} />
            </UserThumbnailComponent>

            <textlabel
                FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                RichText={true}
                Text={props.Username}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextScaled={true}
                TextSize={14}
                TextTransparency={0.48}
                TextWrapped={true}
                TextXAlignment={Enum.TextXAlignment.Left}
                TextYAlignment={Enum.TextYAlignment.Bottom}
                AnchorPoint={new Vector2(0.5, 0)}
                AutomaticSize={Enum.AutomaticSize.X}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.631, 0.125)}
                Size={UDim2.fromScale(0.678, 0.135)}
                ZIndex={2}
                Key={"name1"}
            />

            <textbutton
                FontFace={new Font(
                    "rbxasset://fonts/families/SourceSansPro.json",
                    Enum.FontWeight.Bold,
                    Enum.FontStyle.Normal
                )}
                RichText={true}
                Text={props.Detachment.detachment_name}
                TextXAlignment={Enum.TextXAlignment.Center}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextSize={13}
                AnchorPoint={new Vector2(0, 0.5)}
                AutomaticSize={Enum.AutomaticSize.X}
                BackgroundColor3={props.Detachment.detachment_id === -1 ? Color3.fromRGB(69, 69, 69) : new Color3(props.Detachment.r, props.Detachment.g, props.Detachment.b)}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                LayoutOrder={1}
                Position={UDim2.fromScale(0.29, 0.387)}
                Size={UDim2.fromScale(0.177, 0.137)}
                ZIndex={6}
                Key={"detachment_pill"}
                Event={{
                    MouseButton1Click: (button) => props.DetachmentClicked(button)
                }}
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

            {props[Roact.Children]}

            <uistroke
                Key={"UIStroke1"}
                Color={Color3.fromRGB(38, 39, 44)}
            />

            <uicorner Key={"UICorner"} />

            {/* <textbutton
                FontFace={new Font(
                    "rbxasset://fonts/families/SourceSansPro.json",
                    Enum.FontWeight.Bold,
                    Enum.FontStyle.Normal
                )}
                RichText={true}
                Text={"Inactive"}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextSize={13}
                AnchorPoint={new Vector2(0.5, 0.5)}
                AutomaticSize={Enum.AutomaticSize.X}
                BackgroundColor3={Color3.fromRGB(95, 23, 24)}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                LayoutOrder={1}
                Position={UDim2.fromScale(0.586, 0.387)}
                Size={UDim2.fromScale(0.19, 0.137)}
                ZIndex={6}
                Key={"price2"}
            >
                <uipadding
                    Key={"UIPadding1"}
                    PaddingBottom={new UDim(0.4, 0)}
                    PaddingLeft={new UDim(0, 10)}
                    PaddingRight={new UDim(0, 10)}
                    PaddingTop={new UDim(0.4, 0)}
                />

                <uicorner Key={"UICorner"} />
            </textbutton> */}
        </frame>
    )
}