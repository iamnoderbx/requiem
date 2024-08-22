import Roact from "@rbxts/roact";
import { markPureComponent } from "@rbxts/roact-hooked";

export default function HomeMenuAttributes(props : {} & Roact.PropsWithChildren): Roact.Element {
    return (
        <frame
            Key={"attributes"}
            BackgroundColor3={Color3.fromRGB(0, 0, 0)}
            BackgroundTransparency={0.55}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.156, 0.696)}
            Size={UDim2.fromScale(0.322, 0.226)}
            ZIndex={5}
        >
            
            {props[Roact.Children]}

            <uilistlayout
                Key={"uIListLayout1"}
                Padding={new UDim(-0.07, 0)}
                HorizontalAlignment={Enum.HorizontalAlignment.Center}
                SortOrder={Enum.SortOrder.LayoutOrder}
            />

            <uicorner
                Key={"uICorner9"}
                CornerRadius={new UDim(0, 10)}
            />

            <uiaspectratioconstraint
                Key={"uIAspectRatioConstraint13"}
                AspectRatio={2.54}
            />
        </frame>
    )
}

markPureComponent(HomeMenuAttributes);