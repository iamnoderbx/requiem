import Roact, { PropsWithChildren } from "@rbxts/roact";
import { markPureComponent } from "@rbxts/roact-hooked";

export function ImageListItemComponent(props: { Image: string, Text: string, Description: string, Clicked: () => void, top?: boolean }): Roact.Element {
    return <frame
        Key={"Frame"}
        BackgroundColor3={Color3.fromRGB(41, 42, 48)}
        BackgroundTransparency={1}
        BorderColor3={Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        Position={UDim2.fromScale(2.07e-07, -1.96e-08)}
        Size={UDim2.fromScale(0.962, 0.07)}
    >
        <uicorner
            Key={"UICorner"}
            CornerRadius={new UDim(0.2, 0)}
        />

        <textbutton 
            Size={UDim2.fromScale(1, 1)}
            Text={""}
            BackgroundTransparency={1}
            ZIndex={3}
            TextTransparency={1}
            Event={{MouseButton1Click: props.Clicked}}
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
                CornerRadius={new UDim(0.2, 0)}
            />
        </imagelabel>

        <imagelabel
            Key={"ImageLabel4"}
            Image={"rbxassetid://11422142913"}
            ImageTransparency={0.24}
            AnchorPoint={new Vector2(0.5, 0.5)}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.971, 0.482)}
            Size={UDim2.fromScale(0.0171, 0.306)}
            ZIndex={2}
        >
            <uiaspectratioconstraint
                Key={"UIAspectRatioConstraint"}
                AspectRatio={1.02}
            />
        </imagelabel>

        <textlabel
            Key={"TextLabel1"}
            FontFace={new Font(
                "rbxasset://fonts/families/SourceSansPro.json",
                Enum.FontWeight.Bold,
                Enum.FontStyle.Normal
            )}
            Text={props.Text}
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
            Position={UDim2.fromScale(0.0512, 0.321)}
            Size={UDim2.fromScale(0.236, 0.343)}
            ZIndex={2}
        />

        <imagelabel
            Key={"ImageLabel2"}
            Image={props.Image}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.021, 0.3)}
            Size={UDim2.fromScale(0.022, 0.395)}
            ZIndex={2}
        >
            <uiaspectratioconstraint
                Key={"UIAspectRatioConstraint"}
                AspectRatio={1.02}
            />
        </imagelabel>

        <textlabel
            Key={"TextLabel3"}
            FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
            Text={props.Description}
            TextColor3={Color3.fromRGB(255, 255, 255)}
            TextScaled={true}
            TextSize={14}
            TextTransparency={0.67}
            TextWrapped={true}
            TextXAlignment={Enum.TextXAlignment.Right}
            TextYAlignment={Enum.TextYAlignment.Bottom}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.767, 0.321)}
            Size={UDim2.fromScale(0.179, 0.343)}
            ZIndex={2}
        />
    </frame>
}

export function ListLayoutConstraint(): Roact.Element {
    return <uilistlayout
        Key={"uIListLayout"}
        Padding={new UDim(0, 4)}
        SortOrder={Enum.SortOrder.LayoutOrder}
    />
}

export function VerticalListLayout(props : {Padding?: number, HorizontalAlignment?: Enum.HorizontalAlignment}) : Roact.Element {
    return <uilistlayout
        Key={"UIListLayout1"}
        Padding={new UDim(0, props.Padding ?? 3)}
        SortOrder={Enum.SortOrder.LayoutOrder}
        HorizontalAlignment={props.HorizontalAlignment ?? Enum.HorizontalAlignment.Left}
    />
}

export function LargePopupItemListComponent(props: { size: UDim2, position: UDim2 } & PropsWithChildren): Roact.Element {
    return <frame
        Key={"container"}
        AnchorPoint={new Vector2(0.5, 0.5)}
        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
        BackgroundTransparency={1}
        BorderColor3={Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        Position={props.position}
        Size={props.size}
        ZIndex={12}
    >
        <uilistlayout
            Key={"uIListLayout"}
            Padding={new UDim(0, 4)}
            SortOrder={Enum.SortOrder.LayoutOrder}
        />

        {props[Roact.Children]}
    </frame>
}

export default function PopupItemListComponent(props: { size: UDim2, position: UDim2 } & PropsWithChildren): Roact.Element {

    return <frame
        Key={"container"}
        AnchorPoint={new Vector2(0.5, 0.5)}
        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
        BackgroundTransparency={1}
        BorderColor3={Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        Position={props.position}
        Size={props.size ?? UDim2.fromScale(0.824, 0.375)}
        ZIndex={12}
    >
        <uilistlayout
            Key={"uIListLayout"}
            Padding={new UDim(0, 4)}
            SortOrder={Enum.SortOrder.LayoutOrder}
        />

        <uiaspectratioconstraint
            Key={"uIAspectRatioConstraint"}
            AspectRatio={2.39}
        />

        {props[Roact.Children]}
    </frame>
}

markPureComponent(ImageListItemComponent);
markPureComponent(ListLayoutConstraint);
markPureComponent(PopupItemListComponent);
markPureComponent(LargePopupItemListComponent);
