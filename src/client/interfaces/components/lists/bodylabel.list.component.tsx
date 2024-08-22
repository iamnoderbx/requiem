import Roact from "@rbxts/roact";
import { markPureComponent } from "@rbxts/roact-hooked";
import { Workspace } from "@rbxts/services";

export default function MiddleBodyLabelListComponent(props: { title: string, description: string, layoutOrder?: number, visible?: boolean }): Roact.Element {
    const resolution = Workspace.CurrentCamera?.ViewportSize.Y ?? 0;
    const maxTextSize = 27;

    // Calculate the text size based on the resolution, and the maximum text size.
    let textSize = (resolution / 1080) * maxTextSize;
    
    return <frame
        Key={"middle1"}
        BackgroundColor3={Color3.fromRGB(0, 0, 0)}
        BackgroundTransparency={0.7}
        BorderColor3={Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        Position={UDim2.fromScale(0.0859, 0.466)}
        Size={UDim2.fromScale(1, 0.311)}
        ZIndex={16}
        LayoutOrder={props.layoutOrder ?? 0}
        Visible={props.visible ?? true}
    >
        <textlabel
            Key={"textLabel4"}
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
            Position={UDim2.fromScale(0.0391, 0.33)}
            Size={UDim2.fromScale(0.938, 0.405)}
            ZIndex={16}
        />

        <textlabel
            Key={"textLabel5"}
            FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
            Text={props.description}
            TextColor3={Color3.fromRGB(255, 255, 255)}
            TextScaled={false}
            TextSize={textSize}
            TextTransparency={0.65}
            TextWrapped={true}
            TextXAlignment={Enum.TextXAlignment.Right}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.144, 0.353)}
            Size={UDim2.fromScale(0.833, 0.359)}
            ZIndex={16}
        />
    </frame>
}

export function BottomLabelListComponent(props: { title: string, description: string, layoutOrder?: number, visible?: boolean }): Roact.Element {
    const resolution = Workspace.CurrentCamera?.ViewportSize.Y ?? 0;
    const maxTextSize = 27;

    // Calculate the text size based on the resolution, and the maximum text size.
    let textSize = (resolution / 1080) * maxTextSize;

    return <frame
        Key={"bottom"}
        BackgroundColor3={Color3.fromRGB(0, 0, 0)}
        BackgroundTransparency={1}
        BorderColor3={Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        Position={UDim2.fromScale(0.0859, 0.336)}
        Size={UDim2.fromScale(1, 0.311)}
        ZIndex={16}
        Visible={props.visible ?? true}
        LayoutOrder={props.layoutOrder ?? 0}
    >
        <frame
            Key={"frame1"}
            AnchorPoint={new Vector2(0, 1)}
            BackgroundColor3={Color3.fromRGB(0, 0, 0)}
            BackgroundTransparency={0.7}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0, 1)}
            Size={UDim2.fromScale(1, 1.29)}
        >
            <uicorner
                Key={"uICorner4"}
                CornerRadius={new UDim(0, 10)}
            />

            <uigradient
                Key={"uIGradient1"}
                Rotation={270}
                Transparency={new NumberSequence([
                    new NumberSequenceKeypoint(0, 0),
                    new NumberSequenceKeypoint(0.799, 0),
                    new NumberSequenceKeypoint(0.8, 1),
                    new NumberSequenceKeypoint(1, 1),
                ])}
            />

            <textlabel
                Key={"textLabel6"}
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
                Position={UDim2.fromScale(0.0391, 0.406)}
                Size={UDim2.fromScale(0.938, 0.315)}
                ZIndex={16}
            />

            <textlabel
                Key={"textLabel7"}
                FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                Text={props.description}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextScaled={false}
                TextSize={textSize}
                TextTransparency={0.65}
                TextWrapped={true}
                TextXAlignment={Enum.TextXAlignment.Right}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.144, 0.424)}
                Size={UDim2.fromScale(0.833, 0.28)}
                ZIndex={16}
            />
        </frame>
    </frame>
}

markPureComponent(MiddleBodyLabelListComponent);
markPureComponent(BottomLabelListComponent);