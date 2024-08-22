import { useMountEffect } from "@rbxts/pretty-roact-hooks";
import Roact from "@rbxts/roact";
import { useEffect, useRef, withHooks } from "@rbxts/roact-hooked";
import { RunService, TweenService } from "@rbxts/services";
import { Tooltip } from "client/interfaces/routes/tooltips.route";

const SkillNodeUnlockCache = new Map<Frame, number[]>();
const SkillNodeFrameCache = new Map<Frame, Frame[]>();
const SkillLineCache = new Map<Frame, Frame>();
const SkillLineConnections = new Map<Frame, Frame[]>();

export function SkillTreeNodeComponent(props: { Display?: string, Position: UDim2, Id: number, Unlocks?: number[], Info?: [string, string] }) {
    return <frame
        Key={"id_" + props.Id}
        BackgroundColor3={Color3.fromRGB(31, 35, 42)}
        BackgroundTransparency={1}
        BorderColor3={Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        Position={props.Position}
        Size={UDim2.fromScale(0.0715, 0.17)}
        ZIndex={18}
        Ref={(frame) => {
            if (!frame) return;

            SkillNodeUnlockCache.set(frame, props.Unlocks ?? []);
        }}
        Event={props.Info ? {
            MouseEnter: (frame) => {
                if (!props.Info) return

                const anchorOffset = new Vector2((frame.AbsoluteSize.X) * frame.AnchorPoint.X, frame.AbsoluteSize.Y * frame.AnchorPoint.Y);
                const screenSpacePosition = new Vector2((frame.AbsolutePosition.X + anchorOffset.X), frame.AbsolutePosition.Y + anchorOffset.Y);

                Tooltip.show(screenSpacePosition, props.Info[0], props.Info[1])
            },

            MouseLeave: (frame) => {
                if (!props.Info) return
                const anchorOffset = new Vector2((frame.AbsoluteSize.X) * frame.AnchorPoint.X, frame.AbsoluteSize.Y * frame.AnchorPoint.Y);
                const screenSpacePosition = new Vector2((frame.AbsolutePosition.X + anchorOffset.X), frame.AbsolutePosition.Y + anchorOffset.Y);
                Tooltip.hide(screenSpacePosition)
            }
        } : {}}
        AnchorPoint={new Vector2(0.5, 0.5)}
    >
        <uicorner
            CornerRadius={new UDim(1, 0)}
            Key={"uICorner2"}
        />

        <uiaspectratioconstraint
            Key={"uIAspectRatioConstraint"}
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
            Key={"menu"}
        >
            <uicorner
                Key={"UICorner"}
                CornerRadius={new UDim(1, 0)}
            />
        </imagelabel>

        <textlabel
            Key={"TextLabel"}
            FontFace={new Font(
                "rbxasset://fonts/families/Guru.json",
                Enum.FontWeight.SemiBold,
                Enum.FontStyle.Normal
            )}
            Text={props.Display ?? "!"}
            TextColor3={Color3.fromRGB(255, 255, 255)}
            TextScaled={true}
            TextSize={14}
            TextTransparency={0.19}
            TextWrapped={true}
            AnchorPoint={new Vector2(0.5, 0.5)}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.5, 0.5)}
            Size={UDim2.fromScale(0.4, 0.4)}
            ZIndex={2}
        />

        <imagelabel
            Image={"rbxassetid://16264499577"}
            ImageTransparency={0.37}
            ScaleType={Enum.ScaleType.Slice}
            SliceCenter={new Rect(379, 379, 379, 379)}
            AnchorPoint={new Vector2(0.5, 0.5)}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.5, 0.507)}
            Size={UDim2.fromScale(1.7, 1.7)}
            ZIndex={0}
            Key={"shadow"}
        />
    </frame>
}

