import Roact from "@rbxts/roact";
import { markPureComponent } from "@rbxts/roact-hooked";

export function StickyTabComponent(props: { Header: string, Clicked: () => void, Selected: boolean, Visible?: boolean}): Roact.Element {
    return (
        <frame
            Key={"Frame2"}
            BackgroundColor3={Color3.fromRGB(0, 0, 0)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            LayoutOrder={1}
            Size={UDim2.fromScale(0.25, 1)}
            Visible={props.Visible}
        >
            <textlabel
                Key={"TextButton1"}
                FontFace={new Font(
                    "rbxasset://fonts/families/SourceSansPro.json",
                    props.Selected ? Enum.FontWeight.Bold : Enum.FontWeight.Regular,
                )}
                Text={props.Header}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextScaled={true}
                TextSize={14}
                TextStrokeColor3={Color3.fromRGB(255, 255, 255)}
                TextTransparency={0.24}
                TextWrapped={true}
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.5, 0.5)}
                Size={UDim2.fromScale(1, 0.4)}
            />

            <textbutton
                Size={UDim2.fromScale(1, 1)}
                BackgroundTransparency={1}
                ZIndex={3}
                TextTransparency={1}
                Key={"button1"}
                Event={{
                    MouseButton1Click: props.Clicked
                }}
            />

            <imagelabel
                Image={"rbxassetid://16255699706"}
                ImageColor3={Color3.fromRGB(149, 197, 255)}
                ImageTransparency={0.97}
                ScaleType={Enum.ScaleType.Crop}
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={props.Selected ? Color3.fromRGB(42, 45, 53) : Color3.fromRGB(31, 33, 39)}
                BackgroundTransparency={0.35}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.5, 0.5)}
                Size={UDim2.fromScale(1, 1)}
                ZIndex={0}
                Key={"menu1"}
            >
                <uicorner Key={"UICorner"} />
            </imagelabel>
        </frame>
    )
}

export function StickySubPageTabComponent(props: { Count: number, Size?: UDim2, Ratio?: number } & Roact.PropsWithChildren) {
    return (
        <frame
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            LayoutOrder={-1}
            Position={UDim2.fromScale(0.5, 0.107)}
            Size={props.Size ?? UDim2.fromScale(0.925, 0.053)}
            Key={"sticky1"}
            AnchorPoint={new Vector2(0.5, 0)}
        >
            <uiaspectratioconstraint
                Key={"UIAspectRatioConstraint1"}
                AspectRatio={props.Ratio ?? 21.7}
            />
            
            <frame
                Key={"Frame1"}
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.5, 0.5)}
                Size={UDim2.fromScale(1, 1)}
            >
                <uigridlayout
                    Key={"UIGridLayout1"}
                    CellPadding={UDim2.fromOffset(6, 5)}
                    CellSize={new UDim2(1 / props.Count, -5, 1, 0)}
                    HorizontalAlignment={Enum.HorizontalAlignment.Center}
                    SortOrder={Enum.SortOrder.LayoutOrder}
                    VerticalAlignment={Enum.VerticalAlignment.Center}
                />

                {props[Roact.Children]}
            </frame>
        </frame>
    )
}

export function SubPageTabComponent(props: { Shadow?: UDim2, Size?: UDim2, Header: string, Clicked: () => void }): Roact.Element {
    return <frame
        AnchorPoint={new Vector2(0.5, 0.5)}
        BackgroundColor3={Color3.fromRGB(41, 44, 52)}
        BackgroundTransparency={1}
        BorderColor3={Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        Position={UDim2.fromScale(0.462, 0.5)}
        Size={props.Size ?? UDim2.fromScale(0.32, 1)}
        ZIndex={2}
        Key={"header"}
    >
        <uicorner
            Key={"UICorner"}
            CornerRadius={new UDim(0, 8)}
        />

        <textbutton
            Size={UDim2.fromScale(1, 1)}
            Text={""}
            BackgroundTransparency={1}
            ZIndex={3}
            Key={"button"}
            Event={{
                MouseButton1Click: props.Clicked
            }}
        />

        <textlabel
            Key={"TextLabel"}
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
            TextYAlignment={Enum.TextYAlignment.Bottom}
            AnchorPoint={new Vector2(0.5, 0.5)}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.5, 0.5)}
            Size={UDim2.fromScale(1, 0.3)}
            ZIndex={2}
        />

        <imagelabel
            Image={"rbxassetid://16255699706"}
            ImageColor3={Color3.fromRGB(149, 197, 255)}
            ImageTransparency={0.97}
            ScaleType={Enum.ScaleType.Crop}
            AnchorPoint={new Vector2(0.5, 0.5)}
            BackgroundColor3={Color3.fromRGB(31, 33, 39)}
            BackgroundTransparency={0.35}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.5, 0.5)}
            Size={UDim2.fromScale(1, 1)}
            Key={"menu"}
        >
            <uicorner
                Key={"UICorner"}
                CornerRadius={new UDim(0, 12)}
            />
        </imagelabel>
    </frame>
}

export default function SubPageTabHolderComponent(props: {} & Roact.PropsWithChildren): Roact.Element {
    return (
        <frame
            AnchorPoint={new Vector2(0.5, 0.5)}
            BackgroundColor3={Color3.fromRGB(41, 44, 52)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.506, 0.123)}
            Size={UDim2.fromScale(1, 0.0697)}
            ZIndex={2}
            Key={"tabs"}
        >
            <uilistlayout
                Key={"UIListLayout"}
                HorizontalFlex={Enum.UIFlexAlignment.SpaceEvenly}
                VerticalFlex={Enum.UIFlexAlignment.SpaceEvenly}
                FillDirection={Enum.FillDirection.Horizontal}
                HorizontalAlignment={Enum.HorizontalAlignment.Center}
                SortOrder={Enum.SortOrder.LayoutOrder}
                VerticalAlignment={Enum.VerticalAlignment.Center}
            />

            {props[Roact.Children]}
        </frame>
    )
}

markPureComponent(StickyTabComponent);
markPureComponent(StickySubPageTabComponent);
markPureComponent(SubPageTabComponent);
markPureComponent(SubPageTabHolderComponent);
