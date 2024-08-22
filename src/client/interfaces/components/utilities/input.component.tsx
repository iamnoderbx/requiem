import { Spring, useMotor } from "@rbxts/pretty-roact-hooks";
import Roact from "@rbxts/roact";
import { useState, withHooks } from "@rbxts/roact-hooked";
import { Color } from "shared/utilities/color.utilities";

export const InputColorLabelComponent = withHooks((props: { Changed: (Color: Color3) => void, Color: Color3, Default?: Color3 }) => {
    const [style, setStyle] = useMotor({
        r: 255, g: 255, b: 255, // Color
        x: 0.02, y: 0.5, h: 0.45 // X, Y, Height
    })

    const [color, setColor] = useState(props.Default ?? Color.random());

    return (
        <frame
            BackgroundColor3={Color3.fromRGB(44, 44, 44)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(-0.00187, 0)}
            Size={UDim2.fromScale(1, 0.444)}
            Key={"buttonB1"}
        >
            <uicorner Key={"UICorner"} />

            <frame
                AnchorPoint={new Vector2(1, 0.5)}
                BackgroundColor3={color}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.985, 0.5)}
                Size={UDim2.fromScale(0.0275, 0.457)}
                Key={"color1"}
            >
                <uicorner
                    Key={"UICorner1"}
                    CornerRadius={new UDim(1, 0)}
                />

                <uiaspectratioconstraint Key={"UIAspectRatioConstraint"} />
            </frame>

            <textlabel
                FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                Text={"Output Hex Color"}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextScaled={true}
                TextSize={14}
                TextTransparency={0.65}
                TextWrapped={true}
                TextXAlignment={Enum.TextXAlignment.Right}
                TextYAlignment={Enum.TextYAlignment.Bottom}
                AnchorPoint={new Vector2(1, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.943, 0.5)}
                Size={UDim2.fromScale(0.725, 0.437)}
                ZIndex={3}
                Key={"header21"}
            />

            <imagelabel
                Key={"ImageLabel1"}
                Image={"rbxassetid://16255699706"}
                ImageColor3={Color3.fromRGB(85, 95, 136)}
                ImageTransparency={1}
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.5, 0.5)}
                Size={UDim2.fromScale(1, 1)}
                ZIndex={-1}
            >
                <uicorner Key={"UICorner"} />

                <uistroke
                    Key={"UIStroke1"}
                    Color={style.map(({ r, g, b }) => Color3.fromRGB(r, g, b))}
                    Transparency={0.74}
                />
            </imagelabel>

            <textbox
                Key={"TextBox1"}
                CursorPosition={-1}
                FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                PlaceholderColor3={Color3.fromRGB(109, 109, 109)}
                Text={""}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextScaled={true}
                TextSize={14}
                TextTransparency={0.3}
                TextWrapped={true}
                TextXAlignment={Enum.TextXAlignment.Left}
                AnchorPoint={new Vector2(0, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.0323, 0.5)}
                Size={UDim2.fromScale(0.913, 0.45)}

                Event={{
                    Focused: () => {
                        setStyle({
                            r: new Spring(props.Color.R * 255), g: new Spring(props.Color.G * 255), b: new Spring(props.Color.B * 255),
                            x: new Spring(0.02), y: new Spring(0), h: new Spring(0.4)
                        })
                    },

                    FocusLost: (label) => {
                        if (label.Text === "" || label.Text === " ") {
                            setStyle({
                                r: new Spring(255), g: new Spring(255), b: new Spring(255),
                                x: new Spring(0.02), y: new Spring(0.5), h: new Spring(0.45)
                            })
                        } else {
                            setColor(Color.fromHex(label.Text));
                            props.Changed(Color.fromHex(label.Text));
                        }
                    }
                }}
            />

            <frame
                Key={"Frame1"}
                AnchorPoint={new Vector2(0, 0.5)}
                AutomaticSize={Enum.AutomaticSize.X}
                BackgroundColor3={Color3.fromRGB(9, 10, 13)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                SizeConstraint={Enum.SizeConstraint.RelativeYY}
                Position={style.map(({ x, y }) => UDim2.fromScale(x, y))}
                Size={style.map(({ h }) => UDim2.fromScale(0, h))}
            >
                <textlabel
                    FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                    Text={"Hex Code"}
                    TextColor3={style.map(({ r, g, b }) => Color3.fromRGB(r, g, b))}
                    TextScaled={true}
                    TextSize={14}
                    TextTransparency={0.3}
                    TextWrapped={true}
                    TextXAlignment={Enum.TextXAlignment.Left}
                    Active={true}
                    AnchorPoint={new Vector2(0, 0.5)}
                    AutomaticSize={Enum.AutomaticSize.X}
                    BackgroundColor3={Color3.fromRGB(248, 248, 248)}
                    BackgroundTransparency={1}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0, 0.5)}
                    Selectable={true}
                    Size={UDim2.fromScale(1, 1)}
                    SizeConstraint={Enum.SizeConstraint.RelativeYY}
                    Key={"TextBox1"}
                />

                <frame
                    Key={"Frame1"}
                    AnchorPoint={new Vector2(0.5, 0.5)}
                    BackgroundColor3={Color3.fromRGB(9, 10, 13)}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.5, 0.5)}
                    Size={new UDim2(1, 10, 1, 10)}
                    ZIndex={0}
                />
            </frame>
        </frame>
    )
})

