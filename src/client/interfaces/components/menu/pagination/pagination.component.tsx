import Roact from "@rbxts/roact";
import { markPureComponent } from "@rbxts/roact-hooked";

export function MenuPaginationComponent(props : {} & Roact.PropsWithChildren) : Roact.Element {
    return <imagelabel
        Key={"menu2"}
        Image={"rbxassetid://16255699706"}
        ImageColor3={Color3.fromRGB(149, 197, 255)}
        ImageTransparency={0.92}
        ScaleType={Enum.ScaleType.Crop}
        AnchorPoint={new Vector2(0.5, 0.5)}
        BackgroundColor3={Color3.fromRGB(44, 44, 44)}
        BackgroundTransparency={0.55}
        BorderColor3={Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        Position={UDim2.fromScale(0.0557, 0.561)}
        Size={UDim2.fromScale(0.0576, 0.539)}
        ZIndex={2}
    >
        <uicorner
            Key={"corner1"}
            CornerRadius={new UDim(1, 0)}
        />

        <frame
            Key={"buttons1"}
            AnchorPoint={new Vector2(0.5, 0.5)}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.5, 0.5)}
            Size={UDim2.fromScale(1, 1)}
        >
            
            <uilistlayout
                Key={"list"}
                Padding={new UDim(0, 10)}
                HorizontalAlignment={Enum.HorizontalAlignment.Center}
                SortOrder={Enum.SortOrder.LayoutOrder}
                VerticalAlignment={Enum.VerticalAlignment.Center}
            />

            {props[Roact.Children]}
        </frame>

        <uiscale />

        <imagelabel
            Key={"shadow"}
            Image={"rbxassetid://16264499577"}
            ImageTransparency={0.7}
            ScaleType={Enum.ScaleType.Slice}
            SliceCenter={new Rect(379, 379, 379, 379)}
            AnchorPoint={new Vector2(0.5, 0.5)}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.5, 0.5)}
            Size={UDim2.fromScale(1.83, 1.16)}
            ZIndex={0}
        />

        <uiaspectratioconstraint
            Key={"uIAspectRatioConstraint7"}
            AspectRatio={0.19}
        />
    </imagelabel>
}

markPureComponent(MenuPaginationComponent);