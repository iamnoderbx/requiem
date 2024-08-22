import Roact from "@rbxts/roact";
import { markPureComponent } from "@rbxts/roact-hooked";

export function SubPageCloseButton(props: { Clicked: () => void, UseCloseButton?: boolean}) {
    return <imagebutton
        Key={"ImageLabel"}
        Image={props.UseCloseButton ? "rbxassetid://11293981586" : "rbxassetid://11422143469"}
        ImageTransparency={0.24}
        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
        BackgroundTransparency={1}
        BorderColor3={Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        Position={UDim2.fromScale(0.915, 0.265)}
        Size={UDim2.fromScale(0.0376, 0.3)}
        ZIndex={2}
        Event={{MouseButton1Down: props.Clicked}}
    >
        <uiaspectratioconstraint
            Key={"UIAspectRatioConstraint"}
            AspectRatio={1.02}
        />
    </imagebutton>
}

markPureComponent(SubPageCloseButton);

export default function SubPageHeaderComponent(props: { image: string, title: string, description: string, button?: string } & Roact.PropsWithChildren) {
    return <frame
        AnchorPoint={new Vector2(0.5, 0.5)}
        BackgroundColor3={Color3.fromRGB(41, 44, 52)}
        BackgroundTransparency={1}
        BorderColor3={Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        Position={UDim2.fromScale(0.506, 0)}
        Size={UDim2.fromScale(1, 0.14)}
        ZIndex={2}
        Key={"header"}
        LayoutOrder={-5}
    >
        <uicorner
            Key={"UICorner"}
            CornerRadius={new UDim(1, 0)}
        />

        <imagelabel
            Key={"ImageLabel"}
            Image={props.image}
            ImageTransparency={0.24}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.0331, 0.291)}
            Size={UDim2.fromScale(0.0519, 0.413)}
            ZIndex={2}
        >
            <uiaspectratioconstraint
                Key={"UIAspectRatioConstraint"}
                AspectRatio={1.02}
            />
        </imagelabel>

        <textlabel
            Key={"TextLabel1"}
            FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
            Text={props.description}
            TextColor3={Color3.fromRGB(255, 255, 255)}
            TextScaled={true}
            TextSize={14}
            TextTransparency={0.46}
            TextWrapped={true}
            TextXAlignment={Enum.TextXAlignment.Left}
            TextYAlignment={Enum.TextYAlignment.Bottom}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.133, 0.54)}
            Size={UDim2.fromScale(0.533, 0.14)}
            ZIndex={2}
        />

        <textlabel
            Key={"TextLabel2"}
            FontFace={new Font(
                "rbxasset://fonts/families/SourceSansPro.json",
                Enum.FontWeight.SemiBold,
                Enum.FontStyle.Normal
            )}
            Text={props.title}
            TextColor3={Color3.fromRGB(255, 255, 255)}
            TextScaled={true}
            TextSize={14}
            TextTransparency={0.24}
            TextWrapped={true}
            TextXAlignment={Enum.TextXAlignment.Left}
            TextYAlignment={Enum.TextYAlignment.Bottom}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.106, 0.282)}
            Size={UDim2.fromScale(0.304, 0.189)}
            ZIndex={2}
        />

        <imagelabel
            Key={"ImageLabel1"}
            Image={"rbxassetid://11422155687"}
            ImageTransparency={0.51}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.104, 0.526)}
            Size={UDim2.fromScale(0.0201, 0.168)}
            ZIndex={2}
        >
            <uiaspectratioconstraint
                Key={"UIAspectRatioConstraint"}
                AspectRatio={1.02}
            />
        </imagelabel>

        <imagelabel
            Image={"rbxassetid://16264499577"}
            ImageTransparency={0.26}
            ScaleType={Enum.ScaleType.Slice}
            SliceCenter={new Rect(379, 379, 379, 379)}
            AnchorPoint={new Vector2(0.5, 0.5)}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.5, 0.507)}
            Size={new UDim2(1.03, 50, 1.25, 50)}
            ZIndex={0}
            Key={"shadow"}
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
            Key={"menu2"}
        >
            <uicorner
                Key={"UICorner"}
                CornerRadius={new UDim(1, 0)}
            />
        </imagelabel>

        {props[Roact.Children]}

        <textlabel
            Key={"TextLabel"}
            FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
            Text={props.button ?? "Return"}
            TextColor3={Color3.fromRGB(255, 255, 255)}
            TextScaled={true}
            TextSize={14}
            TextTransparency={0.5}
            TextWrapped={true}
            TextYAlignment={Enum.TextYAlignment.Bottom}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.908, 0.585)}
            Size={UDim2.fromScale(0.0499, 0.147)}
            ZIndex={2}
        />
    </frame>
}

markPureComponent(SubPageHeaderComponent);