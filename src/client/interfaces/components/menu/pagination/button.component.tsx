import Roact from "@rbxts/roact";
import { markPureComponent } from "@rbxts/roact-hooked";

export default function MenuPaginationButton(props : {icon : string, clicked: () => void, layoutOrder : number}) : Roact.Element {
    return <imagebutton
        Key={"home"}
        AutoButtonColor={false}
        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
        BackgroundTransparency={1}
        BorderColor3={Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        Size={UDim2.fromScale(0.833, 0.159)}
        Event={{MouseButton1Click: props.clicked}}
        LayoutOrder={props.layoutOrder}
    >
        <imagelabel
            Key={"icon1"}
            Image={props.icon}
            ImageTransparency={0.2}
            ScaleType={Enum.ScaleType.Fit}
            AnchorPoint={new Vector2(0.5, 0.5)}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.5, 0.5)}
            Size={UDim2.fromScale(0.48, 0.48)}
        >
            <uiscale />
            <uiaspectratioconstraint />
        </imagelabel>

        <uicorner
            Key={"corner2"}
            CornerRadius={new UDim(1, 0)}
        />

        <uigradient
            Key={"gradient1"}
            Transparency={new NumberSequence([
                new NumberSequenceKeypoint(0, 0),
                new NumberSequenceKeypoint(1, 0.325),
            ])}
        />
    </imagebutton>
}

markPureComponent(MenuPaginationButton);