import Roact from "@rbxts/roact";
import { withHooks, useRef, useEffect, markPureComponent } from "@rbxts/roact-hooked";
import { TweenService } from "@rbxts/services";
import TransparencyGroup, { useTransparencyGroup } from "../utilities/transparency.group";

export function SlimPopupButtonsComponent(props: {} & Roact.PropsWithChildren) {
    return (
        <frame
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            LayoutOrder={1}
            Position={UDim2.fromScale(0.00467, 1.09)}
            Size={UDim2.fromScale(0.991, 0.803)}
            Key={"buttons1"}
        >
            <uilistlayout
                Key={"UIListLayout1"}
                Padding={new UDim(0.01, 0)}
                FillDirection={Enum.FillDirection.Horizontal}
                HorizontalAlignment={Enum.HorizontalAlignment.Right}
                SortOrder={Enum.SortOrder.LayoutOrder}
                VerticalAlignment={Enum.VerticalAlignment.Center}
            />

            {props[Roact.Children]}
        </frame>
    )
}

markPureComponent(SlimPopupButtonsComponent);

export default withHooks((props: { Header: string, Body: string, Visible: boolean, Closed: () => void, Color?: Color3, Offset?: number } & Roact.PropsWithChildren) => {
    const ref = useRef<UIScale>();

    useEffect(() => {
        if (!ref.getValue()) return

        const tween = TweenService.Create(ref.getValue()!, new TweenInfo(0.3), { Scale: props.Visible ? 1 : 0.9 })
        tween.Play()
    }, [props.Visible, ref])

    const [transparency, settings] = useTransparencyGroup({
        visible: props.Visible, tween: new TweenInfo(0.125),
    });

    return (<TransparencyGroup visible={props.Visible} settings={settings} zindex={10}>
        <frame
            AnchorPoint={new Vector2(0.5, 0.5)}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.526, 0.488)}
            Size={UDim2.fromScale(0.378, 0.25)}
            ZIndex={2}
            Key={"number1"}
        >
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
                Position={UDim2.fromScale(0.501, 0.505)}
                Size={UDim2.fromScale(1.14, 1.18)}
                ZIndex={0}
                Key={"shadow1"}
            />

            <frame
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.911, 0.0345)}
                Size={UDim2.fromScale(0.0564, 0.131)}
                ZIndex={3}
                Key={"close1"}
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
                    Key={"close1"}
                    Event={{
                        MouseButton1Click: props.Closed
                    }}
                >
                    <uicorner
                        CornerRadius={new UDim(1, 0)}
                        Key={"corner1"}
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
                        Key={"icon1"}
                    >
                        <uiscale
                            Key={"scale1"}
                        />

                        <uiaspectratioconstraint Key={"UIAspectRatioConstraint"} />
                    </imagelabel>

                    <uigradient
                        Enabled={false}
                        Transparency={new NumberSequence([
                            new NumberSequenceKeypoint(0, 0),
                            new NumberSequenceKeypoint(1, 0.331),
                        ])}
                        Key={"gradient1"}
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
                Position={UDim2.fromScale(0.049, 0.11)}
                Size={UDim2.fromScale(0.478, 0.0724)}
                ZIndex={3}
                Key={"header1"}
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
                Position={UDim2.fromScale(0.049, 0.197)}
                Size={UDim2.fromScale(0.755, 0.0483)}
                ZIndex={3}
                Key={"header21"}
            />

            <frame
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.5, 0.573 + (props.Offset ?? 0))}
                Size={UDim2.fromScale(0.899, 0.255)}
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
                Position={UDim2.fromScale(0.5, 0.496)}
                Size={UDim2.fromScale(1, 0.996)}
                Key={"effects1"}
            >
                <uistroke
                    Key={"UIStroke1"}
                    Color={Color3.fromRGB(56, 62, 80)}
                    Transparency={0.78}
                />

                <uicorner
                    Key={"UICorner1"}
                    CornerRadius={new UDim(0.05, 0)}
                />

                <frame
                    AnchorPoint={new Vector2(0.5, 0.5)}
                    BackgroundColor3={props.Color ?? Color3.fromRGB(124, 165, 255)}
                    BackgroundTransparency={0.3}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.501, 0.5)}
                    Size={UDim2.fromScale(1, 1)}
                    ZIndex={2}
                    Key={"gradient1"}
                >
                    <uicorner
                        Key={"UICorner1"}
                        CornerRadius={new UDim(0.05, 0)}
                    />

                    <uigradient
                        Key={"UIGradient1"}
                        Rotation={90}
                        Transparency={new NumberSequence([
                            new NumberSequenceKeypoint(0, 0.94),
                            new NumberSequenceKeypoint(0.267, 0.965),
                            new NumberSequenceKeypoint(0.393, 1),
                            new NumberSequenceKeypoint(1, 1),
                        ])}
                    />
                </frame>
            </frame>

            <uiaspectratioconstraint
                Key={"UIAspectRatioConstraint1"}
                AspectRatio={2.33}
            />
        </frame>
    </TransparencyGroup>)
})