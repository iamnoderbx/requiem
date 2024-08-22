import Roact from "@rbxts/roact";
import { useEffect, useRef, useState } from "@rbxts/roact-hooked";
import { Players, UserInputService } from "@rbxts/services";

type EntrySlideBarFrame = Frame & {
    bar: Frame,
    circle: Frame,
}

export default function EntrySliderBarComponent(props: { Maximum: number, Value: number, Prefix: string, Changed: (value: number) => void }): Roact.Element {
    const ratio = props.Value / props.Maximum;

    const [isDragging, setDragging] = useState(false);
    const [connections, setConnections] = useState<Array<RBXScriptConnection>>([]);

    const ref = useRef<EntrySlideBarFrame>();

    useEffect(() => {
        if (!ref.getValue()) return;

        if (!isDragging) {
            for (const connection of connections) {
                connection.Disconnect();
            }

            setConnections([]);
            return;
        }

        const input = UserInputService.InputEnded.Connect((input) => {
            if (input.UserInputType === Enum.UserInputType.MouseButton1) {
                setDragging(false);
            }
        });

        const move = UserInputService.InputChanged.Connect((input) => {
            if (input.UserInputType !== Enum.UserInputType.MouseMovement) return;

            const frame = ref.getValue()!;

            const mouse = Players.LocalPlayer.GetMouse();

            const x = mouse.X;

            const bar_size = frame.AbsoluteSize;
            const bar_start = frame.AbsolutePosition;
            const difference_mouse = x - bar_start.X;

            let percent = difference_mouse / (bar_size.X);
            percent = math.clamp(percent, 0, 1);

            const value = percent * props.Maximum;
            props.Changed(value);

            frame.circle.Position = new UDim2(percent, 0, 0.5, 0);
            frame.bar.Size = new UDim2(percent, 0, 1, 0);

            const label = frame.Parent!.FindFirstChild("__label") as TextLabel;   
            label.Text = props.Prefix + " " + tostring(math.floor(value));
        });

        setConnections([input, move]);
    }, [isDragging])

    return (<>
        <frame
            AnchorPoint={new Vector2(0.5, 0)}
            BackgroundColor3={Color3.fromRGB(47, 47, 54)}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.503, 0.743)}
            Size={UDim2.fromScale(0.952, 0.0354)}
            Key={"reference1"}
            Ref={ref}
        >
            <uicorner
                Key={"UICorner1"}
                CornerRadius={new UDim(1, 0)}
            />

            <frame
                AnchorPoint={new Vector2(0, 0.5)}
                BackgroundColor3={Color3.fromRGB(147, 174, 255)}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0, 0.5)}
                Size={UDim2.fromScale(ratio, 1)}
                Key={"bar"}
            >
                <uicorner
                    Key={"UICorner1"}
                    CornerRadius={new UDim(1, 0)}
                />
            </frame>

            <frame
                AnchorPoint={new Vector2(0, 0.5)}
                BackgroundColor3={Color3.fromRGB(147, 174, 255)}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(ratio, 0.5)}
                Size={UDim2.fromOffset(10, 10)}
                Key={"circle"}
            >
                <textbutton
                    Size={UDim2.fromScale(2, 2)}
                    BackgroundTransparency={1}
                    TextTransparency={1}
                    Text=""
                    AnchorPoint={new Vector2(0.5, 0.5)}
                    Position={UDim2.fromScale(0.5, 0.5)}

                    Event={{
                        MouseButton1Down: () => {
                            setDragging(true);
                        }
                    }}
                />
                <uicorner
                    Key={"UICorner1"}
                    CornerRadius={new UDim(1, 0)}
                />
            </frame>
        </frame>

        <textlabel
            FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
            Text={props.Prefix + " " + tostring(props.Value)}
            TextColor3={Color3.fromRGB(255, 255, 255)}
            TextScaled={true}
            TextSize={14}
            TextTransparency={0.49}
            TextWrapped={true}
            TextXAlignment={Enum.TextXAlignment.Right}
            TextYAlignment={Enum.TextYAlignment.Bottom}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.106, 0.602)}
            Size={UDim2.fromScale(0.872, -0.177)}
            ZIndex={3}
            Key={"__label"}
        />
    </>)
}