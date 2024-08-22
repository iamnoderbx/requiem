import Roact from "@rbxts/roact";
import { markPureComponent } from "@rbxts/roact-hooked";

// DANGER: Color3.fromRGB(255, 85, 85)
export function ButtonItemComponent(props: { Text: string, Color: Color3, Clicked: (label : TextButton) => void, Inverse?: boolean, Bold?: boolean }) {
    return <textbutton
        FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json", props.Bold ? Enum.FontWeight.Bold : Enum.FontWeight.Regular)}
        Text={props.Text}
        TextColor3={!props.Inverse ? props.Color : Color3.fromRGB(0, 0, 0)}
        TextScaled={true}
        TextSize={14}
        TextTransparency={!props.Inverse ? 0.41 : 0}
        TextWrapped={true}
        BackgroundColor3={props.Inverse ? props.Color : Color3.fromRGB(255, 255, 255)}
        BackgroundTransparency={props.Inverse ? 0 : 1}
        BorderColor3={Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        Position={UDim2.fromScale(0.864, 0.256)}
        Size={UDim2.fromScale(0.136, 0.487)}
        Key={"delete"}
        Event={{
            MouseButton1Click: (label) => {props.Clicked(label)}
        }}
    >
        <uipadding
            Key={"UIPadding"}
            PaddingBottom={new UDim(0.235, 0)}
            PaddingTop={new UDim(0.235, 0)}
        />

        <uistroke
            Key={"UIStroke"}
            ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
            Color={props.Color}
            Transparency={0.76}
        />

        <uicorner Key={"UICorner"} />

        <uiaspectratioconstraint
            Key={"UIAspectRatioConstraint"}
            AspectRatio={2.73}
        />
    </textbutton>
}

markPureComponent(ButtonItemComponent);

export default function ButtonListComponents(props: {} & Roact.PropsWithChildren) {
    return (
        <frame
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            LayoutOrder={1}
            Position={UDim2.fromScale(0.00467, 0.904)}
            Size={UDim2.fromScale(0.991, 0.154)}
            Key={"buttons"}
        >
            <uilistlayout
                Key={"UIListLayout"}
                Padding={new UDim(0.01, 0)}
                FillDirection={Enum.FillDirection.Horizontal}
                HorizontalAlignment={Enum.HorizontalAlignment.Right}
                SortOrder={Enum.SortOrder.LayoutOrder}
                VerticalAlignment={Enum.VerticalAlignment.Center}
            />

            {props[Roact.Children]}
        </frame>
    )
}

markPureComponent(ButtonListComponents);