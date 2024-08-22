import Roact, { Fragment } from "@rbxts/roact";
import { useRef, useEffect, withHooks } from "@rbxts/roact-hooked";
import { TweenService } from "@rbxts/services";
import TransparencyGroup, { useTransparencyGroup } from "../utilities/transparency.group";

export default withHooks((props: { Header: string, Body: string, Visible: boolean, Closed: () => void, Color?: Color3 } & Roact.PropsWithChildren) => {
    const ref = useRef<UIScale>();

    useEffect(() => {
        if (!ref.getValue()) return

        const tween = TweenService.Create(ref.getValue()!, new TweenInfo(0.3), { Scale: props.Visible ? 1 : 0.9 })
        tween.Play()
    }, [props.Visible, ref])

    const [transparency, settings] = useTransparencyGroup({
        visible: props.Visible, tween: new TweenInfo(0.125),
    });

    return <TransparencyGroup visible={props.Visible} settings={settings} zindex={10}>
        <frame
            AnchorPoint={new Vector2(0.5, 0.5)}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.523, 0.515)}
            Size={UDim2.fromScale(0.378, 0.414)}
            ZIndex={2}
            Key={"enchantment"}
            Visible={transparency.map((value) => value !== 1)}
        >
            <uiscale Ref={ref} />

            <uiaspectratioconstraint
                Key={"UIAspectRatioConstraint"}
                AspectRatio={1.41}
            />

            <imagelabel
                Image={"rbxassetid://16264499577"}
                ImageTransparency={0.27}
                ScaleType={Enum.ScaleType.Slice}
                SliceCenter={new Rect(379, 379, 379, 379)}
                SliceScale={0.275}
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.502, 0.507)}
                Size={UDim2.fromScale(1.14, 1.19)}
                ZIndex={0}
                Key={"shadow"}
            />

            <frame
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.913, 0.0461)}
                Size={UDim2.fromScale(0.0573, 0.0806)}
                ZIndex={3}
                Key={"close"}
            >
                <imagebutton
                    ImageColor3={Color3.fromRGB(0, 0, 0)}
                    AutoButtonColor={false}
                    AnchorPoint={new Vector2(0.5, 0.5)}
                    BackgroundColor3={Color3.fromRGB(83, 83, 83)}
                    BackgroundTransparency={0.95}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.448, 0.785)}
                    Size={UDim2.fromScale(1, 1)}
                    ZIndex={14}
                    Key={"close"}
                    Event={{
                        MouseButton1Click: props.Closed
                    }}
                >
                    <uicorner
                        CornerRadius={new UDim(1, 0)}
                        Key={"corner"}
                    />

                    <imagelabel
                        Image={"rbxassetid://11293981586"}
                        AnchorPoint={new Vector2(0.5, 0.5)}
                        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                        BackgroundTransparency={1}
                        BorderColor3={Color3.fromRGB(0, 0, 0)}
                        BorderSizePixel={0}
                        Position={UDim2.fromScale(0.5, 0.5)}
                        Size={UDim2.fromScale(0.45, 0.45)}
                        ZIndex={15}
                        Key={"icon"}
                    >
                        <uiscale
                            Key={"scale"}
                        />

                        <uiaspectratioconstraint Key={"UIAspectRatioConstraint"} />
                    </imagelabel>

                    <uigradient
                        Enabled={false}
                        Transparency={new NumberSequence([
                            new NumberSequenceKeypoint(0, 0),
                            new NumberSequenceKeypoint(1, 0.331),
                        ])}
                        Key={"gradient"}
                    />
                </imagebutton>

                <uiaspectratioconstraint Key={"UIAspectRatioConstraint"} />
            </frame>

            <textlabel
                FontFace={new Font(
                    "rbxasset://fonts/families/SourceSansPro.json",
                    Enum.FontWeight.SemiBold,
                    Enum.FontStyle.Normal
                )}
                Text={props.Header}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextScaled={true}
                TextSize={14}
                TextTransparency={0.24}
                TextWrapped={true}
                TextXAlignment={Enum.TextXAlignment.Left}
                TextYAlignment={Enum.TextYAlignment.Bottom}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.0506, 0.067)}
                Size={UDim2.fromScale(0.479, 0.0446)}
                ZIndex={3}
                Key={"header"}
            />

            <textlabel
                FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                Text={props.Body}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextScaled={true}
                TextSize={14}
                TextTransparency={0.46}
                TextWrapped={true}
                TextXAlignment={Enum.TextXAlignment.Left}
                TextYAlignment={Enum.TextYAlignment.Bottom}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.0506, 0.121)}
                Size={UDim2.fromScale(0.756, 0.0303)}
                ZIndex={3}
                Key={"header2"}
            />

            <frame
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.5, 0.591)}
                Size={UDim2.fromScale(1, 0.674)}
                ZIndex={4}
                Key={"content"}
            >
                {props[Roact.Children]}
            </frame>
            <frame
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={Color3.fromRGB(9, 10, 13)}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.5, 0.5)}
                Size={UDim2.fromScale(1, 1)}
                Key={"effects"}
            >
                <uistroke
                    Key={"UIStroke"}
                    Color={Color3.fromRGB(56, 62, 80)}
                    Transparency={0.78}
                />

                <uicorner
                    Key={"UICorner"}
                    CornerRadius={new UDim(0.05, 0)}
                />

                <frame
                    AnchorPoint={new Vector2(0.5, 0.5)}
                    BackgroundColor3={props.Color ?? Color3.fromRGB(124, 165, 255)}
                    BackgroundTransparency={0.3}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.5, 0.5)}
                    Size={UDim2.fromScale(1, 1)}
                    ZIndex={2}
                    Key={"gradient"}
                >
                    <uicorner
                        Key={"UICorner"}
                        CornerRadius={new UDim(0.05, 0)}
                    />

                    <uigradient
                        Key={"UIGradient"}
                        Rotation={90}
                        Transparency={new NumberSequence([
                            new NumberSequenceKeypoint(0, 0.94),
                            new NumberSequenceKeypoint(0.186, 0.972),
                            new NumberSequenceKeypoint(0.262, 1),
                            new NumberSequenceKeypoint(1, 1),
                        ])}
                    />
                </frame>
            </frame>
        </frame>
    </TransparencyGroup>
})