import Roact from "@rbxts/roact";
import { markPureComponent, useEffect, useMutable, useRef, withHooks } from "@rbxts/roact-hooked";

export const PopupTableItemComponent = markPureComponent((props: { text: string, count: number, options: string[], visible: boolean, layoutOrder: number, onClick: () => void }): Roact.Element => {
    const isCountEven = props.count % 2 === 0;

    return <frame
        Key={"frame8"}
        BackgroundColor3={!isCountEven ? Color3.fromRGB(255, 255, 255) : Color3.fromRGB(71, 71, 71)}
        BackgroundTransparency={!isCountEven ? 0.95 : 0.85}
        BorderColor3={!isCountEven ? Color3.fromRGB(255, 255, 255) : Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        Position={UDim2.fromScale(0, -3.11e-07)}
        Size={UDim2.fromScale(1, 0.158)}
        Visible={props.visible}
        LayoutOrder={props.layoutOrder}
    >
        <uicorner
            Key={"uICorner4"}
            CornerRadius={new UDim(0, 3)}
        />

        <uicorner
            Key={"uICorner5"}
            CornerRadius={new UDim(0, 3)}
        />

        <imagebutton
            Key={"imageButton1"}
            Image={"rbxassetid://11432859220"}
            ImageTransparency={0.5}
            AnchorPoint={new Vector2(1, 0.5)}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.98, 0.5)}
            Size={UDim2.fromOffset(14, 14)}
        />

        <textbutton
            BackgroundTransparency={1}
            TextTransparency={1}
            Text={""}
            Size={UDim2.fromScale(1, 1)}
            Position={UDim2.fromScale(0, 0)}

            Event={{ MouseButton1Click: props.onClick }}
        />

        <textlabel
            Key={"textLabel9"}
            FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
            Text={props.text}
            TextColor3={Color3.fromRGB(203, 203, 203)}
            TextScaled={true}
            TextSize={14}
            TextTransparency={0.28}
            TextWrapped={true}
            TextXAlignment={Enum.TextXAlignment.Left}
            AnchorPoint={new Vector2(0, 0.5)}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.0255, 0.5)}
            Size={UDim2.fromScale(0.952, 0.5)}
            ZIndex={16}
        />

        <textlabel
            Key={"textLabel10"}
            FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
            Text={props.options[1] || ""}
            TextColor3={Color3.fromRGB(255, 255, 255)}
            TextScaled={true}
            TextSize={14}
            TextTransparency={0.65}
            TextWrapped={true}
            TextXAlignment={Enum.TextXAlignment.Left}
            AnchorPoint={new Vector2(0.5, 0.5)}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.716, 0.436)}
            Size={UDim2.fromScale(0.162, 0.423)}
            ZIndex={16}
        />

        <textlabel
            Key={"textLabel11"}
            FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
            Text={props.options[2] || ""}
            TextColor3={Color3.fromRGB(255, 255, 255)}
            TextScaled={true}
            TextSize={14}
            TextTransparency={0.65}
            TextWrapped={true}
            TextXAlignment={Enum.TextXAlignment.Left}
            AnchorPoint={new Vector2(0.5, 0.5)}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.536, 0.436)}
            Size={UDim2.fromScale(0.103, 0.423)}
            ZIndex={16}
        />

        <textlabel
            Key={"textLabel12"}
            FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
            Text={props.options[0] || ""}
            TextColor3={Color3.fromRGB(255, 255, 255)}
            TextScaled={true}
            TextSize={14}
            TextTransparency={0.65}
            TextWrapped={true}
            TextXAlignment={Enum.TextXAlignment.Left}
            AnchorPoint={new Vector2(0.5, 0.5)}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.859, 0.436)}
            Size={UDim2.fromScale(0.121, 0.423)}
            ZIndex={16}
        />
    </frame>
})

markPureComponent(PopupTableItemComponent);

