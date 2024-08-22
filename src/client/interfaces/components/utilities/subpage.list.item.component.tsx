import Roact from "@rbxts/roact";

export function SubpageItemPillComponent(props: { Text: string, Color: Color3 }) {
    return <textbutton
        FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
        RichText={true}
        Text={props.Text}
        TextColor3={props.Color}
        TextSize={14}
        AnchorPoint={new Vector2(1, 0.5)}
        AutomaticSize={Enum.AutomaticSize.X}
        BackgroundColor3={Color3.fromRGB(0, 0, 0)}
        BackgroundTransparency={0.95}
        BorderColor3={Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        LayoutOrder={1}
        Position={UDim2.fromScale(0.877, 0.477)}
        Size={UDim2.fromScale(0.0398, 1)}
        ZIndex={6}
    >
        <uipadding
            Key={"UIPadding1"}
            PaddingBottom={new UDim(0.2, 0)}
            PaddingLeft={new UDim(0, 10)}
            PaddingRight={new UDim(0, 10)}
            PaddingTop={new UDim(0.2, 0)}
        />

        <uistroke
            Key={"UIStroke1"}
            ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
            Color={props.Color}
            Transparency={0.76}
        />

        <uicorner Key={"UICorner"} />
    </textbutton>
}

export default function SubpageItemListComponent(props: { Header: string, Body: string, LayoutOrder?: number, Arrow?: boolean, Clicked?: () => void } & Roact.PropsWithChildren): Roact.Element {
    return (
        <frame
            BackgroundColor3={Color3.fromRGB(41, 42, 48)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(2.07e-07, -1.96e-08)}
            Size={UDim2.fromScale(0.962, 0.07)}
            Key={"log1"}
            LayoutOrder={props.LayoutOrder ?? 1}
        >
            <uicorner
                Key={"UICorner1"}
                CornerRadius={new UDim(0.2, 0)}
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
                Key={"menu1"}
                ZIndex={0}
            >
                <uicorner
                    Key={"UICorner1"}
                    CornerRadius={new UDim(0.2, 0)}
                />
            </imagelabel>

            <frame
                AnchorPoint={new Vector2(0, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.051, 0.5)}
                Size={UDim2.fromScale(0.5, 0.343)}
                Key={"data1"}
            >
                <uilistlayout
                    Key={"UIListLayout1"}
                    Padding={new UDim(0.02, 0)}
                    FillDirection={Enum.FillDirection.Horizontal}
                    SortOrder={Enum.SortOrder.LayoutOrder}
                    VerticalAlignment={Enum.VerticalAlignment.Center}
                />

                <textlabel
                    FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                    RichText={true}
                    Text={props.Header}
                    TextColor3={Color3.fromRGB(255, 255, 255)}
                    TextScaled={true}
                    TextSize={14}
                    TextTransparency={0.36}
                    TextWrapped={true}
                    TextXAlignment={Enum.TextXAlignment.Left}
                    TextYAlignment={Enum.TextYAlignment.Bottom}
                    AutomaticSize={Enum.AutomaticSize.X}
                    BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                    BackgroundTransparency={1}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    LayoutOrder={0}
                    Position={UDim2.fromScale(0.0512, 0.321)}
                    Size={UDim2.fromScale(0, 1)}
                    ZIndex={2}
                    Key={"name1"}
                />

                {props[Roact.Children]}
            </frame>

            <textlabel
                Key={"TextLabel1"}
                FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                RichText={true}
                Text={props.Body}
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
                Position={UDim2.fromScale(props.Arrow ? 0.3 : 0.342, 0.321)}
                Size={UDim2.fromScale(0.625, 0.343)}
                ZIndex={2}
            />

            {props.Arrow && (
                <imagelabel
                    Key={"ImageLabel1"}
                    Image={"rbxassetid://11422142913"}
                    ImageTransparency={0.24}
                    AnchorPoint={new Vector2(0.5, 0.5)}
                    BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                    BackgroundTransparency={1}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.941, 0.482)}
                    Size={UDim2.fromScale(0.0171, 0.306)}
                    ZIndex={2}
                >
                    <uiaspectratioconstraint
                        Key={"UIAspectRatioConstraint1"}
                        AspectRatio={1.02}
                    />
                </imagelabel>
            )}

            {props.Clicked && (
                <textbutton 
                    Size={UDim2.fromScale(1, 1)}
                    BackgroundTransparency={1}
                    TextTransparency={1}
                    Text=""
                    ZIndex={4}
                    Event={{
                        MouseButton1Down: () => {
                            print("Clicked")
                            props.Clicked?.();
                        }
                    }}
                />
            )}
        </frame>
    )

}