export const SkillTreeHolderComponent = withHooks((props: { visible: boolean, animate?: boolean } & Roact.PropsWithChildren): Roact.Element => {
    const ref = useRef<Frame>();

    useEffect(() => {
        if (!props.animate || !ref.getValue()) return;

        const holder = ref.getValue()!;
        const children = holder.GetChildren();

        children.forEach((__child: Instance) => { // Change the type of the parameter from Frame to Instance
            if (SkillLineCache.has(__child as Frame)) {
                const gradient = __child.FindFirstChild("UIGradient") as UIGradient;
                if (!gradient) return;

                gradient.Transparency = new NumberSequence([
                    new NumberSequenceKeypoint(0, 1),
                    new NumberSequenceKeypoint(1, 1),
                ]);

                return
            };

            const child = __child as Frame; // Add a type assertion to Frame
            child.Size = new UDim2(0, 0, 0, 0);
        });

        const start = holder.FindFirstChild("id_0") as Frame;
        if (!start) return;

        const onFramePopup = (frame: Frame) => {
            TweenService.Create(frame, new TweenInfo(0.17, Enum.EasingStyle.Sine, Enum.EasingDirection.Out), {
                Size: UDim2.fromScale(0.0715, 0.17),
            }).Play();

            const unlockNodes = SkillNodeFrameCache.get(frame);
            if (!unlockNodes) return;

            unlockNodes.forEach((node) => task.spawn(() => {
                const lines = SkillLineConnections.get(node);
                if (!lines) return;

                lines.forEach((line) => {
                    const uIGradient = line.FindFirstChild("UIGradient") as UIGradient;
                    if (!uIGradient) return;

                    uIGradient.Rotation = 0;

                    task.spawn(() => {
                        for (let index = 0; index <= 0.98; index += 0.1) {
                            uIGradient.Transparency = new NumberSequence([
                                new NumberSequenceKeypoint(0, 0),
                                new NumberSequenceKeypoint(index, 0),
                                new NumberSequenceKeypoint(index + 0.01, 1),
                                new NumberSequenceKeypoint(1, 1),
                            ]);

                            RunService.RenderStepped.Wait();
                        }

                        uIGradient.Transparency = new NumberSequence([
                            new NumberSequenceKeypoint(0, 0),
                            new NumberSequenceKeypoint(1, 0),
                        ]);
                    })
                })


                task.wait(0.17)
                onFramePopup(node);
            }));
        }

        onFramePopup(start);
    }, [props.animate]);


    useEffect(() => {
        task.spawn(() => {
            if (!ref.getValue()) return;

            const holder = ref.getValue()!;
            const children = holder.GetChildren();

            if (holder.AbsoluteSize.Magnitude === 0) while (holder.AbsoluteSize.Magnitude === 0) task.wait(0.1);

            children.forEach((__child: Instance) => { // Change the type of the parameter from Frame to Instance
                const unlocks = SkillNodeUnlockCache.get(__child as Frame); // Add a type assertion to Frame
                if (!unlocks) return;

                const child = __child as Frame; // Add a type assertion to Frame
                SkillNodeFrameCache.set(child, []);

                child.Size = new UDim2(0, 0, 0, 0);

                unlocks.forEach((unlock) => {
                    const unlockNode = holder.FindFirstChild("id_" + unlock) as Frame;
                    if (!unlockNode) return;

                    SkillNodeFrameCache.get(child)?.push(unlockNode);

                    const line = new Instance("Frame");
                    line.Parent = holder;
                    line.BackgroundColor3 = Color3.fromRGB(46, 51, 59);
                    line.BorderSizePixel = 0;
                    line.AnchorPoint = new Vector2(0.5, 0.5);
                    line.BackgroundTransparency = 0

                    SkillLineCache.set(line, unlockNode);

                    if (!SkillLineConnections.get(unlockNode)) SkillLineConnections.set(unlockNode, [])
                    SkillLineConnections.get(unlockNode)?.push(line)
                    //SkillLineConnections.set(unlockNode, line)

                    const uIGradient = new Instance("UIGradient")
                    uIGradient.Name = "UIGradient"
                    uIGradient.Rotation = 0
                    uIGradient.Transparency = new NumberSequence([
                        new NumberSequenceKeypoint(0, 1),
                        new NumberSequenceKeypoint(1, 1),
                    ])

                    uIGradient.Parent = line;

                    const pointA = child;
                    const pointB = unlockNode;

                    const center = new UDim2(
                        (pointA.Position.X.Scale + pointB.Position.X.Scale) / 2, 0,
                        (pointA.Position.Y.Scale + pointB.Position.Y.Scale) / 2, 0
                    );

                    line.Position = center;

                    const startX = pointA.Position.X.Scale * holder.AbsoluteSize.X;
                    const startY = pointA.Position.Y.Scale * holder.AbsoluteSize.Y;

                    const endX = pointB.Position.X.Scale * holder.AbsoluteSize.X;
                    const endY = pointB.Position.Y.Scale * holder.AbsoluteSize.Y;

                    // Calculate the rotation angle
                    let angle = math.atan2(endY - startY, endX - startX) * (180 / math.pi);

                    // Set the rotation
                    line.Rotation = angle;

                    // Calculate the distance between pointA and pointB after rotation
                    let distanceAfterRotation = math.sqrt(
                        math.pow((endX - startX) * math.cos(angle) - (endY - startY) * math.sin(angle), 2) +
                        math.pow((endX - startX) * math.sin(angle) + (endY - startY) * math.cos(angle), 2)
                    );

                    // Set the size of the line
                    line.Size = new UDim2(0, (distanceAfterRotation - (pointA.AbsoluteSize.X + pointB.AbsoluteSize.X)), 0, 3);
                })
            })
        })
    }, [ref]);

    return (
        <frame
            AnchorPoint={new Vector2(0.5, 0.5)}
            BackgroundColor3={Color3.fromRGB(41, 44, 52)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.506, 0.52)}
            Size={UDim2.fromScale(1 * 0.95, 0.793 * 0.95)}
            ZIndex={2}
            Key={"tree"}
            Ref={ref}
            Visible={props.visible}
        >
            {/* <uiaspectratioconstraint
                Key={"UIAspectRatioConstraint"}
                AspectRatio={1.57}
            /> */}

            {props[Roact.Children]}
        </frame>
    )
})