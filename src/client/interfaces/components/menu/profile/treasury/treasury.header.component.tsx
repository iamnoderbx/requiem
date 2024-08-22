import Roact from "@rbxts/roact";
import { markPureComponent } from "@rbxts/roact-hooked";
import { ScaleTextToBounds } from "client/interfaces/components/utilities/textscaler.effect";

function TreasuryDropdownLabelComponent(props: { Name: string, Clicked: () => void }): Roact.Element {
    return (
        <frame
            Key={"Frame1"}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Size={new UDim2(1, 0, 0, 25)}
        >
            <textbutton
                Key={"TextButton1"}
                FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                Text={props.Name}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextSize={14}
                TextTransparency={0.48}
                TextXAlignment={Enum.TextXAlignment.Left}
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.583, 0.5)}
                Size={UDim2.fromScale(0.833, 1)}
                Event={{
                    MouseButton1Click: props.Clicked
                }}
            />
        </frame>
    )
}

export function TreasurySubpageHeaderComponent(props: { Header: string, Body: string, Clicked: () => void }): Roact.Element {
    return (
        <frame
            BackgroundColor3={Color3.fromRGB(41, 42, 48)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(-5.9e-08, 0.0764)}
            Size={UDim2.fromScale(0.962, 0.0546)}
            Key={"header1"}
        >
            <uicorner
                Key={"UICorner1"}
                CornerRadius={new UDim(0.2, 0)}
            />

            <textbutton
                Size={UDim2.fromScale(1, 1)}
                BackgroundTransparency={1}
                BorderSizePixel={0}
                TextTransparency={1}
                Text={""}
                Event={{
                    MouseButton1Click: props.Clicked
                }}
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
                Image={"rbxassetid://11422143469"}
                ImageTransparency={0.24}
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.749, 0.5)}
                Size={UDim2.fromScale(0.0167, 0.384)}
                ZIndex={2}
            >
                <uiaspectratioconstraint
                    Key={"UIAspectRatioConstraint1"}
                    AspectRatio={1.02}
                />
            </imagelabel>

            <textlabel
                Key={"TextLabel1"}
                FontFace={new Font(
                    "rbxasset://fonts/families/SourceSansPro.json",
                    Enum.FontWeight.Bold,
                    Enum.FontStyle.Normal
                )}
                Text={props.Header}
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
                Position={UDim2.fromScale(0.0512, 0.281)}
                Size={UDim2.fromScale(0.291, 0.424)}
                ZIndex={2}
            />

            <textlabel
                Key={"TextLabel2"}
                FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                Text={props.Body}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextScaled={true}
                TextSize={14}
                TextTransparency={0.67}
                TextWrapped={true}
                TextXAlignment={Enum.TextXAlignment.Right}
                TextYAlignment={Enum.TextYAlignment.Bottom}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.342, 0.321)}
                Size={UDim2.fromScale(0.625, 0.343)}
                ZIndex={2}
            />
        </frame>
    )
}

