import { Instant, Spring, useMotor } from "@rbxts/pretty-roact-hooks";
import Roact from "@rbxts/roact";
import { withHooks } from "@rbxts/roact-hooked";

export const InfoTierListComponent = ((props: { title: string, max: number, value: number, layoutOrder?: number, clicked?: () => void, visible? : boolean, animate?: boolean}): Roact.Element => {
    const size = 0.9875 / props.max;

    const TierComponentHolders = []
    
    const [ color, setColor ] = useMotor({r: 59, g: 69, b: 99})

    const springSettings = { frequency: 1.2 }

    if(props.visible || props.animate) {
        setColor({ r: new Spring(122, springSettings), g: new Spring(143, springSettings), b: new Spring(211, springSettings)})
    } else {
        setColor({ r: new Instant(59), g: new Instant(69), b: new Instant(99)})
    }

    for (let i = 0; i < props.max; i++) {
        TierComponentHolders.push(<frame
            Key={"container6"}
            AnchorPoint={new Vector2(0, 0.5)}
            BackgroundColor3={props.value > i ? color.map((color) => Color3.fromRGB(color.r, color.g, color.b)) : Color3.fromRGB(59, 69, 99)}
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
            Key={"middle"}
            BackgroundColor3={Color3.fromRGB(0, 0, 0)}
            BackgroundTransparency={0.7}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            LayoutOrder={-1}
            Position={UDim2.fromScale(0.00238, 0.158)}
            Size={UDim2.fromScale(0.995, 0.207)}
            ZIndex={16}
            Visible={props.visible ?? true}
        >
            <textlabel
                Key={"textLabel"}
                FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                Text={props.title}
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
                Position={UDim2.fromScale(0.0843, 0.22)}
                Size={UDim2.fromScale(0.891, 0.288)}
                ZIndex={16}
            />

            <frame
                Key={"container"}
                AnchorPoint={new Vector2(0.5, 0)}
                BackgroundColor3={Color3.fromRGB(64, 67, 81)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.506, 0.712)}
                Size={UDim2.fromScale(0.935, 0.0678)}
            >
                <uicorner
                    Key={"uICorner"}
                    CornerRadius={new UDim(1, 0)}
                />

                <uilistlayout
                    Key={"uIListLayout"}
                    Padding={new UDim(0, 4)}
                    FillDirection={Enum.FillDirection.Horizontal}
                    SortOrder={Enum.SortOrder.LayoutOrder}
                />

                {TierComponentHolders}
            </frame>

            <imagebutton
                Key={"imageButton"}
                Image={"rbxassetid://11295291707"}
                ImageTransparency={0.22}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.945, 0.247)}
                Size={UDim2.fromScale(0.0245, 0.226)}
                ZIndex={17}
                Event={{ MouseButton1Click: props.clicked }}
            >
                <uiaspectratioconstraint />
            </imagebutton>

            <textlabel
                Key={"textLabel1"}
                FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                Text={`${props.value}/${props.max}`}
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
                Position={UDim2.fromScale(0.298, 0.22)}
                Size={UDim2.fromScale(0.634, 0.288)}
                ZIndex={16}
            />

            <imagebutton
                Key={"imageButton1"}
                Image={"rbxassetid://11422155687"}
                ImageTransparency={0.22}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.0374, 0.22)}
                Size={UDim2.fromScale(0.0338, 0.311)}
                ZIndex={17}
            >
                <uiaspectratioconstraint />
            </imagebutton>
        </frame>
    )
})

export default function TierListComponent(props: { title: string, max: number, value: number, layoutOrder?: number, clicked?: () => void }): Roact.Element {
    const size = 0.9875 / props.max;

    const TierComponentHolders = []
    for (let i = 0; i < props.max; i++) {
        TierComponentHolders.push(<frame
            Key={"container6"}
            AnchorPoint={new Vector2(0, 0.5)}
            BackgroundColor3={props.value > i ? Color3.fromRGB(181, 193, 231) : Color3.fromRGB(89, 95, 113)}
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

    return <frame
        Key={"middle2"}
        BackgroundColor3={Color3.fromRGB(0, 0, 0)}
        BackgroundTransparency={0.7}
        BorderColor3={Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        Position={UDim2.fromScale(0.0859, 0.466)}
        Size={UDim2.fromScale(1, 0.437)}
        ZIndex={16}
        LayoutOrder={props.layoutOrder ?? 0}
    >
        <textlabel
            Key={"textLabel8"}
            FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
            Text={props.title}
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
            Key={"textLabel9"}
            FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
            Text={`${props.value}/${props.max}`}
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
            Size={UDim2.fromScale(0.864, 0.288)}
            ZIndex={16}
        />

        <frame
            Key={"container3"}
            AnchorPoint={new Vector2(0.5, 0)}
            BackgroundColor3={Color3.fromRGB(64, 67, 81)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.506, 0.712)}
            Size={UDim2.fromScale(0.935, 0.0678)}
        >
            <uilistlayout
                Key={"uIListLayout1"}
                Padding={new UDim(0, 4)}
                FillDirection={Enum.FillDirection.Horizontal}
                SortOrder={Enum.SortOrder.LayoutOrder}
                HorizontalAlignment={Enum.HorizontalAlignment.Center}
            />

            <uicorner
                Key={"uICorner5"}
                CornerRadius={new UDim(1, 0)}
            />

            {TierComponentHolders}
        </frame>

        <imagebutton
            Key={"imageButton"}
            Image={"rbxassetid://11295291707"}
            ImageTransparency={0.22}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.917, 0.264)}
            Size={UDim2.fromOffset(13, 13)}
            ZIndex={17}
            Event={{ MouseButton1Click: props.clicked }}
        />
    </frame>
}