import { useMountEffect } from "@rbxts/pretty-roact-hooks";
import Roact from "@rbxts/roact";
import { useEffect, withHooks } from "@rbxts/roact-hooked";

const TreasuryNewUserComponent = withHooks((props: {FocusLost : (user : string, frame : Frame) => void}): Roact.Element => {
    const ref = Roact.createRef<TextBox>()

    useEffect(() => {
        const textBox = ref.getValue()
        if (textBox) {
            textBox.CaptureFocus()
        }
    }, [ ref ])

    return (
        <frame
            AutomaticSize={Enum.AutomaticSize.X}
            BackgroundColor3={Color3.fromRGB(0, 0, 0)}
            BackgroundTransparency={0.85}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.0617, 0.203)}
            Size={new UDim2(0.98, 0, 0, 43)}
            Key={"new_user1"}
        >
            <uicorner Key={"UICorner"} />

            <uiaspectratioconstraint
                Key={"UIAspectRatioConstraint1"}
                AspectRatio={20.6}
            />

            <textbox
                Key={"TextBox1"}
                FontFace={new Font(
                    "rbxasset://fonts/families/SourceSansPro.json",
                    Enum.FontWeight.Regular,
                    Enum.FontStyle.Italic
                )}
                PlaceholderText={"Username"}
                Text={""}
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
                Position={UDim2.fromScale(0.022, 0.284)}
                Size={UDim2.fromScale(0.529, 0.4)}
                Ref={ref}
                Event={{
                    FocusLost: (textB) => {
                        const textBox = ref.getValue() ?? textB
                        if (textBox) {
                            props.FocusLost(textBox.Text, textBox.Parent!.Parent!.Parent!.Parent as Frame)
                        }
                    }
                }}
            />
        </frame>
    )
})

export default TreasuryNewUserComponent;