export default function TreasuryHeaderComponent(props: { Name: string, Location: string, Owner: string, IsDropdownVisible: boolean, Treasuries: { Name: string, Id: number }[], DropdownClicked: () => void, DropdownEntryClicked: (Treasury: { Name: string, Id : number }) => void }): Roact.Element {
    return (
        <frame
            BackgroundColor3={Color3.fromRGB(41, 42, 48)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(2.07e-07, -1.96e-08)}
            Size={UDim2.fromScale(0.962, 0.07)}
            Key={"treasury_header"}
            ZIndex={6}
        >
            <uicorner
                Key={"UICorner"}
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
                Key={"treasury_header_menu"}
                ZIndex={0}
            >
                <uicorner
                    Key={"UICorner"}
                    CornerRadius={new UDim(0.2, 0)}
                />
            </imagelabel>

            <frame
                AnchorPoint={new Vector2(0, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.051, 0.5)}
                Size={UDim2.fromScale(0.5, 0.343)}
            >
                <uilistlayout
                    Key={"UIListLayout"}
                    ItemLineAlignment={Enum.ItemLineAlignment.Center}
                    Padding={new UDim(0.03, 0)}
                    FillDirection={Enum.FillDirection.Horizontal}
                    SortOrder={Enum.SortOrder.LayoutOrder}
                    VerticalAlignment={Enum.VerticalAlignment.Center}
                />

                <textlabel
                    FontFace={new Font(
                        "rbxasset://fonts/families/SourceSansPro.json",
                        Enum.FontWeight.Bold,
                        Enum.FontStyle.Normal
                    )}
                    RichText={true}
                    Text={props.Name}
                    TextColor3={Color3.fromRGB(255, 255, 255)}
                    TextScaled={true}
                    TextSize={14}
                    TextTransparency={0.24}
                    TextWrapped={true}
                    TextXAlignment={Enum.TextXAlignment.Left}
                    TextYAlignment={Enum.TextYAlignment.Bottom}
                    AutomaticSize={Enum.AutomaticSize.X}
                    BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                    BackgroundTransparency={1}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.0512, 0.321)}
                    Size={UDim2.fromScale(0, 1)}
                    ZIndex={2}
                />

                <textbutton
                    FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                    RichText={true}
                    Text={"Owned by " + props.Owner}
                    TextColor3={Color3.fromRGB(124, 124, 124)}
                    TextSize={ScaleTextToBounds(14)}
                    AnchorPoint={new Vector2(1, 0.5)}
                    AutomaticSize={Enum.AutomaticSize.X}
                    BackgroundColor3={Color3.fromRGB(0, 0, 0)}
                    BackgroundTransparency={0.95}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    LayoutOrder={1}
                    Position={UDim2.fromScale(0.877, 0.477)}
                    Size={UDim2.fromScale(0.0398, 1)}
                    ZIndex={6}
                >
                    <uipadding
                        Key={"UIPadding"}
                        PaddingBottom={new UDim(0.2, 0)}
                        PaddingLeft={new UDim(0, 10)}
                        PaddingRight={new UDim(0, 10)}
                        PaddingTop={new UDim(0.2, 0)}
                    />

                    <uistroke
                        Key={"UIStroke"}
                        ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
                        Color={Color3.fromRGB(223, 223, 223)}
                        Transparency={0.76}
                    />

                    <uicorner Key={"UICorner"} />
                </textbutton>

                <textbutton
                    FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                    RichText={true}
                    Text={"Located in " + props.Location}
                    TextColor3={Color3.fromRGB(124, 124, 124)}
                    TextSize={ScaleTextToBounds(14)}
                    AnchorPoint={new Vector2(1, 0.5)}
                    AutomaticSize={Enum.AutomaticSize.X}
                    BackgroundColor3={Color3.fromRGB(0, 0, 0)}
                    BackgroundTransparency={0.95}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    LayoutOrder={1}
                    Position={UDim2.fromScale(0.877, 0.477)}
                    Size={UDim2.fromScale(0.0398, 1)}
                    ZIndex={6}
                >
                    <uipadding
                        Key={"UIPadding"}
                        PaddingBottom={new UDim(0.2, 0)}
                        PaddingLeft={new UDim(0, 10)}
                        PaddingRight={new UDim(0, 10)}
                        PaddingTop={new UDim(0.2, 0)}
                    />

                    <uistroke
                        ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
                        Color={Color3.fromRGB(223, 223, 223)}
                        Transparency={0.76}
                    />

                    <uicorner Key={"UICorner"} />
                </textbutton>
            </frame>

            <frame
                BackgroundColor3={Color3.fromRGB(41, 42, 48)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.768, 0.237)}
                Size={UDim2.fromScale(0.209, 0.518)}
            >
                <uicorner
                    Key={"UICorner"}
                    CornerRadius={new UDim(0.2, 0)}
                />


                <frame
                    AutomaticSize={Enum.AutomaticSize.Y}
                    BackgroundColor3={Color3.fromRGB(26, 28, 34)}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(-0.144, 1.06)}
                    Size={UDim2.fromScale(1, 0)}
                    ZIndex={5}
                    Key={"dropdown1"}
                    Visible={props.IsDropdownVisible}
                >
                    <uilistlayout
                        Key={"UIListLayout1"}
                        Padding={new UDim(0, 3)}
                        SortOrder={Enum.SortOrder.LayoutOrder}
                    />

                    <uistroke
                        Key={"UIStroke1"}
                        Color={Color3.fromRGB(44, 48, 62)}
                    />

                    <uicorner
                        Key={"UICorner1"}
                        CornerRadius={new UDim(0, 10)}
                    />

                    <uipadding
                        Key={"UIPadding1"}
                        PaddingBottom={new UDim(0, 5)}
                        PaddingTop={new UDim(0, 5)}
                    />

                    {props.Treasuries.map((treasury, index) => (
                        <TreasuryDropdownLabelComponent Name={treasury.Name} Clicked={() => {
                            props.DropdownEntryClicked(treasury);
                        }} />
                    ))}
                </frame>


                <imagelabel
                    Image={"rbxassetid://16255699706"}
                    ImageColor3={Color3.fromRGB(149, 197, 255)}
                    ImageTransparency={0.99}
                    ScaleType={Enum.ScaleType.Crop}
                    AnchorPoint={new Vector2(0.5, 0.5)}
                    BackgroundColor3={Color3.fromRGB(19, 20, 24)}
                    BackgroundTransparency={0.6}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.356, 0.5)}
                    Size={UDim2.fromScale(1, 1)}
                >
                    <uicorner
                        CornerRadius={new UDim(0.4, 0)}
                    />

                    <uistroke
                        Color={Color3.fromRGB(44, 48, 62)}
                    />

                    <textbutton
                        Size={UDim2.fromScale(1, 1)}
                        BackgroundTransparency={1}
                        TextTransparency={1}
                        Event={{
                            MouseButton1Click: props.DropdownClicked
                        }}
                    />

                    <imagelabel
                        Image={"rbxassetid://11421095840"}
                        ImageTransparency={0.24}
                        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                        BackgroundTransparency={1}
                        BorderColor3={Color3.fromRGB(0, 0, 0)}
                        BorderSizePixel={0}
                        Position={UDim2.fromScale(0.896, 0.302)}
                        Size={UDim2.fromScale(0.0665, 0.481)}
                        ZIndex={2}
                    >
                        <uiaspectratioconstraint
                            AspectRatio={1.02}
                        />
                    </imagelabel>

                    <textlabel
                        FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                        RichText={true}
                        Text={props.Name}
                        TextColor3={Color3.fromRGB(255, 255, 255)}
                        TextScaled={true}
                        TextSize={14}
                        TextTransparency={0.48}
                        TextWrapped={true}
                        TextXAlignment={Enum.TextXAlignment.Left}
                        TextYAlignment={Enum.TextYAlignment.Bottom}
                        AnchorPoint={new Vector2(0, 0.5)}
                        AutomaticSize={Enum.AutomaticSize.X}
                        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                        BackgroundTransparency={1}
                        BorderColor3={Color3.fromRGB(0, 0, 0)}
                        BorderSizePixel={0}
                        Position={UDim2.fromScale(0.167, 0.5)}
                        Size={UDim2.fromScale(0.729, 0.553)}
                        ZIndex={2}
                    />

                    <imagelabel
                        Image={"rbxassetid://11963361341"}
                        ImageTransparency={0.63}
                        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                        BackgroundTransparency={1}
                        BorderColor3={Color3.fromRGB(0, 0, 0)}
                        BorderSizePixel={0}
                        Position={UDim2.fromScale(0.0571, 0.239)}
                        Size={UDim2.fromScale(0.076, 0.55)}
                        ZIndex={2}
                    >
                        <uiaspectratioconstraint
                            Key={"UIAspectRatioConstraint"}
                            AspectRatio={1.02}
                        />
                    </imagelabel>
                </imagelabel>
            </frame>
        </frame>
    )
}

markPureComponent(TreasuryHeaderComponent);
markPureComponent(TreasuryDropdownLabelComponent);
markPureComponent(TreasurySubpageHeaderComponent);