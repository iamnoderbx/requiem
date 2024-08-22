import Roact from "@rbxts/roact";
import { markPureComponent } from "@rbxts/roact-hooked";

export function InventoryCellComponent() : Roact.Element {
    return (<frame
        Key={"frame14"}
        BackgroundColor3={Color3.fromRGB(0, 0, 0)}
        BackgroundTransparency={0.95}
        BorderColor3={Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        Size={UDim2.fromOffset(100, 100)}
    >
        <uistroke
            Key={"uIStroke6"}
            Color={Color3.fromRGB(188, 197, 255)}
            Transparency={0.88}
        />

        <uicorner
            Key={"uICorner21"}
            CornerRadius={new UDim(0, 3)}
        />
    </frame>)
}

export default function InventoryMenuComponent(): Roact.Element {
    let InventoryCellMap = [];
    for (let index = 0; index < 48; index++) {
        InventoryCellMap.push(<InventoryCellComponent Key={`inventoryCell${index}`} />);
    }
    return (<frame
        Key={"attributes1"}
        BackgroundColor3={Color3.fromRGB(29, 31, 37)}
        BackgroundTransparency={1}
        BorderColor3={Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        Position={UDim2.fromScale(0.522, 0.145)}
        Size={UDim2.fromScale(0.456, 0.828)}
        ZIndex={5}
    >
        <uiaspectratioconstraint
            Key={"uIAspectRatioConstraint14"}
            AspectRatio={0.981}
        />

        <uicorner
            Key={"uICorner14"}
            CornerRadius={new UDim(0, 10)}
        />

        <frame
            Key={"frame7"}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            ClipsDescendants={true}
            Size={UDim2.fromScale(1, 0.0847)}
            LayoutOrder={1}
        >
            <frame
                Key={"frame8"}
                AnchorPoint={new Vector2(0.5, 0)}
                BackgroundColor3={Color3.fromRGB(29, 31, 37)}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                LayoutOrder={-1}
                Position={new UDim2(0.5, 0, 0, 1)}
                Size={new UDim2(1, -4, 1.32, 0)}
                ZIndex={16}
            >
                <uicorner
                    Key={"uICorner15"}
                    CornerRadius={new UDim(0, 10)}
                />

                <textlabel
                    Key={"textLabel16"}
                    FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                    Text={"Inventory Contents"}
                    TextColor3={Color3.fromRGB(255, 255, 255)}
                    TextScaled={true}
                    TextSize={14}
                    TextTransparency={0.12}
                    TextWrapped={true}
                    TextXAlignment={Enum.TextXAlignment.Left}
                    BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                    BackgroundTransparency={1}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.0391, 0.239)}
                    Size={UDim2.fromScale(0.522, 0.309)}
                    ZIndex={16}
                />

                <uistroke
                    Key={"uIStroke3"}
                    Color={Color3.fromRGB(39, 45, 54)}
                />
            </frame>
        </frame>

        <uilistlayout
            Key={"uIListLayout2"}
            Padding={new UDim(0, 2)}
            SortOrder={Enum.SortOrder.LayoutOrder}
        />

        <frame
            Key={"frame9"}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            ClipsDescendants={true}
            Position={UDim2.fromScale(0, 0.0868)}
            Size={UDim2.fromScale(1, 0.103)}
            LayoutOrder={2}
        >
            <frame
                Key={"frame10"}
                AnchorPoint={new Vector2(0.5, 0)}
                BackgroundColor3={Color3.fromRGB(29, 31, 37)}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                LayoutOrder={-1}
                Position={new UDim2(0.5, 0, -0.248, 1)}
                Size={new UDim2(1, -4, 1.64, 0)}
                ZIndex={16}
            >
                <uicorner
                    Key={"uICorner16"}
                    CornerRadius={new UDim(0, 10)}
                />

                <uistroke
                    Key={"uIStroke4"}
                    Color={Color3.fromRGB(39, 45, 54)}
                />

                <textlabel
                    Key={"textLabel17"}
                    FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                    Text={"Weight"}
                    TextColor3={Color3.fromRGB(255, 255, 255)}
                    TextScaled={true}
                    TextSize={14}
                    TextTransparency={0.12}
                    TextWrapped={true}
                    TextXAlignment={Enum.TextXAlignment.Left}
                    BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                    BackgroundTransparency={1}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.0391, 0.248)}
                    Size={UDim2.fromScale(0.907, 0.202)}
                    ZIndex={16}
                />

                <imagebutton
                    Key={"imageButton3"}
                    Image={"rbxassetid://11432860885"}
                    ImageTransparency={0.12}
                    AnchorPoint={new Vector2(1, 0)}
                    BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                    BackgroundTransparency={1}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.971, 0.381)}
                    Size={UDim2.fromScale(0.042, 0.234)}
                    ZIndex={5}
                />

                <frame
                    Key={"container6"}
                    AnchorPoint={new Vector2(0.5, 0)}
                    BackgroundColor3={Color3.fromRGB(64, 67, 81)}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.477, 0.5)}
                    Size={UDim2.fromScale(0.877, 0.0475)}
                >
                    <uicorner
                        Key={"uICorner17"}
                        CornerRadius={new UDim(1, 0)}
                    />

                    <frame
                        Key={"container7"}
                        AnchorPoint={new Vector2(0, 0.5)}
                        BackgroundColor3={Color3.fromRGB(181, 193, 231)}
                        BorderColor3={Color3.fromRGB(0, 0, 0)}
                        BorderSizePixel={0}
                        Position={UDim2.fromScale(0, 0.574)}
                        Size={UDim2.fromScale(0.391, 0.947)}
                    >
                        <uicorner
                            Key={"uICorner18"}
                            CornerRadius={new UDim(1, 0)}
                        />
                    </frame>
                </frame>
            </frame>
        </frame>

        <frame
            Key={"frame11"}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            ClipsDescendants={true}
            Position={UDim2.fromScale(0, 0.196)}
            Size={UDim2.fromScale(1, 0.769)}
            LayoutOrder={3}
        >
            <frame
                Key={"frame12"}
                AnchorPoint={new Vector2(0.5, 0)}
                BackgroundColor3={Color3.fromRGB(29, 31, 37)}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                LayoutOrder={-1}
                Position={UDim2.fromScale(0.499, -0.0565)}
                Size={UDim2.fromScale(0.992, 1.06)}
                ZIndex={16}
            >
                <uicorner
                    Key={"uICorner19"}
                    CornerRadius={new UDim(0, 10)}
                />

                <uistroke
                    Key={"uIStroke5"}
                    Color={Color3.fromRGB(39, 45, 54)}
                />

                <frame
                    Key={"frame13"}
                    AnchorPoint={new Vector2(0.5, 0.5)}
                    BackgroundColor3={Color3.fromRGB(0, 0, 0)}
                    BackgroundTransparency={0.95}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.505, 0.527)}
                    Size={UDim2.fromScale(0.932, 0.86)}
                >
                    <uicorner
                        Key={"uICorner20"}
                        CornerRadius={new UDim(0, 6)}
                    />

                    <uigridlayout
                        Key={"uIGridLayout"}
                        CellPadding={UDim2.fromScale(0.0055, 0.0055)}
                        CellSize={UDim2.fromScale(0.119, 0.158)}
                        SortOrder={Enum.SortOrder.LayoutOrder}
                    />

                    {InventoryCellMap}

                    <uiaspectratioconstraint
                        Key={"uIAspectRatioConstraint15"}
                        AspectRatio={1.3}
                    />
                </frame>
            </frame>
        </frame>
    </frame>)
}

markPureComponent(InventoryMenuComponent);
markPureComponent(InventoryCellComponent);