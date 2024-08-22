import Roact, { Binding } from "@rbxts/roact";
import { useEffect, useRef, withHookDetection, withHooks } from "@rbxts/roact-hooked";
import { TweenService } from "@rbxts/services";

function MenuProgressionPage(props : {visible : Binding<boolean>, selected : boolean} & Roact.PropsWithChildren) : Roact.Element {
    const ref = useRef<UIScale>();
    
    useEffect(() => {
        if(!ref.getValue()) return

        TweenService.Create(ref.getValue()!, new TweenInfo(0.3), { Scale: props.selected ? 1 : 0.9 }).Play()
    }, [props.selected, ref])

    return <frame
        Key={"home1"}
        AnchorPoint={new Vector2(0.5, 0.5)}
        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
        BackgroundTransparency={1}
        BorderColor3={Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        Position={UDim2.fromScale(0.5, 0.5)}
        Size={UDim2.fromScale(1, 1)}
        ZIndex={2}
        Visible={props.visible}
    >
        <uiscale Ref={ref} />
        {props[Roact.Children]}
    </frame>
}

export const MenuProgressionPageComponent = (MenuProgressionPage);