import Roact from "@rbxts/roact";
import { markPureComponent } from "@rbxts/roact-hooked";

export function FourCardTabSelection(props: { cardA: string, cardB: string, cardC: string, cardD: string, selected: number, onSelected: (index: number) => void }): Roact.Element {
    return (
        <frame
            Key={"top"}
            BackgroundColor3={Color3.fromRGB(0, 0, 0)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            ClipsDescendants={true}
            LayoutOrder={-1}
            Size={UDim2.fromScale(1, 0.111)}
            ZIndex={16}
        >
            <frame
                Key={"frame"}
                BackgroundColor3={Color3.fromRGB(0, 0, 0)}
                BackgroundTransparency={0.9}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0, 1.45e-06)}
                Size={UDim2.fromScale(1, 1.29)}
            >
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
                ClipsDescendants={true}
                Position={UDim2.fromScale(0.5, 0.5)}
                Size={UDim2.fromScale(1, 0.902)}
            >
                <frame
                    Key={"frame2"}
                    BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                    BackgroundTransparency={1}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    ClipsDescendants={true}
                    Position={UDim2.fromScale(0, -0.0467)}
                    Size={new UDim2(0.25, -2, 1.2, 0)}
                    LayoutOrder={0}
                >
                    <frame
                        Key={"frame3"}
                        BackgroundColor3={props.selected === 0 ? Color3.fromRGB(255, 255, 255) : Color3.fromRGB(121, 121, 121)}
                        BackgroundTransparency={0.9}
                        BorderColor3={Color3.fromRGB(0, 0, 0)}
                        BorderSizePixel={0}
                        Position={UDim2.fromScale(0, -0.0467)}
                        Size={UDim2.fromScale(1.1, 1.28)}
                    >
                        <uicorner
                            Key={"iCorner"}
                            CornerRadius={new UDim(0, 15)}
                        />
                        <textbutton
                            BackgroundTransparency={1}
                            TextTransparency={1}
                            Size={UDim2.fromScale(1, 1)}
                            Event={{
                                MouseButton1Click: () => props.onSelected(0)
                            }}
                        />
                    </frame>

                    <textlabel
                        Key={"textLabel"}
                        FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                        Text={props.cardA}
                        TextColor3={Color3.fromRGB(255, 255, 255)}
                        TextScaled={true}
                        TextSize={14}
                        TextTransparency={props.selected === 0 ? 0.28 : 0.48}
                        TextWrapped={true}
                        AnchorPoint={new Vector2(0.5, 0.5)}
                        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                        BackgroundTransparency={1}
                        BorderColor3={Color3.fromRGB(0, 0, 0)}
                        BorderSizePixel={0}
                        Position={UDim2.fromScale(0.5, 0.446)}
                        Size={UDim2.fromScale(0.716, 0.403)}
                        ZIndex={16}
                    />
                </frame>

                <uilistlayout
                    Key={"uIListLayout"}
                    Padding={new UDim(0, 2)}
                    FillDirection={Enum.FillDirection.Horizontal}
                    HorizontalAlignment={Enum.HorizontalAlignment.Center}
                    SortOrder={Enum.SortOrder.LayoutOrder}
                />

                <uicorner
                    Key={"iCorner1"}
                    CornerRadius={new UDim(0, 15)}
                />

                <frame
                    Key={"frame4"}
                    BackgroundColor3={props.selected === 1 ? Color3.fromRGB(255, 255, 255) : Color3.fromRGB(121, 121, 121)}
                    BackgroundTransparency={0.9}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0, -0.0467)}
                    Size={new UDim2(0.25, -2, 1.2, 0)}
                    LayoutOrder={1}
                >
                    <textbutton
                        BackgroundTransparency={1}
                        TextTransparency={1}
                        Size={UDim2.fromScale(1, 1)}
                        Event={{
                            MouseButton1Click: () => props.onSelected(1)
                        }}
                    />
                    <textlabel
                        Key={"textLabel1"}
                        FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                        Text={props.cardB}
                        TextColor3={Color3.fromRGB(255, 255, 255)}
                        TextScaled={true}
                        TextSize={14}
                        TextTransparency={props.selected === 1 ? 0.28 : 0.48}
                        TextWrapped={true}
                        AnchorPoint={new Vector2(0.5, 0.5)}
                        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                        BackgroundTransparency={1}
                        BorderColor3={Color3.fromRGB(0, 0, 0)}
                        BorderSizePixel={0}
                        Position={UDim2.fromScale(0.5, 0.446)}
                        Size={UDim2.fromScale(0.716, 0.403)}
                        ZIndex={16}
                    />
                </frame>

                <frame
                    Key={"frame5"}
                    BackgroundColor3={props.selected === 2 ? Color3.fromRGB(255, 255, 255) : Color3.fromRGB(121, 121, 121)}
                    BackgroundTransparency={0.9}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0, -0.0467)}
                    Size={new UDim2(0.25, -2, 1.2, 0)}
                    LayoutOrder={2}
                >
                    <textbutton
                        BackgroundTransparency={1}
                        TextTransparency={1}
                        Size={UDim2.fromScale(1, 1)}
                        Event={{
                            MouseButton1Click: () => props.onSelected(2)
                        }}
                    />
                    <textlabel
                        Key={"textLabel2"}
                        FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                        Text={props.cardC}
                        TextColor3={Color3.fromRGB(255, 255, 255)}
                        TextScaled={true}
                        TextSize={14}
                        TextTransparency={props.selected === 2 ? 0.28 : 0.48}
                        TextWrapped={true}
                        AnchorPoint={new Vector2(0.5, 0.5)}
                        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                        BackgroundTransparency={1}
                        BorderColor3={Color3.fromRGB(0, 0, 0)}
                        BorderSizePixel={0}
                        Position={UDim2.fromScale(0.5, 0.446)}
                        Size={UDim2.fromScale(0.716, 0.403)}
                        ZIndex={16}
                    />
                </frame>

                <frame
                    Key={"frame6"}
                    BackgroundColor3={Color3.fromRGB(0, 0, 0)}
                    BackgroundTransparency={1}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    ClipsDescendants={true}
                    Position={UDim2.fromScale(0, -0.0467)}
                    Size={new UDim2(0.25, -2, 1.2, 0)}
                    LayoutOrder={3}
                >
                    <frame
                        Key={"frame7"}
                        BackgroundColor3={props.selected === 3 ? Color3.fromRGB(255, 255, 255) : Color3.fromRGB(121, 121, 121)}
                        BackgroundTransparency={0.9}
                        BorderColor3={Color3.fromRGB(0, 0, 0)}
                        BorderSizePixel={0}
                        Position={UDim2.fromScale(-0.114, -0.0467)}
                        Size={UDim2.fromScale(1.11, 1.28)}
                    >
                        <uicorner
                            Key={"iCorner2"}
                            CornerRadius={new UDim(0, 15)}
                        />
                    </frame>

                    <textbutton
                        BackgroundTransparency={1}
                        TextTransparency={1}
                        Size={UDim2.fromScale(1, 1)}
                        Event={{
                            MouseButton1Click: () => props.onSelected(3)
                        }}
                    />

                    <textlabel
                        Key={"textLabel3"}
                        FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                        Text={props.cardD}
                        TextColor3={Color3.fromRGB(255, 255, 255)}
                        TextScaled={true}
                        TextSize={14}
                        TextTransparency={props.selected === 3 ? 0.28 : 0.48}
                        TextWrapped={true}
                        AnchorPoint={new Vector2(0.5, 0.5)}
                        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                        BackgroundTransparency={1}
                        BorderColor3={Color3.fromRGB(0, 0, 0)}
                        BorderSizePixel={0}
                        Position={UDim2.fromScale(0.5, 0.446)}
                        Size={UDim2.fromScale(0.716, 0.403)}
                        ZIndex={16}
                    />
                </frame>
            </frame>
        </frame>
    )
}

