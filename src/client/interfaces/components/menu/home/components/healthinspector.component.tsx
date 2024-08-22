import { useMotor, useAsyncEffect, Instant, Spring } from "@rbxts/pretty-roact-hooks";
import Roact from "@rbxts/roact";
import { useEffect, useMutable, useRef, withHooks } from "@rbxts/roact-hooked";
import { ReplicatedStorage } from "@rbxts/services";
import { Requiem } from "shared/Requiem";

export const HealthColorization = [
    new Color3(0.51, 0.82, 0.51),
    new Color3(0.82, 0.72, 0.51),
    new Color3(0.82, 0.51, 0.51),
]

export function getGradientColor(value: number, colorMap : Color3[]): Color3 {
    // Ensure the value is within the range [0, 1]
    value = math.max(0, math.min(1, value));

    // If the value is 1, return green
    if (value === 1) {
        return colorMap[0];
    }
    // If the value is 0.5, return yellow
    else if (value === 0.5) {
        return colorMap[1];
    }
    // If the value is 0, return red
    else if (value === 0) {
        return colorMap[2];
    }
    // If the value is between 0.5 and 1, interpolate between yellow and green
    else if (value > 0.5) {
        return colorMap[1].Lerp(colorMap[0], (value - 0.5) * 2);
    }
    // If the value is between 0 and 0.5, interpolate between red and yellow
    else {
        return colorMap[2].Lerp(colorMap[1], value * 2);
    }
}

export const HealthValueComponent = (function (props: { text: string, position: UDim2, value: number, animate?: boolean } & Roact.PropsWithChildren): Roact.Element {
    const [size, setSize] = useMotor(0);

    useAsyncEffect(async () => {
        if (!props.animate) return
        setSize(new Instant(0))
        
        Promise.delay(0).await();
        setSize(new Spring(props.value, { frequency: 0.9 }))
    }, [ props.animate ])
    
    return <frame
        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
        BackgroundTransparency={1}
        BorderColor3={Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        Position={props.position}
        Size={UDim2.fromScale(0.215, 0.0985)}
        ZIndex={15}
    >
        <frame
            Key={"container6"}
            AnchorPoint={new Vector2(0.5, 0)}
            BackgroundColor3={Color3.fromRGB(64, 67, 81)}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.5, 0.741)}
            Size={new UDim2(1, 0, 0, 4)}
        >
            <uicorner
                Key={"iCorner7"}
                CornerRadius={new UDim(1, 0)}
            />

            <frame
                Key={"container7"}
                AnchorPoint={new Vector2(0, 0.5)}
                BackgroundColor3={getGradientColor(props.value, HealthColorization)}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0, 0.5)}
                Size={size.map((value) => new UDim2(value, 0, 1, 0))}
            >
                <uicorner
                    Key={"iCorner8"}
                    CornerRadius={new UDim(1, 0)}
                />
            </frame>
        </frame>

        <textlabel
            Key={"label3"}
            FontFace={new Font(
                "rbxasset://fonts/families/SourceSansPro.json",
                Enum.FontWeight.Bold,
                Enum.FontStyle.Normal
            )}
            Text={props.text}
            TextColor3={Color3.fromRGB(255, 255, 255)}
            TextScaled={true}
            TextSize={14}
            TextWrapped={true}
            TextXAlignment={Enum.TextXAlignment.Left}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0, 0.0921)}
            Size={UDim2.fromScale(1, 0.509)}
            ZIndex={4}
        />
    </frame>
})

export const HealthPopupViewportComponent = (function (props: {} & Roact.PropsWithChildren): Roact.Element {
    const ref = useRef<ViewportFrame>();
    const worldModel = useMutable<WorldModel>();

    useEffect(() => {
        if (!ref.getValue()) return;

        if (!worldModel.current) {
            worldModel.current = Requiem.Assets.other.DummyWorldModel.Clone();
            worldModel.current.Parent = ref.getValue();
        }
    }, [ref])

    return (
        <frame
            Key={"middle"}
            AnchorPoint={new Vector2(0.5, 0.5)}
            BackgroundColor3={Color3.fromRGB(0, 0, 0)}
            BackgroundTransparency={0.7}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.5, 0.567)}
            Size={UDim2.fromScale(0.929, 0.804)}
            ZIndex={16}
        >
            {props[Roact.Children]}

            <uicorner
                Key={"iCorner"}
                CornerRadius={new UDim(0, 10)}
            />

            <viewportframe
                Key={"frame"}
                Ambient={Color3.fromRGB(57, 57, 57)}
                LightColor={Color3.fromRGB(176, 180, 194)}
                LightDirection={new Vector3(-3, -1, -2)}
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={Color3.fromRGB(0, 0, 0)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.51, 0.5)}
                Size={UDim2.fromScale(0.645, 0.749)}
                ZIndex={3}
                Ref={ref}
            >
                <uiaspectratioconstraint />
                <uigradient
                    Key={"iGradient"}
                    Rotation={90}
                    Transparency={new NumberSequence([
                        new NumberSequenceKeypoint(0, 0),
                        new NumberSequenceKeypoint(0.725, 0),
                        new NumberSequenceKeypoint(1, 1),
                    ])}
                />
            </viewportframe>
        </frame>
    )
})