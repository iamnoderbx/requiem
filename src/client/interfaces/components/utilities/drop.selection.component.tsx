import Roact from "@rbxts/roact";
import { DetachmentData } from "selectors/BranchMemberSelector";

export default function DropSelectionComponent(props: { Visible: boolean, Options: string[], Width: number, Position: UDim2, Selected: (button : TextButton, selection: string) => DetachmentData | void, Color?: Color3 }): Roact.Element {
    return (
        <frame
            Key={"Frame1"}
            AutomaticSize={Enum.AutomaticSize.Y}
            BackgroundColor3={props.Color ?? Color3.fromRGB(50, 62, 95)}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={props.Position}
            Size={new UDim2(props.Width, 0, 0, 0)}
            ZIndex={7}
            Visible={props.Visible}
        >
            <imagelabel
                Key={"ImageLabel1"}
                Image={"rbxassetid://17463846950"}
                ImageColor3={props.Color ??Color3.fromRGB(50, 62, 95)}
                AnchorPoint={new Vector2(0.5, 1)}
                BackgroundColor3={Color3.fromRGB(50, 62, 95)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={new UDim2(1, -22, 0, 0)}
                Rotation={180}
                Size={UDim2.fromOffset(22, 22)}
            >
                <uiaspectratioconstraint Key={"UIAspectRatioConstraint"} />
            </imagelabel>

            <uicorner
                Key={"UICorner1"}
                CornerRadius={new UDim(0, 3)}
            />

            <frame
                Key={"Frame1"}
                AutomaticSize={Enum.AutomaticSize.Y}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Size={UDim2.fromScale(1, 0)}
            >
                <uilistlayout
                    Key={"UIListLayout1"}
                    Padding={new UDim(0, 3)}
                    HorizontalAlignment={Enum.HorizontalAlignment.Center}
                    SortOrder={Enum.SortOrder.LayoutOrder}
                />

                {props.Options.map((option, index) => {
                    return <textbutton
                        Key={"TextButton1"}
                        FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                        Text={option}
                        TextColor3={Color3.fromRGB(255, 255, 255)}
                        TextScaled={true}
                        TextSize={14}
                        TextTransparency={0.3}
                        TextWrapped={true}
                        TextXAlignment={Enum.TextXAlignment.Left}
                        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                        BackgroundTransparency={1}
                        BorderColor3={Color3.fromRGB(0, 0, 0)}
                        BorderSizePixel={0}
                        Position={UDim2.fromScale(0.149, 0)}
                        Size={new UDim2(0.851, 0, 0, 20)}
                        Event={{
                            MouseButton1Click: (button) => {
                                const detachment = props.Selected(button, option)
                                if(!detachment) return;

                                
                            },
                            MouseEnter: (button) => {
                                button.TextTransparency = 0.1;
                            },

                            MouseLeave: (button) => {
                                button.TextTransparency = 0.3;
                            }
                        }}
                    >
                        <uipadding
                            Key={"UIPadding1"}
                            PaddingBottom={new UDim(0, 3)}
                            PaddingTop={new UDim(0, 3)}
                        />
                    </textbutton>
                })}


                <uipadding
                    Key={"UIPadding1"}
                    PaddingBottom={new UDim(0, 5)}
                    PaddingTop={new UDim(0, 5)}
                />


            </frame>
        </frame>
    )
}