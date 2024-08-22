import { Instant, Spring, useAsyncEffect, useMotor } from "@rbxts/pretty-roact-hooks";
import Roact from "@rbxts/roact";
import { withHooks } from "@rbxts/roact-hooked";

export const LargeBottomListProgressComponent = ((props: { header: string, body: string, value: number, visible?: boolean, animate?: boolean, color?: Color3, layoutOrder?: number }): Roact.Element => {
    const [size, setSize] = useMotor(0);

    useAsyncEffect(async () => {
        if (!props.animate) return
        setSize(new Instant(0))

        Promise.delay(0).await();
        setSize(new Spring(props.value, { frequency: 0.9 }))
    }, [props.animate])
    
    return (
        <frame
            Key={"bottom"}
            BackgroundColor3={Color3.fromRGB(0, 0, 0)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(5.74e-08, 0.8)}
            Size={UDim2.fromScale(0.995, 0.207)}
            ZIndex={16}
            Visible={props.visible ?? true}
        >
            <frame
                Key={"frame"}
                AnchorPoint={new Vector2(0, 1)}
                BackgroundColor3={Color3.fromRGB(0, 0, 0)}
                BackgroundTransparency={0.7}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0, 1)}
                Size={UDim2.fromScale(1, 1.23)}
            >
                <textlabel
                    Key={"textLabel"}
                    FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                    Text={props.body}
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
                    Position={UDim2.fromScale(0.037, 0.382)}
                    Size={UDim2.fromScale(0.938, 0.224)}
                    ZIndex={16}
                />

                <textlabel
                    Key={"textLabel1"}
                    FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                    Text={props.header}
                    TextColor3={Color3.fromRGB(255, 255, 255)}
                    TextScaled={true}
                    TextSize={14}
                    TextTransparency={0.28}
                    TextWrapped={true}
                    TextXAlignment={Enum.TextXAlignment.Left}
                    BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                    BackgroundTransparency={1}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.037, 0.38)}
                    Size={UDim2.fromScale(0.566, 0.229)}
                    ZIndex={16}
                />

                <uicorner
                    Key={"uICorner"}
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

                <frame
                    Key={"container"}
                    AnchorPoint={new Vector2(0.5, 0)}
                    BackgroundColor3={Color3.fromRGB(64, 67, 81)}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.506, 0.725)}
                    Size={UDim2.fromScale(0.935, 0.0527)}
                >
                    <uicorner
                        Key={"uICorner1"}
                        CornerRadius={new UDim(1, 0)}
                    />

                    <frame
                        Key={"container1"}
                        AnchorPoint={new Vector2(0, 0.5)}
                        BackgroundColor3={Color3.fromRGB(181, 193, 231)}
                        BorderColor3={Color3.fromRGB(0, 0, 0)}
                        BorderSizePixel={0}
                        Position={UDim2.fromScale(0, 0.5)}
                        Size={size.map((value) => UDim2.fromScale(value, 1))}
                    >
                        <uicorner
                            Key={"uICorner2"}
                            CornerRadius={new UDim(1, 0)}
                        />
                    </frame>
                </frame>
            </frame>
        </frame>
    )
})

export const TopListProgressComponent = ((props: { header: string, body: string, value: number, animate?: boolean, color?: Color3, layoutOrder?: number }): Roact.Element => {
    const [size, setSize] = useMotor(0);

    useAsyncEffect(async () => {
        if (!props.animate) return
        setSize(new Instant(0))

        Promise.delay(0).await();
        setSize(new Spring(props.value, { frequency: 0.9 }))
    }, [props.animate])

    return (
        <frame
            Key={"top"}
            BackgroundColor3={Color3.fromRGB(0, 0, 0)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Size={UDim2.fromScale(1, 0.443)}
            ZIndex={16}
            LayoutOrder={props.layoutOrder ?? 0}
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
                    Text={props.body}
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
                    Position={UDim2.fromScale(0.037, 0.156)}
                    Size={UDim2.fromScale(0.938, 0.221)}
                    ZIndex={16}
                />

                <textlabel
                    Key={"textLabel1"}
                    FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                    Text={props.header}
                    TextColor3={Color3.fromRGB(255, 255, 255)}
                    TextScaled={true}
                    TextSize={14}
                    TextTransparency={0.28}
                    TextWrapped={true}
                    TextXAlignment={Enum.TextXAlignment.Left}
                    BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                    BackgroundTransparency={1}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.037, 0.156)}
                    Size={UDim2.fromScale(0.938, 0.221)}
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

                <frame
                    Key={"container"}
                    AnchorPoint={new Vector2(0.5, 0)}
                    BackgroundColor3={Color3.fromRGB(64, 67, 81)}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.506, 0.546)}
                    Size={UDim2.fromScale(0.935, 0.052)}
                >
                    <uicorner
                        Key={"uICorner1"}
                        CornerRadius={new UDim(1, 0)}
                    />

                    <frame
                        Key={"container1"}
                        AnchorPoint={new Vector2(0, 0.5)}
                        BackgroundColor3={props.color || Color3.fromRGB(181, 193, 231)}
                        BorderColor3={Color3.fromRGB(0, 0, 0)}
                        BorderSizePixel={0}
                        Position={UDim2.fromScale(0, 0.5)}
                        Size={size.map((value) => UDim2.fromScale(value, 1))}
                    >
                        <uicorner
                            Key={"uICorner2"}
                            CornerRadius={new UDim(1, 0)}
                        />
                    </frame>
                </frame>
            </frame>
        </frame>
    )
})

