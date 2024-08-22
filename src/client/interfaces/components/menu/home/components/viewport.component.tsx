import Roact from "@rbxts/roact";
import { markPureComponent } from "@rbxts/roact-hooked";

export default function HomeViewportPageComponent(props : {ref : Roact.RefPropertyOrFunction<ViewportFrame>}) : Roact.Element {
    return <viewportframe
        Key={"viewportFrame"}
        Ambient={Color3.fromRGB(72, 72, 72)}
        LightColor={Color3.fromRGB(132, 137, 140)}
        AnchorPoint={new Vector2(0.5, 0.5)}
        BackgroundColor3={Color3.fromRGB(0, 0, 0)}
        BackgroundTransparency={1}
        BorderColor3={Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        Position={UDim2.fromScale(0.323, 0.508)}
        Size={UDim2.fromScale(0.561, 0.999)}
        ZIndex={3}
        Ref={props.ref}
    >
        
    </viewportframe>
}

markPureComponent(HomeViewportPageComponent);