export const PopupGridComponentWithSearch = withHooks(function (props: { onSearchChanged: (text: string) => void, selectedOrder: number } & Roact.PropsWithChildren): Roact.Element {
    const ref = useRef<TextBox>();
    const connection = useMutable<RBXScriptConnection>();

    useEffect(() => {
        if (!ref.getValue()) return;

        if (connection.current) connection.current.Disconnect();
        connection.current = ref.getValue()!.GetPropertyChangedSignal("Text").Connect(() => {
            props.onSearchChanged(ref.getValue()!.Text);
        })
    }, [ref])

    return (
        <frame
            Key={"container"}
            AnchorPoint={new Vector2(0.5, 0.5)}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.5, 0.551)}
            Size={UDim2.fromScale(0.898, 0.772)}
            ZIndex={12}
        >
            <frame
                Key={"top"}
                BackgroundColor3={Color3.fromRGB(0, 0, 0)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                ClipsDescendants={true}
                Position={UDim2.fromScale(0.0733, 0.162)}
                Size={UDim2.fromScale(1, 0.151)}
                ZIndex={16}
            >
                <frame
                    Key={"frame"}
                    BackgroundColor3={Color3.fromRGB(0, 0, 0)}
                    BackgroundTransparency={0.7}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0, 1.45e-06)}
                    Size={UDim2.fromScale(1, 1.29)}
                >
                    <textlabel
                        Key={"textLabel"}
                        FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                        Text={"Search Enchantments"}
                        TextColor3={Color3.fromRGB(255, 255, 255)}
                        TextScaled={true}
                        TextSize={14}
                        TextTransparency={0.65}
                        TextWrapped={true}
                        TextXAlignment={Enum.TextXAlignment.Right}
                        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                        BackgroundTransparency={1}
                        BorderColor3={Color3.fromRGB(0, 0, 0)}
                        BorderSizePixel={0}
                        Position={UDim2.fromScale(0.266, 0.278)}
                        Size={UDim2.fromScale(0.692, 0.237)}
                        ZIndex={16}
                    />

                    <uicorner
                        Key={"uICorner"}
                        CornerRadius={new UDim(0, 10)}
                    />

                    <uigradient
                        Key={"uIGradient"}
                        Rotation={90}
                        Transparency={new NumberSequence([
                            new NumberSequenceKeypoint(0, 0),
                            new NumberSequenceKeypoint(0.799, 0),
                            new NumberSequenceKeypoint(0.8, 1),
                            new NumberSequenceKeypoint(1, 1),
                        ])}
                    />
                </frame>

                <frame
                    Key={"frame1"}
                    AnchorPoint={new Vector2(0.5, 0.5)}
                    BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                    BackgroundTransparency={1}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.5, 0.5)}
                    Size={UDim2.fromScale(0.95, 0.6)}
                >
                    <uicorner
                        Key={"uICorner1"}
                        CornerRadius={new UDim(1, 0)}
                    />

                    <uistroke
                        Key={"uIStroke"}
                        Color={Color3.fromRGB(255, 255, 255)}
                        Transparency={0.87}
                    />

                    <textbox
                        Key={"textBox"}
                        CursorPosition={-1}
                        FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                        PlaceholderColor3={Color3.fromRGB(130, 130, 130)}
                        PlaceholderText={"Search"}
                        Text={""}
                        TextColor3={Color3.fromRGB(255, 255, 255)}
                        TextScaled={true}
                        TextSize={14}
                        TextWrapped={true}
                        TextXAlignment={Enum.TextXAlignment.Left}
                        AnchorPoint={new Vector2(0, 0.5)}
                        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                        BackgroundTransparency={1}
                        BorderColor3={Color3.fromRGB(0, 0, 0)}
                        BorderSizePixel={0}
                        Position={UDim2.fromScale(0.0327, 0.5)}
                        Size={UDim2.fromScale(0.897, 0.558)}
                        Ref={ref}
                    />
                </frame>
            </frame>

            <uilistlayout
                Key={"uIListLayout"}
                Padding={new UDim(0, 2)}
                SortOrder={Enum.SortOrder.LayoutOrder}
            />

            <frame
                Key={"bottom"}
                BackgroundColor3={Color3.fromRGB(0, 0, 0)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                ClipsDescendants={true}
                Position={UDim2.fromOffset(0, 44)}
                Size={new UDim2(1, 0, 0.695, 42)}
                ZIndex={2}
            >
                <scrollingframe
                    Key={"scrollingFrame"}
                    AutomaticCanvasSize={Enum.AutomaticSize.Y}
                    CanvasSize={new UDim2}
                    ScrollBarImageColor3={Color3.fromRGB(75, 75, 75)}
                    ScrollBarThickness={2}
                    Active={true}
                    AnchorPoint={new Vector2(0.5, 0.5)}
                    BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                    BackgroundTransparency={1}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.5, 0.5)}
                    Size={new UDim2(1, -5, 1, -5)}
                    ZIndex={3}
                >
                    <uipadding
                        Key={"uIPadding"}
                        PaddingBottom={new UDim(0, 5)}
                        PaddingLeft={new UDim(0, 5)}
                        PaddingRight={new UDim(0, 5)}
                        PaddingTop={new UDim(0, 5)}
                    />

                    <uigridlayout
                        Key={"uIGridLayout"}
                        CellPadding={UDim2.fromOffset(4, 4)}
                        CellSize={UDim2.fromScale(0.167, 0.36)}
                        SortOrder={Enum.SortOrder.LayoutOrder}
                    >
                        <uiaspectratioconstraint
                            Key={"uIAspectRatioConstraint"}
                            AspectRatio={0.994}
                        />
                    </uigridlayout>

                    {props[Roact.Children]}
                </scrollingframe>

                <frame
                    Key={"frame2"}
                    AnchorPoint={new Vector2(0, 1)}
                    BackgroundColor3={Color3.fromRGB(0, 0, 0)}
                    BackgroundTransparency={0.7}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0, 1)}
                    Size={UDim2.fromScale(1, 1.29)}
                >
                    <uicorner
                        Key={"uICorner2"}
                        CornerRadius={new UDim(0, 10)}
                    />

                    <uigradient
                        Key={"uIGradient"}
                        Rotation={270}
                        Transparency={new NumberSequence([
                            new NumberSequenceKeypoint(0, 0),
                            new NumberSequenceKeypoint(0.799, 0),
                            new NumberSequenceKeypoint(0.8, 1),
                            new NumberSequenceKeypoint(1, 1),
                        ])}
                    />
                </frame>

                <imagelabel
                    Key={"imageLabel1"}
                    Image={"rbxassetid://17187608773"}
                    ImageTransparency={0.92}
                    ScaleType={Enum.ScaleType.Tile}
                    TileSize={UDim2.fromOffset(30, 30)}
                    AnchorPoint={new Vector2(0.5, 0.5)}
                    BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                    BackgroundTransparency={1}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.5, 0.5)}
                    Size={UDim2.fromScale(1, 1)}
                />
            </frame>
        </frame>
    )
})

