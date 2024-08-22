import Roact from "@rbxts/roact";
import { markPureComponent } from "@rbxts/roact-hooked";

type DirectionFrame = CanvasGroup & {
	label: Frame & {
		UICorner: UICorner;
		north: TextLabel;
	};
}

export function CreateCompassNodeFrame(text : string, node : { angle : number, text : string, icon?: string, color?: Color3 }) : DirectionFrame {
    const label = new Instance("CanvasGroup");
    label.AnchorPoint = new Vector2(0.5, 0.5);
    label.BackgroundColor3 = node.color ?? Color3.fromRGB(0, 0, 0);
    label.BackgroundTransparency = 0;
    label.BorderSizePixel = 0;
    label.Name = text;
    label.Position = UDim2.fromScale(0.5, 0.5)
    label.Size = UDim2.fromScale(0.055, 0.7)

    const uIAspectRatioConstraint = new Instance("UIAspectRatioConstraint")
    uIAspectRatioConstraint.Name = "UIAspectRatioConstraint"
    uIAspectRatioConstraint.AspectRatio = 1
    
    uIAspectRatioConstraint.Parent = label;

    const UICorner = new Instance("UICorner");
    UICorner.CornerRadius = new UDim(1, 0);
    UICorner.Parent = label;

    const north = new Instance("TextLabel");
    north.AnchorPoint = new Vector2(0.5, 0.5);
    north.BackgroundTransparency = 1;
    north.Font = Enum.Font.SourceSansBold;
    north.FontFace = new Font(
        "rbxasset://fonts/families/SourceSansPro.json",
        Enum.FontWeight.Bold,
        Enum.FontStyle.Normal
    )
    north.Name = "north";
    north.Position = new UDim2(0.5, 0, 0.5, 0);
    north.Size = new UDim2(0.8, 0, 0.8, 0);
    north.Text = string.upper(text);
    north.TextColor3 = Color3.fromRGB(255, 255, 255);
    north.TextScaled = true;
    north.TextSize = 14;
    north.TextWrapped = true;
    north.Visible = false;
    north.Parent = label;

    const ImageLabel = new Instance("ImageLabel");
    ImageLabel.AnchorPoint = new Vector2(0.5, 0.5);
    ImageLabel.BackgroundTransparency = 1;
    ImageLabel.Image = node.icon ?? "rbxassetid://11422924261";
    ImageLabel.Position = new UDim2(0.5, 0, 0.5, 0);
    ImageLabel.Size = new UDim2(0.8, 0, 0.8, 0);
    ImageLabel.Parent = label;
    ImageLabel.Visible = node.icon !== undefined;
    ImageLabel.ImageColor3 =Color3.fromRGB(255, 255, 255);

    return label as unknown as DirectionFrame;
}

export function CreateCompassDirectionFrame(text : string) : DirectionFrame {
    const north = new Instance("CanvasGroup")
    north.Name = text
    north.AnchorPoint = new Vector2(0.5, 0.5)
    north.BackgroundColor3 = Color3.fromRGB(0, 0, 0)
    north.BackgroundTransparency = 1
    north.BorderColor3 = Color3.fromRGB(0, 0, 0)
    north.BorderSizePixel = 0
    north.Position = UDim2.fromScale(0.5, 0.5)
    north.Size = UDim2.fromScale(0.054, 0.769)

    const uIAspectRatioConstraint = new Instance("UIAspectRatioConstraint")
    uIAspectRatioConstraint.Name = "UIAspectRatioConstraint"
    uIAspectRatioConstraint.AspectRatio = 1
    
    uIAspectRatioConstraint.Parent = north;

    const label = new Instance("Frame")
    label.Name = "label"
    label.AnchorPoint = new Vector2(0.5, 0.5)
    label.BackgroundColor3 = Color3.fromRGB(0, 0, 0)
    label.BackgroundTransparency = 0.45
    label.BorderColor3 = Color3.fromRGB(0, 0, 0)
    label.BorderSizePixel = 0
    label.Position = UDim2.fromScale(0.5, 0.5)
    label.Size = UDim2.fromScale(1, 1)

    const uICorner = new Instance("UICorner")
    uICorner.Name = "UICorner"
    uICorner.CornerRadius = new UDim(0, 5)
    uICorner.Parent = label

    const north1 = new Instance("TextLabel")
    north1.Name = "north"
    north1.FontFace = new Font(
        "rbxasset://fonts/families/SourceSansPro.json",
        Enum.FontWeight.Bold,
        Enum.FontStyle.Normal
    )

    north1.Text = string.upper(text)
    north1.TextColor3 = Color3.fromRGB(255, 255, 255)
    north1.TextScaled = true
    north1.TextSize = 14
    north1.TextWrapped = true
    north1.AnchorPoint = new Vector2(0.5, 0.5)
    north1.BackgroundColor3 = Color3.fromRGB(255, 255, 255)
    north1.BackgroundTransparency = 1
    north1.BorderColor3 = Color3.fromRGB(0, 0, 0)
    north1.BorderSizePixel = 0
    north1.Position = UDim2.fromScale(0.5, 0.5)
    north1.Size = UDim2.fromScale(0.8, 0.8)
    north1.Parent = label

    label.Parent = north
    return north as DirectionFrame;
}

export default function CompassComponent(props: {Visible?: boolean, ref: Roact.Ref<Frame> }): Roact.Element {
    return (
        <frame
          Key={"compass"}
          AnchorPoint={new Vector2(0.5, 0)}
          BackgroundColor3={Color3.fromRGB(0, 0, 0)}
          BackgroundTransparency={1}
          BorderColor3={Color3.fromRGB(0, 0, 0)}
          BorderSizePixel={0}
          Position={UDim2.fromScale(0.5, 0.00671)}
          Size={UDim2.fromScale(0.45, 0.0556)}
          ClipsDescendants={true}
          Ref={props.ref}
          Visible={props.Visible}
        >
          
        </frame>
      )
}

markPureComponent(CompassComponent);