export default function ThreeCardTabSelection(props: { cardA: string, cardB: string, cardC: string, selected: number, onSelected: (index: number) => void, height?: number}): Roact.Element {
    return (
        <frame
            Key={"top"}
            BackgroundColor3={Color3.fromRGB(0, 0, 0)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            ClipsDescendants={true}
            LayoutOrder={-1}
            Position={UDim2.fromScale(0.0733, 0.162)}
            Size={UDim2.fromScale(1, props.height || 0.151)}
            ZIndex={16}
        >
            <frame
                Key={"frame"}
                BackgroundColor3={Color3.fromRGB(0, 0, 0)}
                BackgroundTransparency={0.9}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0, 1.45e-06)}
                Size={UDim2.fromScale(1, 1.29)}
            >
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
                ClipsDescendants={true}
                Position={UDim2.fromScale(0.5, 0.5)}
                Size={new UDim2(1, 0, 1, -4)}
            >
                <frame
                    Key={"frame2"}
                    BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                    BackgroundTransparency={1}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    ClipsDescendants={true}
                    Position={UDim2.fromScale(0, -0.0467)}
                    Size={new UDim2(0.333, -2, 1.2, 0)}
                    LayoutOrder={0}
                >
                    <frame
                        Key={"frame3"}
                        BackgroundColor3={props.selected === 0 ? Color3.fromRGB(255, 255, 255) : Color3.fromRGB(121, 121, 121)}
                        BackgroundTransparency={0.9}
                        BorderColor3={Color3.fromRGB(0, 0, 0)}
                        BorderSizePixel={0}
                        Position={UDim2.fromScale(0, -0.0467)}
                        Size={UDim2.fromScale(1.1, 1.28)}
                    >
                        <uicorner
                            Key={"iCorner"}
                            CornerRadius={new UDim(0, 15)}
                        />
                    </frame>

                    <textbutton
                        BackgroundTransparency={1}
                        TextTransparency={1}
                        Size={UDim2.fromScale(1, 1)}
                        Event={{
                            MouseButton1Click: () => props.onSelected(0)
                        }}
                    />

                    <textlabel
                        Key={"textLabel"}
                        FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                        Text={props.cardA}
                        TextColor3={Color3.fromRGB(255, 255, 255)}
                        TextScaled={true}
                        TextSize={14}
                        TextTransparency={props.selected === 0 ? 0.28 : 0.48}
                        TextWrapped={true}
                        AnchorPoint={new Vector2(0.5, 0.5)}
                        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                        BackgroundTransparency={1}
                        BorderColor3={Color3.fromRGB(0, 0, 0)}
                        BorderSizePixel={0}
                        Position={UDim2.fromScale(0.5, 0.446)}
                        Size={UDim2.fromScale(0.716, 0.403)}
                        ZIndex={16}
                    />
                </frame>

                <uilistlayout
                    Key={"uIListLayout"}
                    Padding={new UDim(0, 2)}
                    FillDirection={Enum.FillDirection.Horizontal}
                    HorizontalAlignment={Enum.HorizontalAlignment.Center}
                    SortOrder={Enum.SortOrder.LayoutOrder}
                />

                <uicorner
                    Key={"iCorner1"}
                    CornerRadius={new UDim(0, 15)}
                />

                <frame
                    Key={"frame4"}
                    BackgroundColor3={props.selected === 1 ? Color3.fromRGB(255, 255, 255) : Color3.fromRGB(121, 121, 121)}
                    BackgroundTransparency={0.9}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0, -0.0467)}
                    Size={new UDim2(0.333, -2, 1.2, 0)}
                    LayoutOrder={1}
                >
                    <textbutton
                        BackgroundTransparency={1}
                        TextTransparency={1}
                        Size={UDim2.fromScale(1, 1)}
                        Event={{
                            MouseButton1Click: () => props.onSelected(1)
                        }}
                    />

                    <textlabel
                        Key={"textLabel1"}
                        FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                        Text={props.cardB}
                        TextColor3={Color3.fromRGB(255, 255, 255)}
                        TextScaled={true}
                        TextSize={14}
                        TextTransparency={props.selected === 1 ? 0.28 : 0.48}
                        TextWrapped={true}
                        AnchorPoint={new Vector2(0.5, 0.5)}
                        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                        BackgroundTransparency={1}
                        BorderColor3={Color3.fromRGB(0, 0, 0)}
                        BorderSizePixel={0}
                        Position={UDim2.fromScale(0.5, 0.446)}
                        Size={UDim2.fromScale(0.716, 0.403)}
                        ZIndex={16}
                    />
                </frame>

                <frame
                    Key={"frame5"}
                    BackgroundColor3={Color3.fromRGB(0, 0, 0)}
                    BackgroundTransparency={1}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    ClipsDescendants={true}
                    Position={UDim2.fromScale(0, -0.0467)}
                    Size={new UDim2(0.333, -2, 1.2, 0)}
                    LayoutOrder={2}
                >
                    <frame
                        Key={"frame6"}
                        BackgroundColor3={props.selected === 2 ? Color3.fromRGB(255, 255, 255) : Color3.fromRGB(121, 121, 121)}
                        BackgroundTransparency={0.9}
                        BorderColor3={Color3.fromRGB(0, 0, 0)}
                        BorderSizePixel={0}
                        Position={UDim2.fromScale(-0.114, -0.0467)}
                        Size={UDim2.fromScale(1.11, 1.28)}
                    >
                        <uicorner
                            Key={"iCorner2"}
                            CornerRadius={new UDim(0, 15)}
                        />
                    </frame>

                    <textbutton
                        BackgroundTransparency={1}
                        TextTransparency={1}
                        Size={UDim2.fromScale(1, 1)}
                        Event={{
                            MouseButton1Click: () => props.onSelected(2)
                        }}
                    />

                    <textlabel
                        Key={"textLabel2"}
                        FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                        Text={props.cardC}
                        TextColor3={Color3.fromRGB(255, 255, 255)}
                        TextScaled={true}
                        TextSize={14}
                        TextTransparency={props.selected === 2 ? 0.28 : 0.48}
                        TextWrapped={true}
                        AnchorPoint={new Vector2(0.5, 0.5)}
                        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                        BackgroundTransparency={1}
                        BorderColor3={Color3.fromRGB(0, 0, 0)}
                        BorderSizePixel={0}
                        Position={UDim2.fromScale(0.5, 0.446)}
                        Size={UDim2.fromScale(0.716, 0.403)}
                        ZIndex={16}
                    />
                </frame>
            </frame>
        </frame>
    )
}

markPureComponent(FourCardTabSelection);
markPureComponent(ThreeCardTabSelection);