import Roact from "@rbxts/roact";
import { markPureComponent } from "@rbxts/roact-hooked";

export default function VowHolderComponent(props: {} & Roact.PropsWithChildren): Roact.Element {
    return <frame
        BackgroundColor3={Color3.fromRGB(41, 42, 48)}
        BackgroundTransparency={1}
        BorderColor3={Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        Position={UDim2.fromScale(-5.9e-08, 1.96e-08)}
        Size={UDim2.fromScale(0.962, 0.345)}
        Key={"vow"}
    >
        <uicorner
            Key={"UICorner"}
            CornerRadius={new UDim(0.2, 0)}
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
                CornerRadius={new UDim(0, 10)}
            />
        </imagelabel>

        <frame
            AnchorPoint={new Vector2(0.5, 0.5)}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.5, 0.5)}
            Size={UDim2.fromScale(1, 1)}
            Key={"content"}
        >
            <uilistlayout
                Key={"UIListLayout"}
                Padding={new UDim(0.08, 0)}
                HorizontalAlignment={Enum.HorizontalAlignment.Center}
                SortOrder={Enum.SortOrder.LayoutOrder}
                VerticalAlignment={Enum.VerticalAlignment.Center}
            />
            {props[Roact.Children]}
        </frame>
    </frame>
}

markPureComponent(VowHolderComponent);