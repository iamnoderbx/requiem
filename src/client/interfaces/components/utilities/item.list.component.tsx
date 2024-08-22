import { Spring, useMotor } from "@rbxts/pretty-roact-hooks";
import Roact from "@rbxts/roact";
import { withHooks } from "@rbxts/roact-hooked";

export function SimpleItemListButtonComponent(props: { Header: string, Body: string, Clicked?: () => void, Visible?: boolean}): Roact.Element {
    return (
        <frame
            BackgroundColor3={Color3.fromRGB(41, 42, 48)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            LayoutOrder={-1}
            Position={UDim2.fromScale(-3.07e-08, 0)}
            Size={UDim2.fromScale(1, 0.057)}
            Key={"detachment1"}
            Visible={props.Visible}
        >
            <uicorner
                Key={"UICorner1"}
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
                Key={"menu1"}
            >
                <uicorner
                    Key={"UICorner1"}
                    CornerRadius={new UDim(0.2, 0)}
                />
            </imagelabel>

            <imagelabel
                Key={"ImageLabel1"}
                Image={"rbxassetid://11422142913"}
                ImageTransparency={0.45}
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.964, 0.5)}
                Size={UDim2.fromScale(0.0152, 0.378)}
                ZIndex={2}
            >
                <uiaspectratioconstraint
                    Key={"UIAspectRatioConstraint1"}
                    AspectRatio={1.02}
                />
            </imagelabel>

            <textlabel
                FontFace={new Font(
                    "rbxasset://fonts/families/SourceSansPro.json",
                    Enum.FontWeight.Bold,
                    Enum.FontStyle.Normal
                )}
                RichText={true}
                Text={props.Header}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextScaled={true}
                TextSize={14}
                TextTransparency={0.58}
                TextWrapped={true}
                TextXAlignment={Enum.TextXAlignment.Left}
                TextYAlignment={Enum.TextYAlignment.Bottom}
                AnchorPoint={new Vector2(0, 0.5)}
                AutomaticSize={Enum.AutomaticSize.X}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.029, 0.5)}
                Size={UDim2.fromScale(0.12, 0.427)}
                ZIndex={2}
                Key={"name1"}
            />

            <textlabel
                FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                RichText={true}
                Text={props.Body}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextScaled={true}
                TextSize={14}
                TextTransparency={0.58}
                TextWrapped={true}
                TextXAlignment={Enum.TextXAlignment.Right}
                TextYAlignment={Enum.TextYAlignment.Bottom}
                AnchorPoint={new Vector2(0, 0.5)}
                AutomaticSize={Enum.AutomaticSize.X}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.664, 0.5)}
                Size={UDim2.fromScale(0.284, 0.385)}
                ZIndex={2}
                Key={"name2"}
            />

            <textbutton
                Key={"TextButton1"}
                FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                TextColor3={Color3.fromRGB(0, 0, 0)}
                TextSize={14}
                TextTransparency={1}
                AnchorPoint={new Vector2(1, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.993, 0.482)}
                Size={UDim2.fromOffset(320, 38)}
                Event={{
                    MouseButton1Click: props.Clicked
                }}
            />
        </frame>
    )
};

function ItemListComponent(props: { header: string, body: string, icon: string, clicked?: () => void, top?: boolean } & Roact.PropsWithChildren): Roact.Element {
    const [hover, setHover] = useMotor(0);

    return <frame
        Key={"frame2"}
        AnchorPoint={new Vector2(0.5, 0.5)}
        BackgroundColor3={Color3.fromRGB(29, 31, 37)}
        BorderColor3={Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        Position={UDim2.fromScale(0.5, 0.162)}
        Size={props.top ? hover.map((value) => new UDim2(1, value, 0.325, value)) : new UDim2(1, 0, 0.325, 0)}
        Event={{
            MouseEnter: () => props.top ? setHover(new Spring(10)) : props.top ?? setHover(new Spring(10)),
            MouseLeave: () => setHover(new Spring(0))
        }}
    >
        <textbutton
            Key={"textButton2"}
            Text={""}
            BackgroundTransparency={1}
            Size={new UDim2(1, 0, 1, 0)}
            Event={{
                MouseButton1Click: () => {
                    if (!props.clicked) return
                    if (!props.top) return;

                    return props.clicked()
                }
            }}
            Active={props.top}
        />

        <uicorner
            Key={"uICorner2"}
            CornerRadius={new UDim(0.125, 0)}
        />

        <imagelabel
            Key={"imageLabel6"}
            Image={props.icon}
            ImageTransparency={0.24}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.0331, 0.291)}
            Size={UDim2.fromScale(0.0519, 0.413)}
        >
            <uiaspectratioconstraint
                Key={"uIAspectRatioConstraint6"}
                AspectRatio={1.02}
            />
        </imagelabel>

        <textlabel
            Key={"textLabel4"}
            FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
            Text={props.body}
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
        />

        <textlabel
            Key={"textLabel5"}
            FontFace={new Font(
                "rbxasset://fonts/families/SourceSansPro.json",
                Enum.FontWeight.SemiBold,
                Enum.FontStyle.Normal
            )}
            Text={props.header}
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
        />

        <imagelabel
            Key={"imageLabel7"}
            Image={"rbxassetid://11422155687"}
            ImageTransparency={0.51}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.104, 0.526)}
            Size={UDim2.fromScale(0.0201, 0.168)}
        >
            <uiaspectratioconstraint
                Key={"uIAspectRatioConstraint7"}
                AspectRatio={1.02}
            />
        </imagelabel>

        <imagelabel
            Key={"imageLabel8"}
            Image={"rbxassetid://11422142913"}
            ImageTransparency={0.5}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.93, 0.353)}
            Size={UDim2.fromScale(0.0339, 0.27)}
        >
            <uiaspectratioconstraint
                Key={"uIAspectRatioConstraint8"}
                AspectRatio={1.02}
            />
        </imagelabel>

        <uistroke
            Key={"uIStroke2"}
            Color={Color3.fromRGB(39, 45, 54)}
        />
    </frame>
}

export default withHooks(ItemListComponent);