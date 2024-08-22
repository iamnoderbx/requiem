import Roact from "@rbxts/roact";
import { markPureComponent, useEffect, useRef, withHooks } from "@rbxts/roact-hooked";
import TransparencyGroup, { useTransparencyGroup } from "./transparency.group";
import { TweenService } from "@rbxts/services";

export const PopupSizeTypes = {
    Small: UDim2.fromScale(0.381, 0.616),
    Medium: UDim2.fromScale(0.45, 0.616),
    Large: UDim2.fromScale(0.576, 0.616),
    Tall: UDim2.fromScale(0.381, 0.769),

    ExtraLarge: UDim2.fromScale(0.72, 0.77),
    Input: UDim2.fromScale(0.381, 0.247),
}

function PopupRawComponent(props: { Size: UDim2, visible: boolean, zindex?: number } & Roact.PropsWithChildren): Roact.Element {
    const [transparency, settings] = useTransparencyGroup({
        visible: props.visible, tween: new TweenInfo(0.2),
    });

    const ref = useRef<UIScale>();

    useEffect(() => {
        if (!ref.getValue()) return

        TweenService.Create(ref.getValue()!, new TweenInfo(0.3), { Scale: props.visible ? 1 : 0.9 }).Play()
    }, [props.visible, ref])

    return <TransparencyGroup visible={props.visible} settings={settings} zindex={props.zindex}>
        <frame
            AnchorPoint={new Vector2(0.5, 0.5)}
            BackgroundTransparency={0.3}
            BackgroundColor3={Color3.fromRGB(0, 0, 0)}
            Visible={transparency.map((value) => value !== 1)}
            Size={UDim2.fromScale(1, 1)}
            Position={UDim2.fromScale(0.5, 0.5)}
            ZIndex={props.zindex || 11}
        >
            <frame
                Key={"menu"}
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={Color3.fromRGB(30, 31, 35)}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                ClipsDescendants={true}
                Position={UDim2.fromScale(0.5, 0.5)}
                Size={props.Size}
                ZIndex={12}
                Visible={props.visible}
            >
                <uiscale Ref={ref} />
                <uicorner
                    Key={"uICorner"}
                    CornerRadius={new UDim(0, 15)}
                />

                {props[Roact.Children]}
            </frame>
        </frame>
    </TransparencyGroup>
}

export function ExtraLargePopupHeaderComponent(props: { title: string }): Roact.Element {
    return (
        <textlabel
            Key={"header"}
            FontFace={new Font(
                "rbxasset://fonts/families/SourceSansPro.json",
                Enum.FontWeight.Bold,
                Enum.FontStyle.Normal
            )}
            Text={props.title}
            TextColor3={Color3.fromRGB(255, 255, 255)}
            TextScaled={true}
            TextSize={14}
            TextTransparency={0.25}
            TextWrapped={true}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0, 0.0333)}
            Size={UDim2.fromScale(0.999, 0.0475)}
            ZIndex={15}
        />
    )
}

export function TallPopupHeaderComponent(props: { title: string }): Roact.Element {
    return <textlabel
        Key={"header"}
        FontFace={new Font(
            "rbxasset://fonts/families/SourceSansPro.json",
            Enum.FontWeight.Bold,
            Enum.FontStyle.Normal
        )}
        Text={props.title}
        TextColor3={Color3.fromRGB(255, 255, 255)}
        TextScaled={true}
        TextSize={14}
        TextTransparency={0.25}
        TextWrapped={true}
        AnchorPoint={new Vector2(0.5, 0)}
        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
        BackgroundTransparency={1}
        BorderColor3={Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        Position={UDim2.fromScale(0.5, 0.0444)}
        Size={UDim2.fromScale(1, 0.0467)}
        ZIndex={15}
    >
        <uiaspectratioconstraint
            Key={"uIAspectRatioConstraint2"}
            AspectRatio={18.7}
        />
    </textlabel>
}

export function PopupHeaderComponent(props: { title: string }): Roact.Element {
    return <textlabel
        Key={"header"}
        FontFace={new Font(
            "rbxasset://fonts/families/SourceSansPro.json",
            Enum.FontWeight.Bold,
            Enum.FontStyle.Normal
        )}
        Text={props.title}
        TextColor3={Color3.fromRGB(255, 255, 255)}
        TextScaled={true}
        TextSize={14}
        TextTransparency={0.25}
        TextWrapped={true}
        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
        BackgroundTransparency={1}
        BorderColor3={Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        Position={UDim2.fromScale(0, 0.0444)}
        Size={UDim2.fromScale(1, 0.058)}
        ZIndex={15}
    />
}

export function PopupSwitchButton(props: { onClick: () => void }): Roact.Element {
    return (
        <frame
            Key={"switch"}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.796, 0.0222)}
            Size={UDim2.fromScale(0.0944, 0.103)}
            ZIndex={13}
        >
            <imagebutton
                Key={"close"}
                AutoButtonColor={false}
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={0.95}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.5, 0.5)}
                Size={UDim2.fromScale(1, 1)}
                ZIndex={14}
                Event={{ MouseButton1Click: props.onClick }}
            >
                <uicorner
                    Key={"corner"}
                    CornerRadius={new UDim(1, 0)}
                />

                <imagelabel
                    Key={"icon"}
                    Image={"rbxassetid://11326672122"}
                    AnchorPoint={new Vector2(0.5, 0.5)}
                    BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                    BackgroundTransparency={1}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.5, 0.5)}
                    Size={UDim2.fromScale(0.45, 0.45)}
                    ZIndex={15}
                >
                    <uiscale />
                    <uiaspectratioconstraint />
                </imagelabel>

                <uigradient
                    Key={"gradient"}
                    Enabled={false}
                    Transparency={new NumberSequence([
                        new NumberSequenceKeypoint(0, 0),
                        new NumberSequenceKeypoint(1, 0.331),
                    ])}
                />
            </imagebutton>

            <uiaspectratioconstraint />
        </frame>
    )
}

