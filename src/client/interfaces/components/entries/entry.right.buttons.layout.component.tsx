import Roact from "@rbxts/roact";
import { markPureComponent } from "@rbxts/roact-hooked";

export default function EntryRightButtonsLayoutComponent(props: {} & Roact.PropsWithChildren): Roact.Element {
    return (
        <frame
            AnchorPoint={new Vector2(0, 0.5)}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.787, 0.499)}
            Size={UDim2.fromScale(0.195, 0.508)}
            Key={"BUTTONS1"}
        >
            <uilistlayout
                Key={"UIListLayout1"}
                ItemLineAlignment={Enum.ItemLineAlignment.Center}
                Padding={new UDim(0.03, 0)}
                FillDirection={Enum.FillDirection.Horizontal}
                HorizontalAlignment={Enum.HorizontalAlignment.Right}
                SortOrder={Enum.SortOrder.LayoutOrder}
                VerticalAlignment={Enum.VerticalAlignment.Center}
            />

            {props[Roact.Children]}
        </frame>
    )
}

markPureComponent(EntryRightButtonsLayoutComponent);