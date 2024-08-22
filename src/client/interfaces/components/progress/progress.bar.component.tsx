import { useMotor, useAsyncEffect, Instant, Spring } from "@rbxts/pretty-roact-hooks";
import Roact from "@rbxts/roact";
import { withHooks } from "@rbxts/roact-hooked"

export const ProgressDescriptionComponent = withHooks((props: { Header: string, Description: string, Body: string, Value: number, Animate: boolean, Color?: Color3, Visible?: boolean, Size?: UDim2, Position?: UDim2, AnchorPoint?: Vector2, Transparencies?: {Header: number, Body: number, Description: number}}) => {
    const [size, setSize] = useMotor(0);
    
    useAsyncEffect(async () => {
        if (!props.Animate) return
        setSize(new Instant(0))

        Promise.delay(0).await();
        setSize(new Spring(props.Value, { frequency: 0.9 }))
    }, [props.Animate])

    const [h, s, v] = Color3.toHSV(props.Color ?? Color3.fromRGB(122, 143, 211))
    const backgroundColor = Color3.fromHSV(h, s, 0.35)

    return (
        <frame
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={props.Position ?? UDim2.fromScale(0.000929, 0.985)}
            Size={props.Size ?? UDim2.fromScale(1, 0.0731)}
            AnchorPoint={props.AnchorPoint ?? new Vector2(0, 0)}
            Visible={props.Visible}
        >
            <frame
                AnchorPoint={new Vector2(0.5, 0)}
                BackgroundColor3={backgroundColor}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.5, 0.691)}
                Size={UDim2.fromScale(1, 0.05)}
            >
                <uicorner
                    Key={"UICorner"}
                    CornerRadius={new UDim(1, 0)}
                />

                <frame
                    AnchorPoint={new Vector2(0, 0.5)}
                    BackgroundColor3={props.Color ?? Color3.fromRGB(122, 143, 211)}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0, 0.5)}
                    Size={size.map((value) => UDim2.fromScale(value, 1))}
                >
                    <uicorner
                        Key={"UICorner"}
                        CornerRadius={new UDim(1, 0)}
                    />
                </frame>
            </frame>

            <textlabel
                FontFace={new Font(
                    "rbxasset://fonts/families/SourceSansPro.json",
                    Enum.FontWeight.Bold,
                    Enum.FontStyle.Normal
                )}
                Text={props.Header}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextScaled={true}
                TextSize={14}
                TextTransparency={props.Transparencies ? props.Transparencies.Header : 0.41}
                TextWrapped={true}
                TextXAlignment={Enum.TextXAlignment.Left}
                TextYAlignment={Enum.TextYAlignment.Bottom}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(-0.000236, 0.218)}
                Size={UDim2.fromScale(0.529, -0.31)}
                ZIndex={3}
            />

            <textlabel
                FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                Text={props.Body}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextScaled={true}
                TextSize={14}
                TextTransparency={props.Transparencies ? props.Transparencies.Body : 0.55}
                TextWrapped={true}
                TextXAlignment={Enum.TextXAlignment.Right}
                TextYAlignment={Enum.TextYAlignment.Bottom}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.124, 0.499)}
                Size={UDim2.fromScale(0.878, -0.272)}
                ZIndex={3}
            />

            <textlabel
                FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                Text={props.Description}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextScaled={true}
                TextSize={14}
                TextTransparency={props.Transparencies ? props.Transparencies.Description : 0.7}
                TextWrapped={true}
                TextXAlignment={Enum.TextXAlignment.Left}
                TextYAlignment={Enum.TextYAlignment.Bottom}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(-0.000236, 0.492)}
                Size={UDim2.fromScale(0.95, -0.258)}
                ZIndex={3}
            />
        </frame>
    )
})

export default withHooks((props: { Header: string, Body: string, Value: number, Animate: boolean, Color?: Color3 }) => {
    const [size, setSize] = useMotor(0);
    useAsyncEffect(async () => {
        if (!props.Animate) return
        setSize(new Instant(0))

        Promise.delay(0).await();
        setSize(new Spring(props.Value, { frequency: 0.9 }))
    }, [props.Animate])

    const [h, s, v] = Color3.toHSV(props.Color ?? Color3.fromRGB(122, 143, 211))
    const backgroundColor = Color3.fromHSV(h, s, 0.2)

    return (
        <frame
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(1.89e-08, 0)}
            Size={UDim2.fromScale(0.991, 0.191)}
            Key={"expbar"}
        >
            <frame
                AnchorPoint={new Vector2(0.5, 0)}
                BackgroundColor3={backgroundColor}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.5, 0.691)}
                Size={UDim2.fromScale(1, 0.05)}
                Key={"bar"}
            >
                <uicorner
                    Key={"UICorner"}
                    CornerRadius={new UDim(1, 0)}
                />

                <frame
                    AnchorPoint={new Vector2(0, 0.5)}
                    BackgroundColor3={props.Color ?? Color3.fromRGB(122, 143, 211)}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0, 0.5)}
                    Size={size.map((value) => UDim2.fromScale(value, 1))}
                    Key={"fill"}
                >
                    <uicorner
                        Key={"UICorner"}
                        CornerRadius={new UDim(1, 0)}
                    />
                </frame>
            </frame>

            <textlabel
                FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                Text={props.Header}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextScaled={true}
                TextSize={14}
                TextTransparency={0.41}
                TextWrapped={true}
                TextXAlignment={Enum.TextXAlignment.Left}
                TextYAlignment={Enum.TextYAlignment.Bottom}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.000693, 0.518)}
                Size={UDim2.fromScale(0.529, -0.31)}
                ZIndex={3}
                Key={"header"}
            />

            <textlabel
                FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                Text={props.Body}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextScaled={true}
                TextSize={14}
                TextTransparency={0.55}
                TextWrapped={true}
                TextXAlignment={Enum.TextXAlignment.Right}
                TextYAlignment={Enum.TextYAlignment.Bottom}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.124, 0.499)}
                Size={UDim2.fromScale(0.878, -0.272)}
                ZIndex={3}
                Key={"value"}
            />
        </frame>
    )
})