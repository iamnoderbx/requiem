import Roact from "@rbxts/roact";
import { markPureComponent } from "@rbxts/roact-hooked";

export default function CommandBarComponent(props: { ref: Roact.Ref<Frame> }): Roact.Element {
    return (
        <frame
            AnchorPoint={new Vector2(0.5, 0.5)}
            BackgroundColor3={Color3.fromRGB(30, 31, 35)}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.5, 0.9)}
            Size={UDim2.fromScale(0.6, 0.0301)}
            Key={"admin"}
            Ref={props.ref}
            Visible={false}
        >
            <uicorner
                Key={"UICorner"}
                CornerRadius={new UDim(0, 5)}
            />

            <textbox
                Key={"TextBox"}
                CursorPosition={-1}
                FontFace={new Font(
                    "rbxasset://fonts/families/SourceSansPro.json",
                    Enum.FontWeight.Regular,
                    Enum.FontStyle.Italic
                )}
                Text={"Begin typing your command..."}
                PlaceholderText={"Begin typing your command..."}
                PlaceholderColor3={Color3.fromRGB(199, 212, 224)}
                TextColor3={Color3.fromRGB(230, 241, 255)}
                TextScaled={true}
                TextSize={14}
                TextTransparency={0.35}
                TextWrapped={true}
                TextXAlignment={Enum.TextXAlignment.Left}
                AnchorPoint={new Vector2(0, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.011, 0.5)}
                Size={UDim2.fromOffset(721, 14)}
            />

            <frame
                Key={"Autofill"}
                AnchorPoint={new Vector2(0.5, 1)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.5, -0.172)}
                Size={UDim2.fromOffset(1069, 94)}
            />
        </frame>
    )
}

markPureComponent(CommandBarComponent);