export const PopupTableComponentWithSearch = withHooks(function (props: { onSortChanged: (num: number) => void, onSearchChanged: (text: string) => void, options: string[], selectedOrder: number, size?: UDim2, position?: UDim2, anchor?: Vector2 } & Roact.PropsWithChildren): Roact.Element {
    const ref = useRef<TextBox>();
    const connection = useMutable<RBXScriptConnection>();

    useEffect(() => {
        if (!ref.getValue()) return;

        if (connection.current) connection.current.Disconnect();
        connection.current = ref.getValue()!.GetPropertyChangedSignal("Text").Connect(() => {
            props.onSearchChanged(ref.getValue()!.Text);
        })
    }, [ref])

    return (
        <frame
            Key={"container"}
            AnchorPoint={props.anchor ?? new Vector2(0.5, 0.5)}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={props.position ?? UDim2.fromScale(0.5, 0.551)}
            Size={props.size ?? UDim2.fromScale(0.898, 0.772)}
            ZIndex={12}
        >
            <frame
                Key={"top"}
                BackgroundColor3={Color3.fromRGB(0, 0, 0)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                ClipsDescendants={true}
                Position={UDim2.fromScale(0.0733, 0.162)}
                Size={UDim2.fromScale(1, 0.151)}
                ZIndex={16}
            >
                <frame
                    Key={"frame"}
                    BackgroundColor3={Color3.fromRGB(0, 0, 0)}
                    BackgroundTransparency={0.7}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0, 1.45e-06)}
                    Size={UDim2.fromScale(1, 1.29)}
                >
                    <textlabel
                        Key={"textLabel"}
                        FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                        Text={"Search Enchantments"}
                        TextColor3={Color3.fromRGB(255, 255, 255)}
                        TextScaled={true}
                        TextSize={14}
                        TextTransparency={0.65}
                        TextWrapped={true}
                        TextXAlignment={Enum.TextXAlignment.Right}
                        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                        BackgroundTransparency={1}
                        BorderColor3={Color3.fromRGB(0, 0, 0)}
                        BorderSizePixel={0}
                        Position={UDim2.fromScale(0.266, 0.278)}
                        Size={UDim2.fromScale(0.692, 0.237)}
                        ZIndex={16}
                    />

                    <uicorner
                        Key={"uICorner"}
                        CornerRadius={new UDim(0, 10)}
                    />

                    <uigradient
                        Key={"uIGradient"}
                        Rotation={90}
                        Transparency={new NumberSequence([
                            new NumberSequenceKeypoint(0, 0),
                            new NumberSequenceKeypoint(0.799, 0),
                            new NumberSequenceKeypoint(0.8, 1),
                            new NumberSequenceKeypoint(1, 1),
                        ])}
                    />
                </frame>

                <frame
                    Key={"frame1"}
                    AnchorPoint={new Vector2(0.5, 0.5)}
                    BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                    BackgroundTransparency={1}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.5, 0.5)}
                    Size={UDim2.fromScale(0.95, 0.6)}
                >
                    <uicorner
                        Key={"uICorner1"}
                        CornerRadius={new UDim(1, 0)}
                    />

                    <uistroke
                        Key={"uIStroke"}
                        Color={Color3.fromRGB(255, 255, 255)}
                        Transparency={0.87}
                    />

                    <textbox
                        Key={"textBox"}
                        CursorPosition={-1}
                        FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                        PlaceholderColor3={Color3.fromRGB(130, 130, 130)}
                        PlaceholderText={"Search"}
                        Text={""}
                        TextColor3={Color3.fromRGB(255, 255, 255)}
                        TextScaled={true}
                        TextSize={14}
                        TextWrapped={true}
                        TextXAlignment={Enum.TextXAlignment.Left}
                        AnchorPoint={new Vector2(0, 0.5)}
                        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                        BackgroundTransparency={1}
                        BorderColor3={Color3.fromRGB(0, 0, 0)}
                        BorderSizePixel={0}
                        Position={UDim2.fromScale(0.0327, 0.5)}
                        Size={UDim2.fromScale(0.897, 0.558)}
                        Ref={ref}
                    />
                </frame>
            </frame>

            <uilistlayout
                Key={"uIListLayout"}
                Padding={new UDim(0, 2)}
                SortOrder={Enum.SortOrder.LayoutOrder}
                VerticalAlignment={Enum.VerticalAlignment.Top}
            />

            <frame
                Key={"middle"}
                BackgroundColor3={Color3.fromRGB(0, 0, 0)}
                BackgroundTransparency={0.7}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0, 0.165)}
                Size={UDim2.fromScale(1, 0.104)}
                ZIndex={16}
            >
                <frame
                    Key={"right"}
                    AnchorPoint={new Vector2(0.5, 0.5)}
                    BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                    BackgroundTransparency={1}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.5, 0.5)}
                    Size={UDim2.fromScale(1, 1)}
                >
                    <frame
                        Key={"frame2"}
                        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                        BackgroundTransparency={1}
                        BorderColor3={Color3.fromRGB(0, 0, 0)}
                        BorderSizePixel={0}
                        Position={UDim2.fromScale(0.534, 0.069)}
                        Size={UDim2.fromScale(0.0857, 0.862)}
                        LayoutOrder={0}
                    >
                        <textbutton
                            BackgroundTransparency={1}
                            BorderSizePixel={0}
                            Position={UDim2.fromScale(0.5, 0.5)}
                            Size={UDim2.fromScale(1, 1)}
                            AnchorPoint={new Vector2(0.5, 0.5)}
                            TextTransparency={1}
                            Text={""}
                            Event={{ MouseButton1Click: () => props.onSortChanged(2) }}
                        />
                        <textlabel
                            Key={"textLabel1"}
                            FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                            Text={props.options[2]}
                            TextColor3={Color3.fromRGB(255, 255, 255)}
                            TextScaled={true}
                            TextSize={14}
                            TextTransparency={0.65}
                            TextWrapped={true}
                            TextXAlignment={Enum.TextXAlignment.Left}
                            AnchorPoint={new Vector2(0.5, 0.5)}
                            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                            BackgroundTransparency={1}
                            BorderColor3={Color3.fromRGB(0, 0, 0)}
                            BorderSizePixel={0}
                            Position={UDim2.fromScale(0.5, 0.5)}
                            Size={UDim2.fromScale(1, 0.5)}
                            ZIndex={16}
                        />

                        <imagelabel
                            Key={"imageLabel"}
                            Image={props.selectedOrder === 2 ? "rbxassetid://11421092947" : "rbxassetid://11421095840"}
                            ImageTransparency={0.5}
                            AnchorPoint={new Vector2(1, 0.5)}
                            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                            BackgroundTransparency={1}
                            BorderColor3={Color3.fromRGB(0, 0, 0)}
                            BorderSizePixel={0}
                            Position={UDim2.fromScale(1, 0.5)}
                            Size={UDim2.fromScale(0.275, 0.44)}
                        />
                    </frame>

                    <uilistlayout
                        Key={"uIListLayout1"}
                        Padding={new UDim(0.08, 0)}
                        FillDirection={Enum.FillDirection.Horizontal}
                        HorizontalAlignment={Enum.HorizontalAlignment.Right}
                        SortOrder={Enum.SortOrder.LayoutOrder}
                        VerticalAlignment={Enum.VerticalAlignment.Center}
                    />

                    <uipadding
                        Key={"uIPadding"}
                        PaddingLeft={new UDim(0, 10)}
                        PaddingRight={new UDim(0.1, 0)}
                    />

                    <frame
                        Key={"frame3"}
                        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                        BackgroundTransparency={1}
                        BorderColor3={Color3.fromRGB(0, 0, 0)}
                        BorderSizePixel={0}
                        Position={UDim2.fromScale(0.7, 0.069)}
                        Size={UDim2.fromScale(0.102, 0.862)}
                        LayoutOrder={1}
                    >
                        <textbutton
                            BackgroundTransparency={1}
                            BorderSizePixel={0}
                            Position={UDim2.fromScale(0.5, 0.5)}
                            Size={UDim2.fromScale(1, 1)}
                            AnchorPoint={new Vector2(0.5, 0.5)}
                            TextTransparency={1}
                            Text={""}
                            Event={{ MouseButton1Click: () => props.onSortChanged(1) }}
                        />
                        <textlabel
                            Key={"textLabel2"}
                            FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                            Text={props.options[1]}
                            TextColor3={Color3.fromRGB(255, 255, 255)}
                            TextScaled={true}
                            TextSize={14}
                            TextTransparency={0.65}
                            TextWrapped={true}
                            TextXAlignment={Enum.TextXAlignment.Left}
                            AnchorPoint={new Vector2(0.5, 0.5)}
                            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                            BackgroundTransparency={1}
                            BorderColor3={Color3.fromRGB(0, 0, 0)}
                            BorderSizePixel={0}
                            Position={UDim2.fromScale(0.5, 0.5)}
                            Size={UDim2.fromScale(1, 0.5)}
                            ZIndex={16}
                        />

                        <imagelabel
                            Key={"imageLabel1"}
                            Image={props.selectedOrder === 1 ? "rbxassetid://11421092947" : "rbxassetid://11421095840"}
                            ImageTransparency={0.5}
                            AnchorPoint={new Vector2(1, 0.5)}
                            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                            BackgroundTransparency={1}
                            BorderColor3={Color3.fromRGB(0, 0, 0)}
                            BorderSizePixel={0}
                            Position={UDim2.fromScale(1, 0.5)}
                            Size={UDim2.fromScale(0.234, 0.44)}
                        />
                    </frame>

                    <frame
                        Key={"frame4"}
                        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                        BackgroundTransparency={1}
                        BorderColor3={Color3.fromRGB(0, 0, 0)}
                        BorderSizePixel={0}
                        Position={UDim2.fromScale(0.881, 0.069)}
                        Size={UDim2.fromScale(0.119, 0.862)}
                        LayoutOrder={2}
                    >
                        <textbutton
                            BackgroundTransparency={1}
                            BorderSizePixel={0}
                            Position={UDim2.fromScale(0.5, 0.5)}
                            Size={UDim2.fromScale(1, 1)}
                            AnchorPoint={new Vector2(0.5, 0.5)}
                            TextTransparency={1}
                            Text={""}
                            Event={{ MouseButton1Click: () => props.onSortChanged(0) }}
                        />
                        <textlabel
                            Key={"textLabel3"}
                            FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                            Text={props.options[0]}
                            TextColor3={Color3.fromRGB(255, 255, 255)}
                            TextScaled={true}
                            TextSize={14}
                            TextTransparency={0.65}
                            TextWrapped={true}
                            TextXAlignment={Enum.TextXAlignment.Left}
                            AnchorPoint={new Vector2(0.5, 0.5)}
                            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                            BackgroundTransparency={1}
                            BorderColor3={Color3.fromRGB(0, 0, 0)}
                            BorderSizePixel={0}
                            Position={UDim2.fromScale(0.5, 0.5)}
                            Size={UDim2.fromScale(1, 0.5)}
                            ZIndex={16}
                        />

                        <imagelabel
                            Key={"imageLabel2"}
                            Image={props.selectedOrder === 0 ? "rbxassetid://11421092947" : "rbxassetid://11421095840"}
                            ImageTransparency={0.5}
                            AnchorPoint={new Vector2(1, 0.5)}
                            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                            BackgroundTransparency={1}
                            BorderColor3={Color3.fromRGB(0, 0, 0)}
                            BorderSizePixel={0}
                            Position={UDim2.fromScale(1, 0.5)}
                            Size={UDim2.fromScale(0.198, 0.44)}
                        />
                    </frame>
                </frame>

                <frame
                    Key={"left"}
                    AnchorPoint={new Vector2(0.5, 0.5)}
                    BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                    BackgroundTransparency={1}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.52, 0.5)}
                    Size={UDim2.fromScale(0.961, 1)}
                >
                    <frame
                        Key={"frame5"}
                        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                        BackgroundTransparency={1}
                        BorderColor3={Color3.fromRGB(0, 0, 0)}
                        BorderSizePixel={0}
                        Position={UDim2.fromScale(0.7, 0.067)}
                        Size={UDim2.fromScale(0.105, 0.862)}
                    >
                        <textlabel
                            Key={"textLabel4"}
                            FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                            Text={"Name"}
                            TextColor3={Color3.fromRGB(255, 255, 255)}
                            TextScaled={true}
                            TextSize={14}
                            TextTransparency={0.65}
                            TextWrapped={true}
                            TextXAlignment={Enum.TextXAlignment.Left}
                            AnchorPoint={new Vector2(0.5, 0.5)}
                            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                            BackgroundTransparency={1}
                            BorderColor3={Color3.fromRGB(0, 0, 0)}
                            BorderSizePixel={0}
                            Position={UDim2.fromScale(0.5, 0.5)}
                            Size={UDim2.fromScale(1, 0.5)}
                            ZIndex={16}
                        />
                    </frame>

                    <uipadding
                        Key={"uIPadding1"}
                        PaddingRight={new UDim(0, 10)}
                    />

                    <uilistlayout
                        Key={"uIListLayout2"}
                        Padding={new UDim(0.07, 0)}
                        FillDirection={Enum.FillDirection.Horizontal}
                        SortOrder={Enum.SortOrder.LayoutOrder}
                        VerticalAlignment={Enum.VerticalAlignment.Center}
                    />
                </frame>
            </frame>

            <frame
                Key={"bottom"}
                BackgroundColor3={Color3.fromRGB(0, 0, 0)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                ClipsDescendants={true}
                Position={UDim2.fromOffset(0, 79)}
                Size={new UDim2(1, 0, 0.572, 42)}
                ZIndex={16}
            >
                <frame
                    Key={"frame6"}
                    AnchorPoint={new Vector2(0, 1)}
                    BackgroundColor3={Color3.fromRGB(0, 0, 0)}
                    BackgroundTransparency={0.7}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0, 1)}
                    Size={UDim2.fromScale(1, 1.29)}
                >
                    <uicorner
                        Key={"uICorner2"}
                        CornerRadius={new UDim(0, 10)}
                    />

                    <uigradient
                        Key={"uIGradient1"}
                        Rotation={270}
                        Transparency={new NumberSequence([
                            new NumberSequenceKeypoint(0, 0),
                            new NumberSequenceKeypoint(0.799, 0),
                            new NumberSequenceKeypoint(0.8, 1),
                            new NumberSequenceKeypoint(1, 1),
                        ])}
                    />
                </frame>

                <scrollingframe
                    Key={"scrollingFrame"}
                    AutomaticCanvasSize={Enum.AutomaticSize.Y}
                    CanvasSize={new UDim2}
                    ScrollBarImageColor3={Color3.fromRGB(75, 75, 75)}
                    ScrollBarThickness={2}
                    Active={true}
                    AnchorPoint={new Vector2(0.5, 0.5)}
                    BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                    BackgroundTransparency={1}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.5, 0.5)}
                    Size={new UDim2(1, -5, 1, -5)}
                >

                    {props[Roact.Children]}

                    <uipadding
                        Key={"uIPadding2"}
                        PaddingBottom={new UDim(0, 5)}
                        PaddingLeft={new UDim(0, 5)}
                        PaddingRight={new UDim(0, 5)}
                        PaddingTop={new UDim(0, 5)}
                    />

                    <frame
                        BackgroundTransparency={1}
                        Size={UDim2.fromScale(1, 0.04)}
                    />


                    <uilistlayout
                        Key={"uIListLayout3"}
                        Padding={new UDim(0, 1)}
                        HorizontalAlignment={Enum.HorizontalAlignment.Center}
                        SortOrder={Enum.SortOrder.LayoutOrder}
                    />
                </scrollingframe>
            </frame>
        </frame>
    )
})