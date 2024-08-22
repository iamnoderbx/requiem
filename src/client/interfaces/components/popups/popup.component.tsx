import { Spring, useMotor } from "@rbxts/pretty-roact-hooks";
import Roact from "@rbxts/roact";
import { markPureComponent, withHooks } from "@rbxts/roact-hooked";

export function PopupListLayout(props: {Padding?: number}): Roact.Element {
    return <>
        <uilistlayout
            Key={"UIListLayout"}
            Padding={new UDim(props.Padding ?? 0.05, 0)}
            HorizontalAlignment={Enum.HorizontalAlignment.Center}
            SortOrder={Enum.SortOrder.LayoutOrder}
        />
        <uipadding
            Key={"UIPadding"}
            PaddingLeft={new UDim(0.05, 0)}
            PaddingRight={new UDim(0.05, 0)}
        />
    </>
}

export function PopupListConstraints(props: {Padding?: number}): Roact.Element {
    return <>
        <uiaspectratioconstraint
            Key={"UIAspectRatioConstraint"}
            AspectRatio={2.09}
        />
        <uilistlayout
            Key={"UIListLayout"}
            Padding={new UDim(props.Padding ?? 0.05, 0)}
            HorizontalAlignment={Enum.HorizontalAlignment.Center}
            SortOrder={Enum.SortOrder.LayoutOrder}
        />
        <uipadding
            Key={"UIPadding"}
            PaddingLeft={new UDim(0.05, 0)}
            PaddingRight={new UDim(0.05, 0)}
        />
    </>
}

export default withHooks((props: { Color: Color3, Visible: boolean } & Roact.PropsWithChildren) => {
    const [transparency, setTransparency] = useMotor(props.Visible ? 0 : 1);
    setTransparency(new Spring(props.Visible ? 0 : 1, { frequency: 2 }));

    return <frame
        AnchorPoint={new Vector2(0.5, 0.5)}
        BackgroundColor3={Color3.fromRGB(0, 0, 0)}
        BackgroundTransparency={transparency.map((value) => {
            // The default value is 0.55. We need to take our transparency (0-1) and convert it to 0.55-1
            return 0.55 + (value * 0.45);
        })} // 0.55
        BorderColor3={Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        Position={UDim2.fromScale(0.5, 0.5)}
        Size={UDim2.fromScale(1, 1)}
        Visible={transparency.map((value) => value !== 1)}
        ZIndex={2}
        Key={"popups"}
    >
        {props[Roact.Children]}

        <imagelabel
            Image={"rbxassetid://17812826389"}
            ImageColor3={props.Color}
            ImageTransparency={transparency.map((value) => {
                // The default value is 0.56. We need to take our transparency (0-1) and convert it to 0.56-1
                return 0.56 + (value * 0.44);
            })}
            AnchorPoint={new Vector2(0.5, 0.5)}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.5, 0.5)}
            Size={UDim2.fromScale(1.5, 1.5)}
            ZIndex={0}
            Key={"glow"}
        >
            <uiaspectratioconstraint Key={"UIAspectRatioConstraint"} />
        </imagelabel>

        <imagelabel
            Image={"rbxassetid://6891912132"}
            ImageColor3={Color3.fromRGB(0, 0, 0)}
            ImageTransparency={transparency.map((value) => {
                // The default value is 0.6. We need to take our transparency (0-1) and convert it to 0.6-1
                return 0.6 + (value * 0.4);
            })} // 0.6
            AnchorPoint={new Vector2(0.5, 0.5)}
            BackgroundColor3={Color3.fromRGB(0, 0, 0)}
            BackgroundTransparency={transparency.map((value) => {
                // The default value is 0.85. We need to take our transparency (0-1) and convert it to 0.85-1
                return 0.85 + (value * 0.15);
            })}// 0.85
            Position={UDim2.fromScale(0.5, 0.5)}
            Size={UDim2.fromScale(1, 1)}
            ZIndex={0}
            Key={"view"}
        />

        <frame
            AnchorPoint={new Vector2(1, 1)}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.992, 0.988)}
            Size={UDim2.fromScale(0.158, 0.068)}
            ZIndex={5}
            Key={"buttons"}
        >
            <frame
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.772, 0.0461)}
                Size={UDim2.fromScale(0.163, 0.585)}
                ZIndex={3}
                Key={"zoom_in"}
            >
                <imagebutton
                    ImageColor3={Color3.fromRGB(0, 0, 0)}
                    AutoButtonColor={false}
                    AnchorPoint={new Vector2(0.5, 0.5)}
                    BackgroundColor3={Color3.fromRGB(49, 49, 49)}
                    BackgroundTransparency={0.9}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.5, 0.5)}
                    Size={UDim2.fromScale(1, 1)}
                    ZIndex={14}
                    Key={"close"}
                >
                    <uicorner
                        CornerRadius={new UDim(1, 0)}
                        Key={"corner"}
                    />

                    <imagelabel
                        Image={"rbxassetid://11419712719"}
                        ImageTransparency={0.5}
                        AnchorPoint={new Vector2(0.5, 0.5)}
                        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                        BackgroundTransparency={1}
                        BorderColor3={Color3.fromRGB(0, 0, 0)}
                        BorderSizePixel={0}
                        Position={UDim2.fromScale(0.5, 0.5)}
                        Size={UDim2.fromScale(0.6, 0.6)}
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

            <uilistlayout
                Key={"UIListLayout1"}
                Padding={new UDim(0.05, 0)}
                FillDirection={Enum.FillDirection.Horizontal}
                HorizontalAlignment={Enum.HorizontalAlignment.Right}
                SortOrder={Enum.SortOrder.LayoutOrder}
                VerticalAlignment={Enum.VerticalAlignment.Center}
            />

            <frame
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.772, 0.0461)}
                Size={UDim2.fromScale(0.163, 0.585)}
                ZIndex={3}
                Key={"zoom_out"}
            >
                <imagebutton
                    Image={"rbxassetid://11419713010"}
                    ImageColor3={Color3.fromRGB(0, 0, 0)}
                    AutoButtonColor={false}
                    AnchorPoint={new Vector2(0.5, 0.5)}
                    BackgroundColor3={Color3.fromRGB(49, 49, 49)}
                    BackgroundTransparency={0.9}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.5, 0.5)}
                    Size={UDim2.fromScale(1, 1)}
                    ZIndex={14}
                    Key={"close"}
                >
                    <uicorner
                        CornerRadius={new UDim(1, 0)}
                        Key={"corner"}
                    />

                    <imagelabel
                        Image={"rbxassetid://11419713010"}
                        ImageTransparency={0.5}
                        AnchorPoint={new Vector2(0.5, 0.5)}
                        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                        BackgroundTransparency={1}
                        BorderColor3={Color3.fromRGB(0, 0, 0)}
                        BorderSizePixel={0}
                        Position={UDim2.fromScale(0.5, 0.5)}
                        Size={UDim2.fromScale(0.6, 0.6)}
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

            <uiaspectratioconstraint
                Key={"UIAspectRatioConstraint"}
                AspectRatio={3.58}
            />
        </frame>
    </frame>
})

markPureComponent(PopupListLayout);
markPureComponent(PopupListConstraints);