export const InputTextboxLabelComponent = withHooks((props: { Label: string, Changed: (Text: string) => void, Color: Color3, Default?: string}) => {
    const [style, setStyle] = useMotor({
        r: 255, g: 255, b: 255, // Color
        x: 0.02, y: 0.5, h: 0.45 // X, Y, Height
    })

    return (
        <frame
            BackgroundColor3={Color3.fromRGB(44, 44, 44)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(-0.00187, 0)}
            Size={UDim2.fromScale(1, 0.444)}
            Key={"buttonB1"}
        >
            <uicorner Key={"UICorner"} />

            <imagelabel
                Key={"ImageLabel1"}
                Image={"rbxassetid://16255699706"}
                ImageColor3={Color3.fromRGB(85, 95, 136)}
                ImageTransparency={1}
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.5, 0.5)}
                Size={UDim2.fromScale(1, 1)}
                ZIndex={-1}
            >
                <uicorner Key={"UICorner"} />

                <uistroke
                    Key={"UIStroke1"}
                    Color={style.map(({ r, g, b }) => Color3.fromRGB(r, g, b))}
                    Transparency={0.74}
                />
            </imagelabel>

            <textbox
                Key={"TextBox1"}
                CursorPosition={-1}
                FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                PlaceholderColor3={Color3.fromRGB(109, 109, 109)}
                Text={props.Default ?? ""}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextScaled={true}
                TextSize={14}
                TextTransparency={0.3}
                TextWrapped={true}
                TextXAlignment={Enum.TextXAlignment.Left}
                AnchorPoint={new Vector2(0, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.0323, 0.5)}
                Size={UDim2.fromScale(0.913, 0.45)}

                Event={{
                    Focused: () => {
                        setStyle({
                            r: new Spring(props.Color.R * 255), g: new Spring(props.Color.G * 255), b: new Spring(props.Color.B * 255),
                            x: new Spring(0.02), y: new Spring(0), h: new Spring(0.4)
                        })
                    },

                    FocusLost: (label) => {
                        if (label.Text === "" || label.Text === props.Label || label.Text === " ") {
                            setStyle({
                                r: new Spring(255), g: new Spring(255), b: new Spring(255),
                                x: new Spring(0.02), y: new Spring(0.5), h: new Spring(0.45)
                            })
                        } else {
                            props.Changed(label.Text);
                        }
                    }
                }}
            />

            <frame
                Key={"Frame1"}
                AnchorPoint={new Vector2(0, 0.5)}
                AutomaticSize={Enum.AutomaticSize.X}
                BackgroundColor3={Color3.fromRGB(9, 10, 13)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                SizeConstraint={Enum.SizeConstraint.RelativeYY}
                Position={style.map(({ x, y }) => UDim2.fromScale(x, y))}
                Size={style.map(({ h }) => UDim2.fromScale(0, h))}
            >
                <textlabel
                    FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                    Text={props.Label}
                    TextColor3={style.map(({ r, g, b }) => Color3.fromRGB(r, g, b))}
                    TextScaled={true}
                    TextSize={14}
                    TextTransparency={0.3}
                    TextWrapped={true}
                    TextXAlignment={Enum.TextXAlignment.Left}
                    Active={true}
                    AnchorPoint={new Vector2(0, 0.5)}
                    AutomaticSize={Enum.AutomaticSize.X}
                    BackgroundColor3={Color3.fromRGB(248, 248, 248)}
                    BackgroundTransparency={1}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0, 0.5)}
                    Selectable={true}
                    Size={UDim2.fromScale(1, 1)}
                    SizeConstraint={Enum.SizeConstraint.RelativeYY}
                    Key={"TextBox1"}
                />

                <frame
                    Key={"Frame1"}
                    AnchorPoint={new Vector2(0.5, 0.5)}
                    BackgroundColor3={Color3.fromRGB(9, 10, 13)}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.5, 0.5)}
                    Size={new UDim2(1, 10, 1, 10)}
                    ZIndex={0}
                />
            </frame>
        </frame>
    )
})