export const MiddleListProgressComponent = ((props: { header: string, body: string, value: number, animate?: boolean, color?: Color3 }): Roact.Element => {
    const [size, setSize] = useMotor(0);

    useAsyncEffect(async () => {
        if (!props.animate) return
        setSize(new Instant(0))

        Promise.delay(0).await();
        setSize(new Spring(props.value, { frequency: 0.9 }))
    }, [props.animate])

    return (
        <frame
            Key={"middle"}
            BackgroundColor3={Color3.fromRGB(0, 0, 0)}
            BackgroundTransparency={0.7}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.0859, 0.466)}
            Size={UDim2.fromScale(1, 0.437)}
            ZIndex={16}
        >
            <textlabel
                Key={"textLabel"}
                FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                Text={props.header}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextScaled={true}
                TextSize={14}
                TextTransparency={0.28}
                TextWrapped={true}
                TextXAlignment={Enum.TextXAlignment.Left}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.037, 0.22)}
                Size={UDim2.fromScale(0.938, 0.288)}
                ZIndex={16}
            />

            <textlabel
                Key={"textLabel1"}
                FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                Text={props.body}
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
                Position={UDim2.fromScale(0.037, 0.22)}
                Size={UDim2.fromScale(0.938, 0.288)}
                ZIndex={16}
            />

            <frame
                Key={"container"}
                AnchorPoint={new Vector2(0.5, 0)}
                BackgroundColor3={Color3.fromRGB(64, 67, 81)}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.506, 0.712)}
                Size={UDim2.fromScale(0.935, 0.0678)}
            >
                <uicorner
                    Key={"uICorner"}
                    CornerRadius={new UDim(1, 0)}
                />

                <frame
                    Key={"container1"}
                    AnchorPoint={new Vector2(0, 0.5)}
                    BackgroundColor3={props.color || Color3.fromRGB(181, 193, 231)}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0, 0.5)}
                    Size={size.map((value) => UDim2.fromScale(value, 1))}
                >
                    <uicorner
                        Key={"uICorner1"}
                        CornerRadius={new UDim(1, 0)}
                    />
                </frame>
            </frame>
        </frame>
    )
})

export const BottomListProgressComponent = withHooks((props: { header: string, body: string, value: number, animate?: boolean, color?: Color3 }): Roact.Element => {
    const [size, setSize] = useMotor(0);

    useAsyncEffect(async () => {
        if (!props.animate) return
        setSize(new Instant(0))

        Promise.delay(0).await();
        setSize(new Spring(props.value, { frequency: 0.9 }))
    }, [props.animate])

    return (
        <frame
            Key={"bottom"}
            BackgroundColor3={Color3.fromRGB(0, 0, 0)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.0859, 0.336)}
            Size={UDim2.fromScale(1, 0.437)}
            ZIndex={16}
        >
            <frame
                Key={"frame"}
                AnchorPoint={new Vector2(0, 1)}
                BackgroundColor3={Color3.fromRGB(0, 0, 0)}
                BackgroundTransparency={0.7}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0, 1)}
                Size={UDim2.fromScale(1, 1.29)}
            >
                <textlabel
                    Key={"textLabel"}
                    FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                    Text={props.body}
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
                    Position={UDim2.fromScale(0.037, 0.382)}
                    Size={UDim2.fromScale(0.938, 0.224)}
                    ZIndex={16}
                />

                <textlabel
                    Key={"textLabel1"}
                    FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                    Text={props.header}
                    TextColor3={Color3.fromRGB(255, 255, 255)}
                    TextScaled={true}
                    TextSize={14}
                    TextTransparency={0.28}
                    TextWrapped={true}
                    TextXAlignment={Enum.TextXAlignment.Left}
                    BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                    BackgroundTransparency={1}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.037, 0.382)}
                    Size={UDim2.fromScale(0.938, 0.224)}
                    ZIndex={16}
                />

                <uicorner
                    Key={"uICorner"}
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

                <frame
                    Key={"container"}
                    AnchorPoint={new Vector2(0.5, 0)}
                    BackgroundColor3={Color3.fromRGB(64, 67, 81)}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.506, 0.725)}
                    Size={UDim2.fromScale(0.935, 0.0527)}
                >
                    <uicorner
                        Key={"uICorner1"}
                        CornerRadius={new UDim(1, 0)}
                    />

                    <frame
                        Key={"container1"}
                        AnchorPoint={new Vector2(0, 0.5)}
                        BackgroundColor3={props.color || Color3.fromRGB(181, 193, 231)}
                        BorderColor3={Color3.fromRGB(0, 0, 0)}
                        BorderSizePixel={0}
                        Position={UDim2.fromScale(0, 0.5)}
                        Size={!props.animate ? UDim2.fromScale(props.value, 1) : size.map((value) => UDim2.fromScale(value, 1))}
                    >
                        <uicorner
                            Key={"uICorner2"}
                            CornerRadius={new UDim(1, 0)}
                        />
                    </frame>
                </frame>
            </frame>
        </frame>
    )
})