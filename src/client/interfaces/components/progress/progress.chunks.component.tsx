import { useMotor, Spring, Instant } from "@rbxts/pretty-roact-hooks";
import Roact from "@rbxts/roact";
import { withHooks } from "@rbxts/roact-hooked";
import { TweenService } from "@rbxts/services";
import { Tooltip } from "client/interfaces/routes/tooltips.route";

export const ProgressChunkUpgradeLockedComponent = withHooks((props: { Header: string, Description: string, Value: number, Chunks: number, Animate: boolean, Color?: Color3, Locked?: boolean, Hover?: string, Clicked?: () => void }) => {
    const size = 0.9875 / props.Chunks;

    const ChunkComponentHolders = []

    const [r, g, b] = props.Color ? [props.Color.R, props.Color.G, props.Color.B] : [122, 143, 211]

    const [hR, hG] = Color3.toHSV(new Color3(r, g, b))
    const hsv = Color3.fromHSV(hR, hG, 0.2)

    const [color, setColor] = useMotor({ r: hsv.R, g: hsv.G, b: hsv.B })
    const springSettings = { frequency: 1.2 }

    const [ scale, setScale ] = useMotor(0)

    if (props.Animate) {
        setColor({ r: new Spring(r, springSettings), g: new Spring(g, springSettings), b: new Spring(b, springSettings) })
    } else {
        setColor({ r: new Instant(hsv.R), g: new Instant(hsv.G), b: new Instant(hsv.B) })
    }

    for (let i = 0; i < props.Chunks; i++) {
        ChunkComponentHolders.push(<frame
            Key={"container6"}
            AnchorPoint={new Vector2(0, 0.5)}
            BackgroundColor3={props.Value > i ? color.map((color) => new Color3(color.r, color.g, color.b)) : new Color3(hsv.R, hsv.G, hsv.B)}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0, 0.574)}
            Size={new UDim2(size, -3, 0.947, 0)}
        >
            <uicorner
                Key={"uICorner8"}
                CornerRadius={new UDim(1, 0)}
            />
        </frame>)
    }

    return (
        <frame
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.0502, 0.379)}
            Size={UDim2.fromScale(0.925, 0.219)}
            Key={"progbar"}
        >
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
                TextTransparency={0.24}
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
                Key={"header"}
            />

            <textlabel
                FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                Text={props.Description}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextScaled={true}
                TextSize={14}
                TextTransparency={0.49}
                TextWrapped={true}
                TextXAlignment={Enum.TextXAlignment.Left}
                TextYAlignment={Enum.TextYAlignment.Bottom}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.0, 0.492)}
                Size={UDim2.fromScale(0.965, -0.258)}
                ZIndex={3}
                Key={"description"}
            />

            <frame
                AnchorPoint={new Vector2(0.5, 0)}
                BackgroundColor3={Color3.fromRGB(64, 67, 81)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.5, 0.691)}
                Size={UDim2.fromScale(1, 0.05)}
                Key={"container"}
            >
                <uicorner
                    Key={"UICorner"}
                    CornerRadius={new UDim(1, 0)}
                />

                <uilistlayout
                    Key={"UIListLayout"}
                    Padding={new UDim(0, 4)}
                    FillDirection={Enum.FillDirection.Horizontal}
                    SortOrder={Enum.SortOrder.LayoutOrder}
                />

                {ChunkComponentHolders}
            </frame>

            <frame
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={Color3.fromRGB(6, 8, 12)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.5, 0.394)}
                Size={scale.map((value) => UDim2.fromScale(1.02, 1.2).add(UDim2.fromOffset(value, value)))}
                ZIndex={1}
                Key={"hover"}
                Visible={!props.Locked}
                Event={{
                    MouseEnter: (frame) => {
                        if (props.Locked) return;
                        if (!props.Hover) return

                        const stroke = frame.FindFirstChild("UIStroke") as UIStroke
                        stroke.Transparency = 0.7

                        TweenService.Create(frame, new TweenInfo(0.1), { BackgroundTransparency: 0.8}).Play()
                        setScale(new Spring(3, { frequency: 3 }))
                    },

                    MouseLeave: (frame) => {
                        if (props.Locked) return;
                        if (!props.Hover) return

                        TweenService.Create(frame, new TweenInfo(0.1), { BackgroundTransparency: 1}).Play()
                        const stroke = frame.FindFirstChild("UIStroke") as UIStroke
                        stroke.Transparency = 1

                        setScale(new Spring(0, { frequency: 3 }))
                    }
                }}
            >
                <uistroke
                    Key={"UIStroke"}
                    Color={props.Color}
                    Transparency={1}
                />
                <uicorner Key={"UICorner"} />
            </frame>

            <frame
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={Color3.fromRGB(6, 8, 12)}
                BackgroundTransparency={0.15}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.5, 0.394)}
                Size={UDim2.fromScale(1.02, 1.2)}
                ZIndex={5}
                Key={"locked"}
                Visible={props.Locked}


            >
                <uicorner Key={"UICorner"} />
                <imagelabel
                    Key={"ImageLabel"}
                    Image={"rbxassetid://14187755345"}
                    ImageTransparency={0.81}
                    AnchorPoint={new Vector2(0.5, 0.5)}
                    BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                    BackgroundTransparency={1}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.5, 0.5)}
                    Size={UDim2.fromScale(0.0489, 0.648)}
                >
                    <uiaspectratioconstraint
                        Key={"UIAspectRatioConstraint"}
                        AspectRatio={1}
                    />
                </imagelabel>
            </frame>


            <textbutton
                Size={UDim2.fromScale(1, 1)}
                BackgroundTransparency={1}
                Text={""}
                TextTransparency={1}
                Visible={!props.Locked}
                Event={{
                    MouseButton1Down: () => {
                        if (props.Clicked) props.Clicked()
                    }
                }}
            />
            {/* <imagelabel
                Image={"rbxassetid://11422155687"}
                ImageTransparency={0.36}
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.00651, 0.373)}
                Size={UDim2.fromScale(0.0149, 0.229)}
                ZIndex={2}
                Key={"info"}
                Event={props.Hover ? {
                    MouseEnter: (frame) => {
                        if (!props.Hover) return

                        const anchorOffset = new Vector2((frame.AbsoluteSize.X) * frame.AnchorPoint.X, frame.AbsoluteSize.Y * frame.AnchorPoint.Y);
                        const screenSpacePosition = new Vector2((frame.AbsolutePosition.X + anchorOffset.X), frame.AbsolutePosition.Y + anchorOffset.Y);

                        Tooltip.show(screenSpacePosition, props.Header, props.Hover)
                    },

                    MouseLeave: (frame) => {
                        if (!props.Hover) return
                        const anchorOffset = new Vector2((frame.AbsoluteSize.X) * frame.AnchorPoint.X, frame.AbsoluteSize.Y * frame.AnchorPoint.Y);
                        const screenSpacePosition = new Vector2((frame.AbsolutePosition.X + anchorOffset.X), frame.AbsolutePosition.Y + anchorOffset.Y);
                        Tooltip.hide(screenSpacePosition)
                    }
                } : {}}
            >
                <uiaspectratioconstraint
                    Key={"UIAspectRatioConstraint"}
                    AspectRatio={1.02}
                />
            </imagelabel> */}

            <frame
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.975, 0.0593)}
                Size={UDim2.fromScale(0.0228, 0.356)}
                Key={"upgrade"}
            >
                <uistroke
                    Key={"UIStroke"}
                    Color={Color3.fromRGB(255, 255, 255)}
                    Transparency={0.83}
                />

                <uicorner
                    Key={"UICorner"}
                    CornerRadius={new UDim(1, 0)}
                />

                <imagebutton
                    Key={"ImageButton"}
                    Image={"rbxassetid://11295291707"}
                    AnchorPoint={new Vector2(0.5, 0.5)}
                    BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                    BackgroundTransparency={1}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.5, 0.5)}
                    Size={UDim2.fromScale(0.6, 0.6)}
                />
            </frame>
        </frame>
    )
});

