import Roact from "@rbxts/roact";
import CircularEditComponent from "../utilities/edit.component";
import { useState, withHooks } from "@rbxts/roact-hooked";

export const ImageListComponent = ((props: { size: UDim2, image: string, header: string, body: string, onEditClicked?: () => void}): Roact.Element => {
    const [ isHovered, setHovered ] = useState(false);
    
    return (
        <frame
            Key={"middle"}
            BackgroundColor3={Color3.fromRGB(21, 22, 25)}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            ClipsDescendants={true}
            LayoutOrder={-1}
            Position={UDim2.fromScale(0, 0.116)}
            Size={props.size}
            ZIndex={16}
        >
            <textlabel
                Key={"textLabel"}
                FontFace={new Font(
                    "rbxasset://fonts/families/SourceSansPro.json",
                    Enum.FontWeight.Bold,
                    Enum.FontStyle.Normal
                )}
                Text={props.header}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextScaled={true}
                TextSize={14}
                TextTransparency={0.28}
                TextWrapped={true}
                TextXAlignment={Enum.TextXAlignment.Left}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.142, 0.316)}
                Size={UDim2.fromScale(0.531, 0.175)}
                ZIndex={16}
            />

            <textlabel
                Key={"textLabel1"}
                FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                Text={props.body}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextScaled={true}
                TextSize={30}
                TextTransparency={0.65}
                TextTruncate={Enum.TextTruncate.AtEnd}
                TextWrapped={true}
                TextXAlignment={Enum.TextXAlignment.Left}
                TextYAlignment={Enum.TextYAlignment.Top}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Interactable={false}
                Position={UDim2.fromScale(0.141, 0.499)}
                Size={UDim2.fromScale(0.518, 0.167)}
                ZIndex={17}
            />

            <imagelabel
                Key={"imageLabel"}
                Image={props.image}
                AnchorPoint={new Vector2(0, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.0321, 0.498)}
                Size={UDim2.fromScale(0.0964, 0.694)}
                ZIndex={17}
                Event={{
                    MouseEnter: () => setHovered(true),
                    MouseLeave: () => setHovered(false)
                }}
            >
                {props.onEditClicked && <CircularEditComponent visible={isHovered} clicked={props.onEditClicked} />}
                <uiaspectratioconstraint />
            </imagelabel>

            <imagelabel
                Key={"imageLabel1"}
                Image={props.image}
                ImageColor3={Color3.fromRGB(193, 193, 193)}
                ImageTransparency={0.92}
                AnchorPoint={new Vector2(0, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.707, 0.467)}
                Size={UDim2.fromScale(0.349, 2.51)}
                ZIndex={17}
            >
                <uiaspectratioconstraint />
            </imagelabel>
        </frame>
    )
})