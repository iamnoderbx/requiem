import Roact from "@rbxts/roact";
import { markPureComponent } from "@rbxts/roact-hooked";

export const TopListTextComponent = markPureComponent((props: { header: string, body: string }): Roact.Element => {
    return (
        <frame
            Key={"top"}
            BackgroundColor3={Color3.fromRGB(0, 0, 0)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.0859, 0.336)}
            Size={UDim2.fromScale(1, 0.311)}
            ZIndex={16}
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
                    Position={UDim2.fromScale(0.0391, 0.239)}
                    Size={UDim2.fromScale(0.938, 0.315)}
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
                    Position={UDim2.fromScale(0.0391, 0.239)}
                    Size={UDim2.fromScale(0.938, 0.315)}
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
            </frame>
        </frame>
    )
})

export const BottomListTextComponent = markPureComponent((props: { header: string, body: string }): Roact.Element => {
    return (
        <frame
            Key={"bottom"}
            BackgroundColor3={Color3.fromRGB(0, 0, 0)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.0859, 0.336)}
            Size={UDim2.fromScale(1, 0.311)}
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
                    Position={UDim2.fromScale(0.0391, 0.406)}
                    Size={UDim2.fromScale(0.938, 0.315)}
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
                    Position={UDim2.fromScale(0.0391, 0.406)}
                    Size={UDim2.fromScale(0.938, 0.315)}
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
            </frame>
        </frame>
    )
})

export const MiddleListTextComponent = markPureComponent((props: { header: string, body: string }): Roact.Element => {
    return (
        <frame
            Key={"middle"}
            BackgroundColor3={Color3.fromRGB(0, 0, 0)}
            BackgroundTransparency={0.7}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.0859, 0.466)}
            Size={UDim2.fromScale(1, 0.311)}
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
                Position={UDim2.fromScale(0.0391, 0.33)}
                Size={UDim2.fromScale(0.938, 0.405)}
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
                Position={UDim2.fromScale(0.0391, 0.33)}
                Size={UDim2.fromScale(0.938, 0.405)}
                ZIndex={16}
            />
        </frame>
    )
})

export const SingleListTextComponent = markPureComponent((props: { position: UDim2, header: string, body: string }): Roact.Element => {
    return (
        <frame
            Key={"single"}
            BackgroundColor3={Color3.fromRGB(0, 0, 0)}
            BackgroundTransparency={0.7}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={props.position}
            Size={UDim2.fromScale(0.828, 0.117)}
            ZIndex={16}
        >
            <uicorner
                Key={"uICorner"}
                CornerRadius={new UDim(0, 10)}
            />

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
                Position={UDim2.fromScale(0.0391, 0.33)}
                Size={UDim2.fromScale(0.937, 0.405)}
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
                Position={UDim2.fromScale(0.0391, 0.33)}
                Size={UDim2.fromScale(0.937, 0.405)}
                ZIndex={16}
            />

            <uiaspectratioconstraint
                Key={"uIAspectRatioConstraint"}
                AspectRatio={7.73}
            />
        </frame>
    )
})

markPureComponent(TopListTextComponent)
markPureComponent(BottomListTextComponent)
markPureComponent(MiddleListTextComponent)
markPureComponent(SingleListTextComponent)