export default withHooks((props: { Header: string, Value: number, Chunks: number, Animate: boolean, Color?: Color3 }) => {
    const size = 0.9875 / props.Chunks;

    const ChunkComponentHolders = []

    const [r, g, b] = props.Color ? [props.Color.R, props.Color.G, props.Color.B] : [122, 143, 211]

    const [hR, hG] = Color3.toHSV(new Color3(r, g, b))
    const hsv = Color3.fromHSV(hR, hG, 0.2)

    const [color, setColor] = useMotor({ r: hsv.R, g: hsv.G, b: hsv.B })
    const springSettings = { frequency: 1.2 }

    if (props.Animate) {
        setColor({ r: new Spring(r, springSettings), g: new Spring(g, springSettings), b: new Spring(b, springSettings) })
    } else {
        setColor({ r: new Instant(hsv.R), g: new Instant(hsv.G), b: new Instant(hsv.B) })
    }

    for (let i = 0; i < props.Chunks; i++) {
        ChunkComponentHolders.push(<frame
            Key={"container6"}
            AnchorPoint={new Vector2(0, 0.5)}
            BackgroundColor3={props.Value > i ? color.map((color) => new Color3(color.r, color.g, color.b)) : new Color3(hsv.R, hsv.G, hsv.B)}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0, 0.574)}
            Size={new UDim2(size, -3, 0.947, 0)}
        >
            <uicorner
                Key={"uICorner8"}
                CornerRadius={new UDim(1, 0)}
            />
        </frame>)
    }

    return (
        <frame
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(1.89e-08, 0.241)}
            Size={UDim2.fromScale(0.991, 0.191)}
            Key={"secbar"}
        >
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
                Text={tostring(props.Value) + "/" + tostring(props.Chunks)}
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
                Size={UDim2.fromScale(0.849, -0.272)}
                ZIndex={3}
                Key={"value"}
            />

            <frame
                AnchorPoint={new Vector2(0.5, 0)}
                BackgroundColor3={Color3.fromRGB(64, 67, 81)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.5, 0.691)}
                Size={UDim2.fromScale(1, 0.05)}
                Key={"container"}
            >
                <uicorner
                    Key={"UICorner"}
                    CornerRadius={new UDim(1, 0)}
                />

                <uilistlayout
                    Key={"UIListLayout"}
                    Padding={new UDim(0, 4)}
                    FillDirection={Enum.FillDirection.Horizontal}
                    SortOrder={Enum.SortOrder.LayoutOrder}
                />

                {ChunkComponentHolders}
            </frame>

            <imagebutton
                Key={"ImageButton"}
                Image={"rbxassetid://11295291707"}
                ImageTransparency={0.22}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.978, 0.248)}
                Size={UDim2.fromScale(0.0216, 0.211)}
                ZIndex={17}
            >
                <uiaspectratioconstraint Key={"UIAspectRatioConstraint"} />
            </imagebutton>
        </frame>
    )
});