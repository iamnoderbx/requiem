import Roact from "@rbxts/roact";
import { markPureComponent } from "@rbxts/roact-hooked";

export default function ProgressionListComponent(props : {} & Roact.PropsWithChildren) : Roact.Element {
    return (<frame
        Key={"list"}
        AnchorPoint={new Vector2(0.5, 0.5)}
        BackgroundColor3={Color3.fromRGB(0, 0, 0)}
        BackgroundTransparency={1}
        BorderColor3={Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        Position={UDim2.fromScale(0.523, 0.548)}
        Size={UDim2.fromScale(0.698, 0.518)}
      >
        <uilistlayout
          Key={"uIListLayout"}
          Padding={new UDim(0.03, 0)}
          HorizontalAlignment={Enum.HorizontalAlignment.Center}
          SortOrder={Enum.SortOrder.LayoutOrder}
          VerticalAlignment={Enum.VerticalAlignment.Center}
        />

        <uisizeconstraint
            MaxSize={new Vector2(math.huge, 450)}
        />
        
        <uipadding
            Key={"uIPadding"}
            PaddingBottom={new UDim(0, 5)}
            PaddingLeft={new UDim(0, -5)}
            PaddingRight={new UDim(0, -5)}
            PaddingTop={new UDim(0, 5)}
        />

        <uicorner
            Key={"uICorner3"}
            CornerRadius={new UDim(0.125, 0)}
        />

        <uiaspectratioconstraint
            Key={"uIAspectRatioConstraint9"}
            AspectRatio={2.37}
        />

        {props[Roact.Children]}
    </frame>)
}

markPureComponent(ProgressionListComponent);