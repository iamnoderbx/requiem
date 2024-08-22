import Roact from "@rbxts/roact";
import ContainerFrameComponent from "client/interfaces/components/utilities/frame.component";

export default function BranchMemberEditButtonComponent(props: { Visible: boolean, Clicked?: (button : TextButton) => void }): Roact.Element {
    return <frame
        AnchorPoint={new Vector2(1, 0)}
        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
        BackgroundTransparency={1}
        BorderColor3={Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        Position={UDim2.fromScale(0.984, 0.0403)}
        Size={UDim2.fromScale(0.12, 0.218)}
        Key={"dots1"}
        Visible={props.Visible}
    >
        <textbutton
            Size={UDim2.fromScale(1, 1)}
            Text={""}
            BackgroundTransparency={1}
            TextTransparency={1}
            Event={{
                MouseButton1Click: (button) => props.Clicked?.(button)
            }}
        />
        <ContainerFrameComponent>
            <uilistlayout
                Key={"UIListLayout1"}
                Padding={new UDim(0, 2)}
                FillDirection={Enum.FillDirection.Horizontal}
                HorizontalAlignment={Enum.HorizontalAlignment.Center}
                SortOrder={Enum.SortOrder.LayoutOrder}
                VerticalAlignment={Enum.VerticalAlignment.Center}
            />

            <frame
                Key={"Frame1"}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={0.4}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Size={UDim2.fromScale(0.135, 0.185)}
            >
                <uicorner
                    Key={"UICorner1"}
                    CornerRadius={new UDim(0, 3)}
                />

                <uiaspectratioconstraint Key={"UIAspectRatioConstraint"} />
            </frame>

            <frame
                Key={"Frame2"}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={0.4}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Size={UDim2.fromScale(0.135, 0.185)}
            >
                <uicorner
                    Key={"UICorner1"}
                    CornerRadius={new UDim(0, 3)}
                />

                <uiaspectratioconstraint Key={"UIAspectRatioConstraint"} />
            </frame>

            <frame
                Key={"Frame3"}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={0.4}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Size={UDim2.fromScale(0.135, 0.185)}
            >
                <uicorner
                    Key={"UICorner1"}
                    CornerRadius={new UDim(0, 3)}
                />

                <uiaspectratioconstraint Key={"UIAspectRatioConstraint"} />
            </frame>
        </ContainerFrameComponent>


        <uiaspectratioconstraint
            Key={"UIAspectRatioConstraint1"}
            AspectRatio={1.37}
        />
    </frame>
}