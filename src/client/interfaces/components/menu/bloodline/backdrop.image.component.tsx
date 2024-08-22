import Roact from "@rbxts/roact";
import { markPureComponent } from "@rbxts/roact-hooked";

export default function BloodlineBackdropImageComponent(props: { Image: string }): Roact.Element {
    return (
        <imagelabel
            Key={"ImageLabel"}
            Image={props.Image}
            ImageColor3={Color3.fromRGB(193, 193, 193)}
            ImageTransparency={0.975}
            AnchorPoint={new Vector2(0, 0.5)}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.0105, 0.953)}
            Size={UDim2.fromScale(0.975, 1.6)}
            ZIndex={10}
        >
            <uiaspectratioconstraint Key={"UIAspectRatioConstraint"} />
        </imagelabel>
    )
}
markPureComponent(BloodlineBackdropImageComponent);