export const InputTextboxComponent = withHooks((props: { label: string, changed: (text: string) => void }) => {
    const [style, setStyle] = useMotor({
        r: 255, g: 255, b: 255, // Color
        x: 0.029, y: 0.5, h: 0.5 // X, Y, Height
    })

    return (
        <frame
            BackgroundColor3={Color3.fromRGB(44, 44, 44)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.5, 0.55)}
            Size={UDim2.fromScale(0.811, 0.222)}
            AnchorPoint={new Vector2(0.5, 0.5)}
        >
            <uicorner />

            <imagelabel
                Key={"imageLabel"}
                Image={"rbxassetid://16255699706"}
                ImageColor3={Color3.fromRGB(85, 95, 136)}
                ImageTransparency={1}
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.5, 0.5)}
                Size={UDim2.fromScale(1, 1)}
                ZIndex={-1}
            >
                <uicorner />

                <uistroke
                    Key={"uIStroke"}
                    Color={style.map(({ r, g, b }) => Color3.fromRGB(r, g, b))}
                    Transparency={0.74}
                />
            </imagelabel>

            <textbox
                Key={"textBox"}
                FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                PlaceholderColor3={Color3.fromRGB(109, 109, 109)}
                Text={""}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextScaled={true}
                TextSize={14}
                TextTransparency={0.3}
                TextWrapped={true}
                TextXAlignment={Enum.TextXAlignment.Left}
                AnchorPoint={new Vector2(0, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.047, 0.5)}
                Size={UDim2.fromScale(0.898, 0.5)}
                Event={{
                    Focused: () => {
                        setStyle({
                            r: new Spring(181), g: new Spring(193), b: new Spring(231),
                            x: new Spring(0.03), y: new Spring(0), h: new Spring(0.4)
                        })
                    },

                    FocusLost: (label) => {
                        if (label.Text === "" || label.Text === props.label || label.Text === " ") {
                            setStyle({
                                r: new Spring(255), g: new Spring(255), b: new Spring(255),
                                x: new Spring(0.044), y: new Spring(0.5), h: new Spring(0.5)
                            })
                        } else {
                            props.changed(label.Text);
                        }
                    }
                }}
            />

            <frame
                Key={"frame"}
                AnchorPoint={new Vector2(0, 0.5)}
                AutomaticSize={Enum.AutomaticSize.X}
                BackgroundColor3={Color3.fromRGB(31, 33, 37)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={style.map(({ x, y }) => UDim2.fromScale(x, y))}
                Size={style.map(({ h }) => UDim2.fromScale(0.231, h))}
                SizeConstraint={Enum.SizeConstraint.RelativeYY}
            >
                <textlabel
                    Key={"textBox1"}
                    FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                    Text={props.label}
                    TextColor3={style.map(({ r, g, b }) => Color3.fromRGB(r, g, b))}
                    TextScaled={true}
                    TextSize={14}
                    TextTransparency={0.3}
                    TextWrapped={true}
                    TextXAlignment={Enum.TextXAlignment.Left}
                    Active={true}
                    AnchorPoint={new Vector2(0, 0.5)}
                    AutomaticSize={Enum.AutomaticSize.X}
                    BackgroundColor3={Color3.fromRGB(248, 248, 248)}
                    BackgroundTransparency={1}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0, 0.5)}
                    Selectable={true}
                    Size={UDim2.fromScale(1, 1)}
                    SizeConstraint={Enum.SizeConstraint.RelativeYY}
                />

                <frame
                    Key={"frame1"}
                    AnchorPoint={new Vector2(0.5, 0.5)}
                    BackgroundColor3={Color3.fromRGB(31, 33, 37)}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.5, 0.5)}
                    Size={new UDim2(1, 10, 1, 10)}
                    ZIndex={0}
                />
            </frame>
        </frame>
    )
})