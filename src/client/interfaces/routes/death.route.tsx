import Roact from "@rbxts/roact";
import { useEffect } from "@rbxts/roact-hooked";
import { CollectionService, Lighting, TweenService, UserInputService, Workspace } from "@rbxts/services";
import { BaseEntity } from "client/entities/BaseEntity";
import { NetworkBubble } from "client/network/ClientBubbles";
import { NetworkEvent, PlayerActions, TitanActions } from "shared/utilities/network/Events";

const signal = new Instance("BindableEvent");
const colorCorrectionEffect = new Instance("ColorCorrectionEffect");

const blurEffect = new Instance("BlurEffect");
blurEffect.Size = 0;

let keyPressConnection: RBXScriptConnection | undefined;

type Screen = Frame & {
    view: ImageLabel;

    skull: ImageLabel & {
        UIAspectRatioConstraint: UIAspectRatioConstraint;
    };

    glow: ImageLabel;
    bar: Frame & {
        fill: Frame & {
            UIAspectRatioConstraint: UIAspectRatioConstraint;
        };

        UIAspectRatioConstraint: UIAspectRatioConstraint;
    }

    cont: TextLabel
}

export default function DeathRoute(): Roact.Element {
    const ref = Roact.createRef<Frame>()

    useEffect(() => {
        const showPlayerDeathScreen = () => {
            const frame = ref.getValue() as Screen
            if (!frame) return

            frame.view.BackgroundTransparency = 1;
            frame.view.ImageTransparency = 1;

            frame.skull.ImageTransparency = 1;
            frame.skull.Position = new UDim2(0.5, 0, 0.7, 0);
            frame.skull.Size = new UDim2(0.14, 0, 0.216, 0);

            frame.cont.TextTransparency = 1;
            frame.cont.Position = new UDim2(0.5, 0, 0.725, 0);

            frame.glow.ImageTransparency = 1;

            frame.bar.fill.Size = new UDim2(1, 0, 1, 0);
            //frame.bar.Position = new UDim2(0.5, 0, 0.759, 0);

            frame.bar.BackgroundTransparency = 1;
            frame.bar.fill.BackgroundTransparency = 1;

            colorCorrectionEffect.Parent = Lighting;
            blurEffect.Parent = Lighting;

            TweenService.Create(colorCorrectionEffect, new TweenInfo(1), {
                Saturation: -1
            }).Play()

            TweenService.Create(blurEffect, new TweenInfo(1), {
                Size: 60
            }).Play()

            TweenService.Create(frame.view, new TweenInfo(3), {
                BackgroundTransparency: 0.25,
                ImageTransparency: 0.2
            }).Play()

            TweenService.Create(frame.skull, new TweenInfo(3, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut), {
                Position: new UDim2(0.5, 0, 0.5, 0),
                ImageTransparency: 0,
                Size: new UDim2(0.174, 0, 0.269, 0),
            }).Play()

            TweenService.Create(frame.glow, new TweenInfo(2), {
                ImageTransparency: 0.91,
            }).Play()

            frame.Visible = true

            task.wait(2)

            TweenService.Create(frame.cont, new TweenInfo(2), {
                TextTransparency: 0,
                Position: new UDim2(0.5, 0, 0.657, 0),
            }).Play()

            let hasBeenPressed = false;

            const transition = () => {
                keyPressConnection?.Disconnect()
                if (hasBeenPressed) return

                hasBeenPressed = true;

                TweenService.Create(frame.view, new TweenInfo(1.3), {
                    BackgroundTransparency: 0,
                }).Play()

                TweenService.Create(frame.skull, new TweenInfo(1.3), {
                    ImageTransparency: 1,
                }).Play()

                TweenService.Create(frame.cont, new TweenInfo(0.7), {
                    TextTransparency: 1,
                }).Play()

                TweenService.Create(frame.bar, new TweenInfo(1), {
                    BackgroundTransparency: 1,
                }).Play()

                TweenService.Create(frame.bar.fill, new TweenInfo(1), {
                    BackgroundTransparency: 1,
                }).Play()

                TweenService.Create(frame.glow, new TweenInfo(1), {
                    ImageTransparency: 1,
                }).Play()

                task.wait(1.4)

                BaseEntity.resolveClientEntity()?.then((client) => {
                    client.network.action(PlayerActions.Respawn)
                })

                task.wait(0.2)

                colorCorrectionEffect.Brightness = 1;
                colorCorrectionEffect.Contrast = 1;
                colorCorrectionEffect.Saturation = 1;

                TweenService.Create(blurEffect, new TweenInfo(2), {
                    Size: 0
                }).Play()

                TweenService.Create(colorCorrectionEffect, new TweenInfo(2), {
                    Saturation: 0,
                    Brightness: 0,
                    Contrast: 0
                }).Play()

                TweenService.Create(frame.view, new TweenInfo(1.5), {
                    BackgroundTransparency: 1,
                    ImageTransparency: 1
                }).Play()
            }

            const MAX_TIME = 10;

            task.delay(2, () => {
                if (hasBeenPressed) return;

                TweenService.Create(frame.bar, new TweenInfo(2), {
                    BackgroundTransparency: 0,
                    Position: new UDim2(0.5, 0, 0.691, 0),
                }).Play()

                TweenService.Create(frame.bar.fill, new TweenInfo(2), {
                    BackgroundTransparency: 0,
                }).Play()

                TweenService.Create(frame.bar.fill, new TweenInfo(MAX_TIME, Enum.EasingStyle.Linear), {
                    Size: new UDim2(0, 0, 1, 0),
                }).Play()

                TweenService.Create(frame.glow, new TweenInfo(MAX_TIME), {
                    ImageTransparency: 1,
                }).Play()

                task.delay(MAX_TIME, () => transition())
            })


            keyPressConnection = UserInputService.InputBegan.Connect((input) => {
                if (input.UserInputType === Enum.UserInputType.Keyboard || input.UserInputType === Enum.UserInputType.MouseButton1) {
                    transition()
                }
            })
        }

        const hidePlayerDeathScreen = () => {
            const frame = ref.getValue() as Screen
            if (!frame) return

            frame.Visible = false
        }

        const listener = signal.Event.Connect((typeIs: number) => {
            const frame = ref.getValue()
            if (!frame) return

            const isPlayerDead = typeIs === 0;

            if (isPlayerDead) showPlayerDeathScreen()
            else hidePlayerDeathScreen()
        })

        return () => listener.Disconnect()
    }, [ref])

    return (
        (
            <frame
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={Color3.fromRGB(0, 0, 0)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.5, 0.5)}
                Size={UDim2.fromScale(1, 1)}
                ZIndex={1.5e+03}
                Key={"dead"}
                Visible={false}
                Ref={ref}
            >
                <imagelabel
                    Image={"rbxassetid://6891912132"}
                    ImageColor3={Color3.fromRGB(0, 0, 0)}
                    ImageTransparency={0.13}
                    AnchorPoint={new Vector2(0.5, 0.5)}
                    BackgroundColor3={Color3.fromRGB(0, 0, 0)}
                    BackgroundTransparency={0.25}
                    Position={UDim2.fromScale(0.5, 0.5)}
                    Size={UDim2.fromScale(1, 1)}
                    ZIndex={0}
                    Key={"view"}
                />

                <imagelabel
                    Image={"rbxassetid://17811425099"}
                    ImageColor3={Color3.fromRGB(14, 14, 16)}
                    AnchorPoint={new Vector2(0.5, 0.5)}
                    BackgroundColor3={Color3.fromRGB(30, 31, 35)}
                    BackgroundTransparency={1}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.5, 0.5)}
                    Size={UDim2.fromScale(0.174, 0.269)}
                    Key={"skull"}
                >
                    <uiaspectratioconstraint Key={"UIAspectRatioConstraint"} />
                </imagelabel>

                <imagelabel
                    Image={"rbxassetid://17812826389"}
                    ImageColor3={Color3.fromRGB(137, 142, 173)}
                    ImageTransparency={0.91}
                    BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                    BackgroundTransparency={1}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.199, 0.0484)}
                    Size={UDim2.fromOffset(1073, 1073)}
                    Key={"glow"}
                />
                <frame
                    BackgroundColor3={Color3.fromRGB(14, 14, 16)}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.5, 0.691)}
                    Size={UDim2.fromScale(0.294, 0.00345)}
                    Key={"bar"}
                    AnchorPoint={new Vector2(0.5, 0.5)}
                >
                    <uicorner
                        Key={"UICorner"}
                        CornerRadius={new UDim(1, 0)}
                    />

                    <frame
                        AnchorPoint={new Vector2(0, 0.5)}
                        BackgroundColor3={Color3.fromRGB(97, 97, 111)}
                        BorderColor3={Color3.fromRGB(0, 0, 0)}
                        BorderSizePixel={0}
                        Position={UDim2.fromScale(0, 0.5)}
                        Size={UDim2.fromScale(0.543, 1)}
                        Key={"fill"}
                    >
                        <uicorner
                            Key={"UICorner"}
                            CornerRadius={new UDim(1, 0)}
                        />
                    </frame>

                    <uiaspectratioconstraint
                        Key={"UIAspectRatioConstraint"}
                        AspectRatio={131}
                    />
                </frame>


                <textlabel
                    FontFace={new Font(
                        "rbxasset://fonts/families/SourceSansPro.json",
                        Enum.FontWeight.Light,
                        Enum.FontStyle.Normal
                    )}
                    Text={"Press any key to continue..."}
                    TextColor3={Color3.fromRGB(97, 97, 97)}
                    TextScaled={true}
                    TextSize={14}
                    TextWrapped={true}
                    AnchorPoint={new Vector2(0.5, 0.5)}
                    BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                    BackgroundTransparency={1}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.5, 0.657)}
                    Size={new UDim2(0.5, 0, -0.0207, 50)}
                    Key={"cont"}
                />
            </frame>
        )
    )
}

export namespace PlayerDeathScreen {
    export function show() {
        signal.Fire(0)
    }

    export function hide() {
        //signal.Fire(1)
    }
}