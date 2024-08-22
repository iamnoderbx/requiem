import Roact from "@rbxts/roact";
import { markPureComponent } from "@rbxts/roact-hooked";
import { Treasuries } from "shared/Treasuries";

export default function TreasuryGeneralSettingsComponent(props: { Name: string, Identifier: number, OnNameChanged: (name: string, frame: Frame) => void }): Roact.Element {
    const isReservedName = Treasuries.isTreasuryReservedName(props.Name);
    const canBeRenamed = !isReservedName;

    return (
        <frame
            BackgroundColor3={Color3.fromRGB(41, 42, 48)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.0188, 0.061)}
            Size={UDim2.fromScale(0.962, 0.248)}
            Key={"settings1"}
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
                ZIndex={0}
            >
                <uicorner
                    Key={"UICorner1"}
                    CornerRadius={new UDim(0, 10)}
                />
            </imagelabel>

            <frame
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={Color3.fromRGB(6, 8, 12)}
                BackgroundTransparency={0.15}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.5, 0.5)}
                Size={UDim2.fromScale(1, 1)}
                ZIndex={5}
                Key={"locked"}
                Visible={false}
            >
                <uicorner Key={"UICorner"} />
            </frame>

            <frame
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                ClipsDescendants={true}
                Position={UDim2.fromScale(0.5, 0.5)}
                Size={UDim2.fromScale(1, 1)}
                Key={"content1"}
                LayoutOrder={0}
            >
                <frame
                    BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                    BackgroundTransparency={1}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    LayoutOrder={-1}
                    Position={UDim2.fromOffset(19, 24)}
                    Size={UDim2.fromOffset(955, 47)}
                    Key={"header1"}
                >
                    <textlabel
                        FontFace={new Font(
                            "rbxasset://fonts/families/SourceSansPro.json",
                            Enum.FontWeight.Bold,
                            Enum.FontStyle.Normal
                        )}
                        Text={"General Settings"}
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
                        Position={UDim2.fromOffset(31, 25)}
                        Size={UDim2.fromOffset(473, -17)}
                        ZIndex={3}
                        Key={"header1"}
                    />

                    <textlabel
                        FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                        Text={"Modify your treasury and it's general settings, such as it's name."}
                        TextColor3={Color3.fromRGB(255, 255, 255)}
                        TextScaled={true}
                        TextSize={14}
                        TextTransparency={0.49}
                        TextWrapped={true}
                        TextXAlignment={Enum.TextXAlignment.Left}
                        TextYAlignment={Enum.TextYAlignment.Bottom}
                        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                        BackgroundTransparency={1}
                        BorderColor3={Color3.fromRGB(0, 0, 0)}
                        BorderSizePixel={0}
                        Position={UDim2.fromOffset(31, 42)}
                        Size={UDim2.fromOffset(677, -15)}
                        ZIndex={3}
                        Key={"description1"}
                    />
                </frame>

                <uilistlayout
                    Key={"UIListLayout1"}
                    Padding={new UDim(0.02, 0)}
                    HorizontalAlignment={Enum.HorizontalAlignment.Center}
                    SortOrder={Enum.SortOrder.LayoutOrder}
                />

                <uipadding
                    Key={"UIPadding1"}
                    PaddingTop={new UDim(0, 12)}
                />

                <frame
                    BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                    BackgroundTransparency={1}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    LayoutOrder={1}
                    Position={UDim2.fromOffset(59, 50)}
                    Size={UDim2.fromOffset(915, 47)}
                    Key={"header2"}
                >
                    <textlabel
                        FontFace={new Font(
                            "rbxasset://fonts/families/SourceSansPro.json",
                            Enum.FontWeight.Bold,
                            Enum.FontStyle.Normal
                        )}
                        Text={"Treasury Name"}
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
                        Position={UDim2.fromOffset(31, 25)}
                        Size={UDim2.fromOffset(473, -17)}
                        ZIndex={3}
                        Key={"header1"}
                    />

                    <textlabel
                        FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                        Text={"The name of your treasury, and how others view it as."}
                        TextColor3={Color3.fromRGB(255, 255, 255)}
                        TextScaled={true}
                        TextSize={14}
                        TextTransparency={0.49}
                        TextWrapped={true}
                        TextXAlignment={Enum.TextXAlignment.Left}
                        TextYAlignment={Enum.TextYAlignment.Bottom}
                        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                        BackgroundTransparency={1}
                        BorderColor3={Color3.fromRGB(0, 0, 0)}
                        BorderSizePixel={0}
                        Position={UDim2.fromOffset(31, 42)}
                        Size={UDim2.fromOffset(677, -15)}
                        ZIndex={3}
                        Key={"description1"}
                    />

                    <frame
                        BackgroundColor3={Color3.fromRGB(44, 44, 44)}
                        BackgroundTransparency={1}
                        BorderColor3={Color3.fromRGB(0, 0, 0)}
                        BorderSizePixel={0}
                        Position={UDim2.fromScale(0.668, 0.19)}
                        Size={UDim2.fromScale(0.298, 0.644)}
                        Key={"buttonB1"}
                        Visible={canBeRenamed}
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
                                Color={Color3.fromRGB(255, 255, 255)}
                                Transparency={0.74}
                            />
                        </imagelabel>

                        <frame
                            Key={"Frame1"}
                            AnchorPoint={new Vector2(0, 0.5)}
                            AutomaticSize={Enum.AutomaticSize.X}
                            BackgroundColor3={Color3.fromRGB(31, 33, 37)}
                            BackgroundTransparency={1}
                            BorderColor3={Color3.fromRGB(0, 0, 0)}
                            BorderSizePixel={0}
                            Position={UDim2.fromScale(0.044, 0.5)}
                            Size={UDim2.fromScale(0.231, 0.5)}
                            SizeConstraint={Enum.SizeConstraint.RelativeYY}
                        >
                            <textbox
                                FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                                Text={props.Name}
                                TextColor3={Color3.fromRGB(122, 124, 131)}
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
                                PlaceholderText={"Specify your new treasury name."}
                                Event={{
                                    FocusLost: (box: TextBox) => {
                                        props.OnNameChanged(box.Text, box.Parent!.Parent!.Parent!.Parent!.Parent as Frame);
                                    }
                                }}
                            />

                            <frame
                                Key={"Frame1"}
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

                    <frame
                        BackgroundColor3={Color3.fromRGB(44, 44, 44)}
                        BackgroundTransparency={1}
                        BorderColor3={Color3.fromRGB(0, 0, 0)}
                        BorderSizePixel={0}
                        Position={UDim2.fromScale(0.668, 0.19)}
                        Size={UDim2.fromScale(0.298, 0.644)}
                        Key={"buttonB2"}
                        Visible={!canBeRenamed}
                    >
                        <textlabel
                            FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                            Text={props.Name}
                            TextColor3={Color3.fromRGB(122, 124, 131)}
                            TextScaled={true}
                            TextSize={14}
                            TextTransparency={0.3}
                            TextWrapped={true}
                            TextXAlignment={Enum.TextXAlignment.Right}
                            Active={true}
                            AnchorPoint={new Vector2(0, 0.5)}
                            BackgroundColor3={Color3.fromRGB(248, 248, 248)}
                            BackgroundTransparency={1}
                            BorderColor3={Color3.fromRGB(0, 0, 0)}
                            BorderSizePixel={0}
                            Position={UDim2.fromScale(0.408, 0.5)}
                            Selectable={true}
                            Size={UDim2.fromScale(0.592, 0.592)}
                            Key={"TextBox1"}
                        />
                    </frame>
                </frame>



                <frame
                    BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                    BackgroundTransparency={1}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    LayoutOrder={2}
                    Position={UDim2.fromOffset(59, 50)}
                    Size={UDim2.fromOffset(915, 47)}
                    Key={"header3"}
                >
                    <textlabel
                        FontFace={new Font(
                            "rbxasset://fonts/families/SourceSansPro.json",
                            Enum.FontWeight.Bold,
                            Enum.FontStyle.Normal
                        )}
                        Text={"Treasury Identifer"}
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
                        Position={UDim2.fromOffset(31, 25)}
                        Size={UDim2.fromOffset(473, -17)}
                        ZIndex={3}
                        Key={"header1"}
                    />

                    <textlabel
                        FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                        Text={"The identifier number for your treasury."}
                        TextColor3={Color3.fromRGB(255, 255, 255)}
                        TextScaled={true}
                        TextSize={14}
                        TextTransparency={0.49}
                        TextWrapped={true}
                        TextXAlignment={Enum.TextXAlignment.Left}
                        TextYAlignment={Enum.TextYAlignment.Bottom}
                        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                        BackgroundTransparency={1}
                        BorderColor3={Color3.fromRGB(0, 0, 0)}
                        BorderSizePixel={0}
                        Position={UDim2.fromOffset(31, 42)}
                        Size={UDim2.fromOffset(677, -15)}
                        ZIndex={3}
                        Key={"description1"}
                    />

                    <textbutton
                        FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                        Text={tostring("#" + props.Identifier)}
                        TextColor3={Color3.fromRGB(157, 157, 157)}
                        TextScaled={true}
                        TextSize={14}
                        TextTransparency={0.3}
                        TextWrapped={true}
                        AnchorPoint={new Vector2(1, 0.5)}
                        BackgroundColor3={Color3.fromRGB(0, 0, 0)}
                        BackgroundTransparency={1}
                        BorderColor3={Color3.fromRGB(0, 0, 0)}
                        BorderSizePixel={0}
                        Position={UDim2.fromScale(0.965, 0.5)}
                        Size={UDim2.fromScale(0.0609, 0.643)}
                        Key={"delete1"}
                    >
                        <uipadding
                            Key={"UIPadding1"}
                            PaddingBottom={new UDim(0.26, 0)}
                            PaddingTop={new UDim(0.26, 0)}
                        />

                        <uistroke
                            Key={"UIStroke1"}
                            ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
                            Color={Color3.fromRGB(255, 255, 255)}
                            Transparency={0.74}
                        />

                        <uicorner Key={"UICorner"} />
                    </textbutton>
                </frame>
            </frame>
        </frame>
    )
}

markPureComponent(TreasuryGeneralSettingsComponent);