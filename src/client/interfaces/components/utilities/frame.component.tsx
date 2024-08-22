import Roact from "@rbxts/roact";
import { markPureComponent, useEffect, useRef, withHooks } from "@rbxts/roact-hooked";
import TransparencyGroup, { useTransparencyGroup } from "./transparency.group";
import { TweenService } from "@rbxts/services";

export const BasicScalingComponent = withHooks((props: {Visible: boolean} & Roact.PropsWithChildren) => {
    const ref = useRef<UIScale>();
    
    useEffect(() => {
        if(!ref.getValue()) return

        TweenService.Create(ref.getValue()!, new TweenInfo(0.3), { Scale: props.Visible ? 1 : 0.9 }).Play()
    }, [props.Visible, ref])

    return <uiscale Ref={ref} />
})

export const BasicTransparencyGroup = withHooks((props: {Visible: boolean, Size: UDim2, Position?: UDim2} & Roact.PropsWithChildren) => {
    // useTransparencyGroup is a custom hook that returns a transparency binding and its settings.
    const [transparency, settings] = useTransparencyGroup({
        visible: props.Visible, tween: new TweenInfo(0.2),
        delay: undefined
    });

    return <TransparencyGroup visible={props.Visible} settings={settings} size={props.Size} position={props.Position}>
        {props[Roact.Children]}
    </TransparencyGroup>
})

export function SubPageScrollComponent(props: {Centered?: boolean, Size?: UDim2, Position?: UDim2, AnchorPoint?: Vector2, ClipsDescendants?: boolean} & Roact.PropsWithChildren) {
    
    return (
        <scrollingframe
            AutomaticCanvasSize={Enum.AutomaticSize.Y}
            CanvasSize={new UDim2}
            ScrollBarImageColor3={Color3.fromRGB(16, 17, 22)}
            ScrollBarThickness={3}
            Active={false}
            AnchorPoint={props.AnchorPoint ?? new Vector2(0.5, 0)}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={props.Position ?? UDim2.fromScale(0.519, 0.1)}
            Size={props.Size ?? UDim2.fromScale(0.961, 0.9)}
            Key={"holder"}
            ClipsDescendants={props.ClipsDescendants ?? true}
        >
            {/* <uiaspectratioconstraint
                Key={"UIAspectRatioConstraint1"}
                AspectRatio={1.5}
            /> */}
            <uilistlayout
                Key={"UIListLayout"}
                Padding={new UDim(0, 5)}
                SortOrder={Enum.SortOrder.LayoutOrder}
                HorizontalAlignment={props.Centered ? Enum.HorizontalAlignment.Center : Enum.HorizontalAlignment.Left}
            />

            {props[Roact.Children]}
        </scrollingframe>
    )
}

export function SubPageFrameComponent(props: {Center?: boolean} & Partial<Roact.JsxInstance<Frame>>) {
    // Remove the Center property from the props object.
    const isCentered = props.Center;
    if(isCentered) delete props.Center;

    return <frame
        AnchorPoint={new Vector2(0.5, 0.5)}
        BackgroundTransparency={1}
        Position={isCentered ? UDim2.fromScale(0.5, 0.5) : UDim2.fromScale(0.523, 0.515)}
        Size={UDim2.fromScale(0.603, 0.749)}
        {...props}
    >
    </frame>
}

export default function ContainerFrameComponent(props: {} & Partial<Roact.JsxInstance<Frame>>) {
    return (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundTransparency={1}
            BorderSizePixel={0}
            {...props}
        />
    )
}

markPureComponent(ContainerFrameComponent);
markPureComponent(SubPageFrameComponent);
markPureComponent(SubPageScrollComponent);
