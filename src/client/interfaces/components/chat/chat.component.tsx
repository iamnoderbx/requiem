import Roact from "@rbxts/roact";
import { markPureComponent } from "@rbxts/roact-hooked";

export default function ChatComponent(props : {Visible?: boolean, ref : Roact.RefPropertyOrFunction<TextBox>}): Roact.Element {
    return (
        <frame
            Key={"chat"}
            AnchorPoint={new Vector2(0.5, 1)}
            BackgroundColor3={Color3.fromRGB(0, 0, 0)}
            BackgroundTransparency={0.55}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.5, 1)}
            Size={new UDim2(1, 0, 0, 24)}
            Visible={props.Visible}
        >
            <textbox
                Key={"input"}
                FontFace={new Font(
                    "rbxasset://fonts/families/SourceSansPro.json",
                    Enum.FontWeight.Regular,
                    Enum.FontStyle.Italic
                )}
                PlaceholderColor3={Color3.fromRGB(143, 143, 143)}
                PlaceholderText={"Click here or press \"/\" to type."}
                Text={"Click here or press \"/\" to type."}
                TextColor3={Color3.fromRGB(209, 209, 209)}
                TextScaled={true}
                TextSize={14}
                TextWrapped={true}
                TextXAlignment={Enum.TextXAlignment.Left}
                AnchorPoint={new Vector2(0, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0, 0.5)}
                Size={UDim2.fromScale(1, 1)}
                Ref={props.ref}
            />

            <uipadding
                Key={"uIPadding"}
                PaddingBottom={new UDim(0.25, 0)}
                PaddingLeft={new UDim(0, 7)}
                PaddingTop={new UDim(0.25, 0)}
            />
        </frame>
    )
}

markPureComponent(ChatComponent);