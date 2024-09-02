import Roact from "@rbxts/roact";
import { markPureComponent } from "@rbxts/roact-hooked";

export function EntryHeaderLabelComponent(props: { Text: string, Transparency?: number, Size?: UDim2 }): Roact.Element {
    return <textlabel
        FontFace={new Font(
            "rbxasset://fonts/families/SourceSansPro.json",
            Enum.FontWeight.Bold,
            Enum.FontStyle.Normal
        )}
        RichText={true}
        Text={props.Text}
        TextColor3={Color3.fromRGB(255, 255, 255)}
        TextScaled={true}
        TextSize={14}
        TextTransparency={props.Transparency ?? 0.24}
        TextWrapped={true}
        TextXAlignment={Enum.TextXAlignment.Left}
        TextYAlignment={Enum.TextYAlignment.Bottom}
        AutomaticSize={Enum.AutomaticSize.X}
        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
        BackgroundTransparency={1}
        BorderColor3={Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        Position={UDim2.fromScale(0.0309, 0.295)}
        Size={props.Size ?? UDim2.fromScale(0.744, 0.164)}
        ZIndex={2}
        Key={"name1"}
        LayoutOrder={-1}
    />
};

export default function EntryLabelComponent(props: { Text: string, Transparency?: number, Bold?: boolean, LayoutOrder?: number}): Roact.Element {
    return <textlabel
        FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json", props.Bold ? Enum.FontWeight.Bold : Enum.FontWeight.Regular)}
        RichText={true}
        Text={props.Text}
        TextColor3={Color3.fromRGB(255, 255, 255)}
        TextScaled={true}
        TextSize={14}
        TextTransparency={props.Transparency ?? 0.24}
        TextWrapped={true}
        TextXAlignment={Enum.TextXAlignment.Left}
        TextYAlignment={Enum.TextYAlignment.Bottom}
        AutomaticSize={Enum.AutomaticSize.X}
        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
        BackgroundTransparency={1}
        BorderColor3={Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        Position={UDim2.fromScale(0.0512, 0.321)}
        Size={UDim2.fromScale(0, 1)}
        ZIndex={2}
        Key={"name1"}
        LayoutOrder={props.LayoutOrder}
    />
}

markPureComponent(EntryLabelComponent);