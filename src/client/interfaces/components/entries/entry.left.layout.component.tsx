import Roact from "@rbxts/roact";
import { markPureComponent } from "@rbxts/roact-hooked";

export function EntryLeftSingleLineComponent(props: {} & Roact.PropsWithChildren): Roact.Element {
    return (
        <frame
            AnchorPoint={new Vector2(0, 0.5)}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.0301, 0.504)}
            Size={UDim2.fromScale(0.435, 0.324)}
            Key={"data1"}
        >
            <uilistlayout
                Key={"UIListLayout1"}
                ItemLineAlignment={Enum.ItemLineAlignment.Center}
                Padding={new UDim(0.015, 0)}
                FillDirection={Enum.FillDirection.Horizontal}
                SortOrder={Enum.SortOrder.LayoutOrder}
                VerticalAlignment={Enum.VerticalAlignment.Center}
            />

            {props[Roact.Children]}
        </frame>
    )
}

export function EntryLeftHeaderLayoutPillsComponent(props: {} & Roact.PropsWithChildren): Roact.Element {
    return (
        <frame
            AnchorPoint={new Vector2(0, 0.5)}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.0299, 0.598)}
            Size={UDim2.fromScale(0.512, 0.158)}
            Key={"data1"}
        >
            <uilistlayout
                Key={"UIListLayout1"}
                ItemLineAlignment={Enum.ItemLineAlignment.Center}
                Padding={new UDim(0.03, 0)}
                FillDirection={Enum.FillDirection.Horizontal}
                SortOrder={Enum.SortOrder.LayoutOrder}
                VerticalAlignment={Enum.VerticalAlignment.Center}
            />

            {props[Roact.Children]}
        </frame>
    )
}

export default function EntryLeftLayoutComponent(props: {} & Roact.PropsWithChildren): Roact.Element {
    return (
        <frame
            AnchorPoint={new Vector2(0, 0.5)}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.029, 0.5)}
            Size={UDim2.fromScale(0.522, 0.343)}
            Key={"content1"}
        >
            <uilistlayout
                Key={"UIListLayout1"}
                ItemLineAlignment={Enum.ItemLineAlignment.Center}
                Padding={new UDim(0.03, 0)}
                FillDirection={Enum.FillDirection.Horizontal}
                SortOrder={Enum.SortOrder.LayoutOrder}
                VerticalAlignment={Enum.VerticalAlignment.Center}
            />

            {props[Roact.Children]}
        </frame>
    )
}

markPureComponent(EntryLeftLayoutComponent);