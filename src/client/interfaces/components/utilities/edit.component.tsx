import Roact from "@rbxts/roact";

export default function CircularEditComponent(props: { visible: boolean, clicked: () => void }): Roact.Element {
    return (
        <frame
            Key={"edit"}
            AnchorPoint={new Vector2(1, 1)}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(1, 1)}
            Size={UDim2.fromScale(0.482, 0.482)}
            ZIndex={13}
            Visible={props.visible}
        >
            <imagebutton
                Key={"close"}
                AutoButtonColor={false}
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={Color3.fromRGB(49, 50, 54)}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.5, 0.5)}
                Size={UDim2.fromScale(1, 1)}
                ZIndex={14}
                Event={{
                    MouseButton1Click: props.clicked
                }}
            >
                <uicorner
                    Key={"corner"}
                    CornerRadius={new UDim(1, 0)}
                />

                <imagelabel
                    Key={"icon"}
                    Image={"rbxassetid://11326670192"}
                    AnchorPoint={new Vector2(0.5, 0.5)}
                    BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                    BackgroundTransparency={1}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.5, 0.5)}
                    Size={UDim2.fromScale(0.45, 0.45)}
                    ZIndex={15}
                >
                    <uiscale />
                    <uiaspectratioconstraint />
                </imagelabel>

                <uigradient
                    Key={"gradient"}
                    Enabled={false}
                    Transparency={new NumberSequence([
                        new NumberSequenceKeypoint(0, 0),
                        new NumberSequenceKeypoint(1, 0.331),
                    ])}
                />

                <uistroke
                    Key={"uIStroke"}
                    Color={Color3.fromRGB(62, 62, 62)}
                    Transparency={0.69}
                />
            </imagebutton>

            <uiaspectratioconstraint />
        </frame>
    )
}