export function InputPopupHeaderComponent(props: { title: string }): Roact.Element {
    return (
        <textlabel
            Key={"header"}
            FontFace={new Font(
                "rbxasset://fonts/families/SourceSansPro.json",
                Enum.FontWeight.Bold,
                Enum.FontStyle.Normal
            )}
            Text={props.title}
            TextColor3={Color3.fromRGB(255, 255, 255)}
            TextScaled={true}
            TextSize={14}
            TextTransparency={0.25}
            TextWrapped={true}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0, 0.111)}
            Size={UDim2.fromScale(1, 0.146)}
            ZIndex={15}
        />
    )
}

export function InputPopupCloseButton(props: { onClick: () => void }): Roact.Element {
    return (
        <frame
            Key={"close"}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.878, 0.0555)}
            Size={UDim2.fromScale(0.0944, 0.256)}
            ZIndex={13}
        >
            <imagebutton
                Key={"close1"}
                AutoButtonColor={false}
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={0.95}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.5, 0.5)}
                Size={UDim2.fromScale(1, 1)}
                ZIndex={14}
                Event={{
                    MouseButton1Click: props.onClick
                }}
            >
                <uicorner
                    Key={"corner"}
                    CornerRadius={new UDim(1, 0)}
                />

                <imagelabel
                    Key={"icon"}
                    Image={"rbxassetid://11293981586"}
                    AnchorPoint={new Vector2(0.5, 0.5)}
                    BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                    BackgroundTransparency={1}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.5, 0.5)}
                    Size={UDim2.fromScale(0.45, 0.45)}
                    ZIndex={15}
                >
                    <uiscale />
                    <uiaspectratioconstraint />
                </imagelabel>

                <uigradient
                    Key={"gradient"}
                    Enabled={false}
                    Transparency={new NumberSequence([
                        new NumberSequenceKeypoint(0, 0),
                        new NumberSequenceKeypoint(1, 0.331),
                    ])}
                />
            </imagebutton>

            <uiaspectratioconstraint />
        </frame>
    )
};

export function ExtraLargePopupCloseButton(props: { onClick: () => void }): Roact.Element {
    return (
        <frame
            Key={"close"}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.911, 0.0189)}
            Size={UDim2.fromScale(0.05, 0.0822)}
            ZIndex={13}
        >
            <imagebutton
                Key={"close1"}
                AutoButtonColor={false}
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={0.95}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.5, 0.5)}
                Size={UDim2.fromScale(1, 1)}
                ZIndex={14}
                Event={{ MouseButton1Click: props.onClick }}
            >
                <uicorner
                    Key={"corner"}
                    CornerRadius={new UDim(1, 0)}
                />

                <imagelabel
                    Key={"icon"}
                    Image={"rbxassetid://11293981586"}
                    AnchorPoint={new Vector2(0.5, 0.5)}
                    BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                    BackgroundTransparency={1}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.5, 0.5)}
                    Size={UDim2.fromScale(0.45, 0.45)}
                    ZIndex={15}
                >
                    <uiscale />
                    <uiaspectratioconstraint />
                </imagelabel>

                <uigradient
                    Key={"gradient"}
                    Enabled={false}
                    Transparency={new NumberSequence([
                        new NumberSequenceKeypoint(0, 0),
                        new NumberSequenceKeypoint(1, 0.331),
                    ])}
                />
            </imagebutton>

            <uiaspectratioconstraint />
        </frame>
    )
}

export function PopupCloseButton(props: { onClick: () => void }): Roact.Element {
    return (
        <frame
            Key={"close"}
            AnchorPoint={new Vector2(1, 0.5)}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.964, 0.0803)}
            Size={UDim2.fromScale(0.094, 0.103)}
            ZIndex={13}
        >
            <uiaspectratioconstraint />

            <imagebutton
                Key={"close1"}
                AutoButtonColor={false}
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={0.95}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.5, 0.5)}
                Size={UDim2.fromScale(1, 1)}
                ZIndex={14}
                Event={{ MouseButton1Click: props.onClick }}
            >
                <uigradient
                    Key={"gradient"}
                    Enabled={false}
                    Transparency={new NumberSequence([
                        new NumberSequenceKeypoint(0, 0),
                        new NumberSequenceKeypoint(1, 0.331),
                    ])}
                />

                <uicorner
                    Key={"corner"}
                    CornerRadius={new UDim(1, 0)}
                />

                <imagelabel
                    Key={"icon"}
                    Image={"rbxassetid://11293981586"}
                    AnchorPoint={new Vector2(0.5, 0.5)}
                    BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                    BackgroundTransparency={1}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.5, 0.5)}
                    Size={UDim2.fromScale(0.45, 0.45)}
                    ZIndex={15}
                >
                    <uiscale />
                    <uiaspectratioconstraint />
                </imagelabel>
            </imagebutton>
        </frame>
    )
}

function PopupGroupRawComponent(props: {} & Roact.PropsWithChildren): Roact.Element {
    return <frame
        AnchorPoint={new Vector2(0.5, 0.5)}
        BackgroundTransparency={1}
        BorderSizePixel={0}
        Position={UDim2.fromScale(0.5, 0.5)}
        Size={UDim2.fromScale(1, 1)}
        ZIndex={10}
    >
        {props[Roact.Children]}
    </frame>
}

export const PopupGroupContainer = markPureComponent(PopupGroupRawComponent)
export const PopupComponent = withHooks(PopupRawComponent)