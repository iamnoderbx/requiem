import { Spring, useMotor } from "@rbxts/pretty-roact-hooks";
import Roact from "@rbxts/roact";
import { useState, withHooks } from "@rbxts/roact-hooked";

export default withHooks(function(props : {visible: boolean, layoutOrder? : number, text: string, color : Color3, icon? : string, glow?: boolean, clicked?: () => void}): Roact.Element {
    const [ glowTransparency, setGlowTransparency ] = useMotor(1);
    
    return <frame
        Key={"frame"}
        BackgroundColor3={Color3.fromRGB(32, 33, 34)}
        BorderColor3={Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        Size={UDim2.fromOffset(100, 100)}
        ZIndex={16}
        LayoutOrder={props.layoutOrder ?? 0}
        Visible={props.visible}

        Event={{
            MouseEnter: () => {
                setGlowTransparency(new Spring(0.3));
            },
            MouseLeave: () => {
                setGlowTransparency(new Spring(1));
            }
        }}
    >
        <textbutton
            Key={"textButton"}
            Text={""}
            BackgroundTransparency={1}
            Size={UDim2.fromScale(1, 1)}
            ZIndex={30}
            Event={{
                MouseButton1Click: props.clicked
            }}
        />
        <uicorner
            Key={"uICorner"}
            CornerRadius={new UDim(0, 4)}
        />

        <uiaspectratioconstraint
            Key={"uIAspectRatioConstraint1"}
            AspectRatio={0.994}
        />

        <uistroke
            Key={"uIStroke"}
            Color={Color3.fromHSV(0.67, 0.04, 0.23)}
            Transparency={0.47}
        />

        <textlabel
            Key={"header"}
            FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
            Text={props.text}
            TextColor3={Color3.fromRGB(255, 255, 255)}
            TextSize={14}
            TextTransparency={0.25}
            TextTruncate={Enum.TextTruncate.AtEnd}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.0688, 0.6)}
            Size={UDim2.fromScale(0.862, 0.227)}
            ZIndex={18}
        />

        <imagebutton
            Key={"imageButton"}
            Image={props.icon ?? "rbxassetid://12974446859"}
            ImageColor3={props.color}
            ImageTransparency={0.28}
            AnchorPoint={new Vector2(0.5, 0.5)}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.5, 0.355)}
            Size={UDim2.fromScale(0.5, 0.5)}
            ZIndex={17}
        />

        <imagelabel
            Key={"imageLabel"}
            Image={"rbxassetid://17426485210"}
            ImageColor3={props.color}
            ImageTransparency={glowTransparency.map((value) => value)}
            AnchorPoint={new Vector2(0.5, 0.5)}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.5, 0.5)}
            Size={UDim2.fromScale(1.8, 1.8)}
            ZIndex={-1}
            // Visible={props.glow ?? false}
        >
            <uiaspectratioconstraint
                Key={"uIAspectRatioConstraint"}
                AspectRatio={0.996}
            />
        </imagelabel>

        <frame
            Key={"frame1"}
            AnchorPoint={new Vector2(0.5, 0.5)}
            BackgroundColor3={Color3.fromRGB(32, 33, 34)}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.5, 0.5)}
            Size={UDim2.fromScale(1, 1)}
            ZIndex={2}
        >
            <uiaspectratioconstraint
                Key={"uIAspectRatioConstraint2"}
                AspectRatio={0.994}
            />

            <uicorner
                Key={"uICorner1"}
                CornerRadius={new UDim(0, 4)}
            />
        </frame>
    </frame>
})