import Roact from "@rbxts/roact";

export default function EntryStringComponent(props: { Placeholder: string, Description: string, Changed: (value: string) => void } & Roact.PropsWithChildren): Roact.Element {
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
                ZIndex={0}
                Key={"menu1"}
            >
                <uicorner
                    Key={"UICorner1"}
                    CornerRadius={new UDim(0.2, 0)}
                />
            </imagelabel>

            <textlabel
                FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                RichText={true}
                Text={props.Description}
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
                Size={UDim2.fromScale(0.317, 0.385)}
                ZIndex={2}
                Key={"name1"}
            />

            <imagelabel
                Image={"rbxassetid://16255699706"}
                ImageColor3={Color3.fromRGB(149, 197, 255)}
                ImageTransparency={0.99}
                ScaleType={Enum.ScaleType.Crop}
                AnchorPoint={new Vector2(0, 0.5)}
                BackgroundColor3={Color3.fromRGB(19, 20, 24)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.0281, 0.5)}
                Size={UDim2.fromScale(0.308, 0.692)}
                Key={"add1"}
            >
                <uicorner
                    Key={"UICorner1"}
                    CornerRadius={new UDim(0.4, 0)}
                />

                <uistroke
                    Key={"UIStroke1"}
                    Color={Color3.fromRGB(44, 48, 62)}
                />

                <textbox
                    CursorPosition={-1}
                    FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                    PlaceholderText={props.Placeholder}
                    Text={""}
                    TextColor3={Color3.fromRGB(248, 248, 248)}
                    TextScaled={true}
                    TextSize={14}
                    TextTransparency={0.48}
                    TextWrapped={true}
                    TextXAlignment={Enum.TextXAlignment.Left}
                    TextYAlignment={Enum.TextYAlignment.Bottom}
                    Active={false}
                    AnchorPoint={new Vector2(0, 0.5)}
                    BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                    BackgroundTransparency={1}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.0358, 0.5)}
                    Selectable={false}
                    Size={UDim2.fromScale(0.86, 0.553)}
                    ZIndex={2}
                    Key={"name1"}
                    Event={{
                        FocusLost: (box : TextBox, enterPressed: boolean) => {
                            if (enterPressed) {
                                props.Changed(box.Text);
                            }
                        }
                    }}
                />
            </imagelabel>
        </frame>
    )
};