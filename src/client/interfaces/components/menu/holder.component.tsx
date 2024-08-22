import Roact, { Binding } from "@rbxts/roact";
import { markPureComponent } from "@rbxts/roact-hooked";

export function MenuHolderComponent(props : {visible : Binding<boolean>} & Roact.PropsWithChildren) : Roact.Element {
    return (
        <frame
            Key={"menu"}
            AnchorPoint={new Vector2(0.5, 0.5)}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.5, 0.5)}
            Size={UDim2.fromScale(1, 1)}
            Visible={props.visible}
        >
            {props[Roact.Children]}
        </frame>
    )
}

markPureComponent(MenuHolderComponent);