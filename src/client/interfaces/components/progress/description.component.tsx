import Roact from "@rbxts/roact";
import { markPureComponent } from "@rbxts/roact-hooked";
import { Workspace } from "@rbxts/services";

export default function DescriptionComponent(props: { Header: string, Body: string }): Roact.Element {
    const resolution = Workspace.CurrentCamera?.ViewportSize.Y ?? 0;
    const maxTextSize = 14;

    // Calculate the text size based on the resolution, and the maximum text size.
    let textSize = (resolution / 1080) * maxTextSize;
    
    return (
        <frame
          AutomaticSize={Enum.AutomaticSize.Y}
          BackgroundColor3={Color3.fromRGB(255, 255, 255)}
          BackgroundTransparency={1}
          BorderColor3={Color3.fromRGB(0, 0, 0)}
          BorderSizePixel={0}
          Position={UDim2.fromScale(1.89e-08, 0.481)}
          Size={UDim2.fromScale(0.991, 0.191)}
          Key={"desc"}
        >
          <textlabel
            FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
            Text={props.Header}
            TextColor3={Color3.fromRGB(255, 255, 255)}
            TextScaled={true}
            TextSize={14}
            TextTransparency={0.41}
            TextWrapped={true}
            TextXAlignment={Enum.TextXAlignment.Left}
            TextYAlignment={Enum.TextYAlignment.Bottom}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.000693, 0.518)}
            Size={UDim2.fromScale(0.529, -0.31)}
            ZIndex={3}
            Key={"header"}
          />
      
          <textlabel
            FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
            RichText={true}
            Text={props.Body}
            TextColor3={Color3.fromRGB(255, 255, 255)}
            TextDirection={Enum.TextDirection.LeftToRight}
            TextSize={textSize}
            TextTransparency={0.64}
            TextWrapped={true}
            TextXAlignment={Enum.TextXAlignment.Left}
            TextYAlignment={Enum.TextYAlignment.Top}
            AutomaticSize={Enum.AutomaticSize.Y}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(-0.00097, 0.574)}
            Size={UDim2.fromScale(0.997, 0)}
            ZIndex={3}
            Key={"body"}
          />
        </frame>
      )
}

markPureComponent(DescriptionComponent);