import Roact from "@rbxts/roact";
import { ScaleTextToBounds } from "../utilities/textscaler.effect";
import { markPureComponent } from "@rbxts/roact-hooked";

export default function EntryPillComponent(props: { Text: string, Color: Color3, LayoutOrder ?: number }): Roact.Element {
    return (
        <textbutton
            FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
            RichText={true}
            Text={props.Text}
            TextColor3={props.Color}
            TextSize={ScaleTextToBounds(14)}
            TextTransparency={0.38}
            AnchorPoint={new Vector2(1, 0.5)}
            AutomaticSize={Enum.AutomaticSize.X}
            BackgroundColor3={Color3.fromRGB(0, 0, 0)}
            BackgroundTransparency={0.95}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            LayoutOrder={props.LayoutOrder ?? -1}
            Position={UDim2.fromScale(0.877, 0.477)}
            Size={UDim2.fromScale(0.0398, 1)}
            ZIndex={6}
            Key={"price1"}
        >
            <uipadding
                Key={"UIPadding1"}
                PaddingBottom={new UDim(0.2, 0)}
                PaddingLeft={new UDim(0, 10)}
                PaddingRight={new UDim(0, 10)}
                PaddingTop={new UDim(0.2, 0)}
            />

            <uistroke
                Key={"UIStroke1"}
                ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
                Color={props.Color}
                Transparency={0.76}
            />

            <uicorner Key={"UICorner"} />
        </textbutton>
    )
}

markPureComponent(EntryPillComponent)