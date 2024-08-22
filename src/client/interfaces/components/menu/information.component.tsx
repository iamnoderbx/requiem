import Roact from "@rbxts/roact";
import { markPureComponent } from "@rbxts/roact-hooked";

export function MenuOverlayInformationComponent(props: {Credits?: boolean} & Roact.PropsWithChildren): Roact.Element {
    return (
        <frame
            Key={"info"}
            AnchorPoint={new Vector2(0.5, 0.5)}
            BackgroundColor3={Color3.fromRGB(8, 9, 13)}
            BackgroundTransparency={0.1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.5, 0.5)}
            Size={UDim2.fromScale(1, 1)}
            ZIndex={-1}
        >
            {props[Roact.Children]}


            <frame
                Key={"buttons2"}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.0963, 0.164)}
                Size={UDim2.fromScale(0.0577, 0.103)}
                ZIndex={2}
                Visible={false}
            >
                <imagebutton
                    Key={"admin"}
                    AutoButtonColor={false}
                    AnchorPoint={new Vector2(0.5, 0.5)}
                    BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                    BackgroundTransparency={0.95}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.5, 0.5)}
                    Size={UDim2.fromScale(1, 1)}
                >
                    <uicorner
                        Key={"corner7"}
                        CornerRadius={new UDim(1, 0)}
                    />

                    <imagelabel
                        Key={"icon6"}
                        Image={"rbxassetid://11422919294"}
                        AnchorPoint={new Vector2(0.5, 0.5)}
                        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                        BackgroundTransparency={1}
                        BorderColor3={Color3.fromRGB(0, 0, 0)}
                        BorderSizePixel={0}
                        Position={UDim2.fromScale(0.5, 0.5)}
                        Size={UDim2.fromScale(0.45, 0.45)}
                    >
                        <uiscale />
                        <uiaspectratioconstraint />
                    </imagelabel>

                    <uigradient
                        Key={"gradient6"}
                        Enabled={false}
                        Transparency={new NumberSequence([
                            new NumberSequenceKeypoint(0, 0),
                            new NumberSequenceKeypoint(1, 0.331),
                        ])}
                    />
                </imagebutton>

                <uilistlayout
                    Key={"uIListLayout"}
                    Padding={new UDim(0, 10)}
                    FillDirection={Enum.FillDirection.Horizontal}
                    SortOrder={Enum.SortOrder.LayoutOrder}
                />

                <imagebutton
                    Key={"servers"}
                    AutoButtonColor={false}
                    AnchorPoint={new Vector2(0.5, 0.5)}
                    BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                    BackgroundTransparency={0.95}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.5, 0.5)}
                    Size={UDim2.fromScale(1, 1)}
                >
                    <uicorner
                        Key={"corner8"}
                        CornerRadius={new UDim(1, 0)}
                    />

                    <imagelabel
                        Key={"icon7"}
                        Image={"rbxassetid://12967538136"}
                        AnchorPoint={new Vector2(0.5, 0.5)}
                        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                        BackgroundTransparency={1}
                        BorderColor3={Color3.fromRGB(0, 0, 0)}
                        BorderSizePixel={0}
                        Position={UDim2.fromScale(0.5, 0.5)}
                        Size={UDim2.fromScale(0.45, 0.45)}
                    >
                        <uiscale />
                        <uiaspectratioconstraint />
                    </imagelabel>

                    <uigradient
                        Key={"gradient7"}
                        Enabled={false}
                        Transparency={new NumberSequence([
                            new NumberSequenceKeypoint(0, 0),
                            new NumberSequenceKeypoint(1, 0.331),
                        ])}
                    />
                </imagebutton>
                <uiaspectratioconstraint />
            </frame>

            <textlabel
                Key={"req_label"}
                FontFace={new Font(
                    "rbxasset://fonts/families/SourceSansPro.json",
                    Enum.FontWeight.Bold,
                    Enum.FontStyle.Normal
                )}
                Text={"REQUIEM"}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextScaled={true}
                TextSize={14}
                TextTransparency={0.95}
                TextWrapped={true}
                TextXAlignment={Enum.TextXAlignment.Left}
                TextYAlignment={Enum.TextYAlignment.Bottom}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.0264, 0.919)}
                Size={UDim2.fromScale(0.175, 0.0374)}
                Visible={props.Credits ?? true}
            />

            <textlabel
                Key={"req_label2"}
                FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                Text={"A permanent death experience."}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextScaled={true}
                TextSize={14}
                TextTransparency={0.95}
                TextWrapped={true}
                TextXAlignment={Enum.TextXAlignment.Left}
                TextYAlignment={Enum.TextYAlignment.Bottom}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.0264, 0.956)}
                Size={UDim2.fromScale(0.175, 0.0233)}
                Visible={props.Credits ?? true}
            />

            <imagelabel
                Key={"imageLabel"}
                Image={"rbxassetid://16255699706"}
                ImageColor3={Color3.fromRGB(85, 95, 136)}
                ImageTransparency={0.9}
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.5, 0.5)}
                Size={UDim2.fromScale(1.5, 1.5)}
                ZIndex={-1}
            />
        </frame>
    )
}

markPureComponent(MenuOverlayInformationComponent);