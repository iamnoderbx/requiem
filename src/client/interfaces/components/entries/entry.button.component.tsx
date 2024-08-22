import Roact from "@rbxts/roact";
import { ScaleTextToBounds } from "../utilities/textscaler.effect";
import { markPureComponent } from "@rbxts/roact-hooked";

export default function EntryButtonComponent(props: { Text: string, Color: Color3, Filled?: boolean, LayoutOrder?: number, Clicked: () => void }): Roact.Element {
    return <textbutton
        FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json", props.Filled ? Enum.FontWeight.Bold : Enum.FontWeight.Regular)}
        Text={props.Text}
        TextColor3={props.Filled ? Color3.fromRGB(230, 230, 230) : props.Color}
        TextSize={ScaleTextToBounds(14)}
        TextTransparency={0.41}
        AutomaticSize={Enum.AutomaticSize.X}
        BackgroundColor3={props.Filled ? props.Color : Color3.fromRGB(255, 255, 255)}
        BackgroundTransparency={props.Filled ? 0 : 1}
        BorderColor3={Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        Position={UDim2.fromScale(0.901, 0.245)}
        Size={UDim2.fromScale(0, 1)}
        Key={"delete1"}
        LayoutOrder={props.LayoutOrder}
        Event={{
            MouseButton1Down: () => {
                props.Clicked();
            }
        }}
    >
        <uipadding
            Key={"UIPadding1"}
            PaddingBottom={new UDim(0.2, 0)}
            PaddingLeft={new UDim(0, 20)}
            PaddingRight={new UDim(0, 20)}
            PaddingTop={new UDim(0.2, 0)}
        />

        <uistroke
            Key={"UIStroke1"}
            ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
            Color={props.Color}
            Transparency={props.Filled ? 1 : 0.76}
        />

        <uicorner Key={"UICorner"} />
    </textbutton>
}

markPureComponent(EntryButtonComponent)