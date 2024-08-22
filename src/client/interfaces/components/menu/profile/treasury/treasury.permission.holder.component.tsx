import Roact from "@rbxts/roact";
import { markPureComponent } from "@rbxts/roact-hooked";

export default function TreasuryPermissionHolderComponent(props: { Locked: boolean, OnAddPermission: () => void } & Roact.PropsWithChildren): Roact.Element {
    return (
        <frame
            BackgroundColor3={Color3.fromRGB(41, 42, 48)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            LayoutOrder={1}
            Position={UDim2.fromScale(0.0188, 0.061)}
            Size={UDim2.fromScale(0.962, 0.583)}
            Key={"permissions1"}
        >
            <uicorner
                Key={"UICorner1"}
                CornerRadius={new UDim(0.2, 0)}
            />

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
                    CornerRadius={new UDim(0, 10)}
                />
            </imagelabel>

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
                        Text={"Manage Permissions"}
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
                        Text={"Manage who has access to your treasury, alongside their limitations."}
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
                        FontFace={new Font(
                            "rbxasset://fonts/families/SourceSansPro.json",
                            Enum.FontWeight.Heavy,
                            Enum.FontStyle.Normal
                        )}
                        Text={"ADD USER"}
                        TextColor3={Color3.fromRGB(26, 29, 36)}
                        TextScaled={true}
                        TextSize={14}
                        TextWrapped={true}
                        AnchorPoint={new Vector2(1, 0.5)}
                        BackgroundColor3={Color3.fromRGB(126, 139, 173)}
                        BorderColor3={Color3.fromRGB(0, 0, 0)}
                        BorderSizePixel={0}
                        Position={UDim2.fromScale(0.946, 0.5)}
                        Size={UDim2.fromScale(0.0798, 0.509)}
                        Key={"delete1"}
                        Event={{
                            MouseButton1Click: props.OnAddPermission
                        }}
                    >
                        <uipadding
                            Key={"UIPadding1"}
                            PaddingBottom={new UDim(0.2, 0)}
                            PaddingTop={new UDim(0.2, 0)}
                        />

                        <uicorner Key={"UICorner"} />

                        <uiaspectratioconstraint
                            Key={"UIAspectRatioConstraint1"}
                            AspectRatio={3.18}
                        />
                    </textbutton>
                </frame>

                <uilistlayout
                    Key={"UIListLayout1"}
                    Padding={new UDim(0.02, 0)}
                    HorizontalAlignment={Enum.HorizontalAlignment.Center}
                    SortOrder={Enum.SortOrder.LayoutOrder}
                />

                <frame
                    BackgroundColor3={Color3.fromRGB(0, 0, 0)}
                    BackgroundTransparency={0.85}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromOffset(56, 107)}
                    Size={UDim2.fromOffset(882, 103)}
                    Visible={props.Locked}
                    Key={"no_permission1"}
                >
                    <uicorner Key={"UICorner"} />

                    <textlabel
                        FontFace={new Font(
                            "rbxasset://fonts/families/SourceSansPro.json",
                            Enum.FontWeight.Bold,
                            Enum.FontStyle.Normal
                        )}
                        Text={"This treasury is managed by the Royal Government and it's permissions cannot be changed."}
                        TextColor3={Color3.fromRGB(255, 255, 255)}
                        TextScaled={true}
                        TextSize={14}
                        TextTransparency={0.36}
                        TextWrapped={true}
                        TextYAlignment={Enum.TextYAlignment.Bottom}
                        AnchorPoint={new Vector2(0.5, 0.5)}
                        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                        BackgroundTransparency={1}
                        BorderColor3={Color3.fromRGB(0, 0, 0)}
                        BorderSizePixel={0}
                        Position={UDim2.fromScale(0.5, 0.424)}
                        Size={UDim2.fromScale(0.916, 0.153)}
                        ZIndex={3}
                        Key={"header1"}
                    />

                    <textlabel
                        FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                        Text={"You may request changes by speaking with a government official."}
                        TextColor3={Color3.fromRGB(255, 255, 255)}
                        TextScaled={true}
                        TextSize={14}
                        TextTransparency={0.36}
                        TextWrapped={true}
                        TextYAlignment={Enum.TextYAlignment.Bottom}
                        AnchorPoint={new Vector2(0.5, 0.5)}
                        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                        BackgroundTransparency={1}
                        BorderColor3={Color3.fromRGB(0, 0, 0)}
                        BorderSizePixel={0}
                        Position={UDim2.fromScale(0.499, 0.58)}
                        Size={UDim2.fromScale(0.847, 0.141)}
                        ZIndex={3}
                        Key={"header2"}
                    />

                    <textlabel
                        FontFace={new Font(
                            "rbxasset://fonts/families/SourceSansPro.json",
                            Enum.FontWeight.Bold,
                            Enum.FontStyle.Normal
                        )}
                        Text={"Permission Override"}
                        TextColor3={Color3.fromRGB(255, 255, 255)}
                        TextScaled={true}
                        TextSize={14}
                        TextTransparency={0.97}
                        TextWrapped={true}
                        TextYAlignment={Enum.TextYAlignment.Bottom}
                        AnchorPoint={new Vector2(0.5, 0.5)}
                        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                        BackgroundTransparency={1}
                        BorderColor3={Color3.fromRGB(0, 0, 0)}
                        BorderSizePixel={0}
                        Position={UDim2.fromScale(0.5, 0.47)}
                        Size={UDim2.fromScale(0.916, 0.94)}
                        ZIndex={3}
                        Key={"header3"}
                    />
                </frame>

                <uipadding
                    Key={"UIPadding1"}
                    PaddingTop={new UDim(0, 12)}
                />

                <scrollingframe
                    AutomaticCanvasSize={Enum.AutomaticSize.Y}
                    CanvasSize={new UDim2}
                    ScrollBarImageColor3={Color3.fromRGB(16, 17, 22)}
                    ScrollBarThickness={3}
                    Active={true}
                    AnchorPoint={new Vector2(0.5, 0)}
                    BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                    BackgroundTransparency={1}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.5, 0.123)}
                    Size={UDim2.fromScale(0.961, 0.816)}
                    Key={"manage1"}
                    Visible={!props.Locked}
                >
                    <uilistlayout
                        Key={"UIListLayout1"}
                        Padding={new UDim(0.02, 0)}
                        HorizontalAlignment={Enum.HorizontalAlignment.Center}
                        SortOrder={Enum.SortOrder.LayoutOrder}
                    />

                    {props[Roact.Children]}
                </scrollingframe>
            </frame>
        </frame>
    )
}

markPureComponent(TreasuryPermissionHolderComponent)