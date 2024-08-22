import Roact from "@rbxts/roact";
import { markPureComponent } from "@rbxts/roact-hooked";
import { Players } from "@rbxts/services";
import { ScaleTextToBounds } from "client/interfaces/components/utilities/textscaler.effect";
import { Treasuries } from "shared/Treasuries";

export default function TreasuryAuditComponent(props: {TreasuryID : number, Audit: {
    playerID: number,
    detail: number | string,
    action: number ,
    timestamp: string,
    reason: string | undefined,
}}): Roact.Element {
    const [ impact, number ] = Treasuries.getTreasuryMarcImpact(props.Audit.action, props.Audit.detail);
    const timestamp = props.Audit.timestamp;
    const date = DateTime.fromIsoDate(timestamp)!;

    const secondsSince = date.UnixTimestamp;
    const localized = date.ToLocalTime()
    let [ month, day, hour, minute ] = [localized.Month, localized.Day, localized.Hour, localized.Minute < 10 ? "0" + localized.Minute : localized.Minute]

    const isAm = hour < 12;

    let hour12 = hour % 12;
    if(!hour12) hour12 = 12;
    
    return (
        <frame
            BackgroundColor3={Color3.fromRGB(41, 42, 48)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            LayoutOrder={(DateTime.now().UnixTimestamp - secondsSince)}
            Position={UDim2.fromScale(2.07e-07, -1.96e-08)}
            Size={UDim2.fromScale(0.962, 0.07)}
            Key={"log1"}
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
                Key={"data1"}
            >
                <uilistlayout
                    Key={"UIListLayout1"}
                    Padding={new UDim(0.02, 0)}
                    FillDirection={Enum.FillDirection.Horizontal}
                    SortOrder={Enum.SortOrder.LayoutOrder}
                    VerticalAlignment={Enum.VerticalAlignment.Center}
                />

                <textlabel
                    FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                    RichText={true}
                    Text={Treasuries.getTreasuryActionLabel(props.Audit.action)}
                    TextColor3={Color3.fromRGB(255, 255, 255)}
                    TextScaled={true}
                    TextSize={14}
                    TextTransparency={0.36}
                    TextWrapped={true}
                    TextXAlignment={Enum.TextXAlignment.Left}
                    TextYAlignment={Enum.TextYAlignment.Bottom}
                    AutomaticSize={Enum.AutomaticSize.X}
                    BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                    BackgroundTransparency={1}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    LayoutOrder={0}
                    Position={UDim2.fromScale(0.0512, 0.321)}
                    Size={UDim2.fromScale(0, 1)}
                    ZIndex={2}
                    Key={"name1"}
                />

                <textbutton
                    FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                    RichText={true}
                    Text={impact ?? ""}
                    TextColor3={(impact && number && number < 0) ? Color3.fromRGB(191, 114, 114) : Color3.fromRGB(101, 138, 90)}
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
                    Key={"price1"}
                    Visible={impact !== undefined}
                >
                    <uipadding
                        Key={"UIPadding1"}
                        PaddingBottom={new UDim(0.2, 0)}
                        PaddingLeft={new UDim(0, 10)}
                        PaddingRight={new UDim(0, 10)}
                        PaddingTop={new UDim(0.2, 0)}
                    />

                    <uistroke
                        Key={"UIStroke1"}
                        ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
                        Color={(impact && number && number < 0) ? Color3.fromRGB(191, 114, 114) : Color3.fromRGB(101, 138, 90)}
                        Transparency={0.76}
                    />

                    <uicorner Key={"UICorner"} />
                </textbutton>

                <textbutton
                    FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                    RichText={true}
                    Text={Players.GetNameFromUserIdAsync(tonumber(props.Audit.playerID) ?? 1)}
                    TextColor3={Color3.fromRGB(124, 124, 124)}
                    TextSize={ScaleTextToBounds(14)}
                    AnchorPoint={new Vector2(1, 0.5)}
                    AutomaticSize={Enum.AutomaticSize.X}
                    BackgroundColor3={Color3.fromRGB(0, 0, 0)}
                    BackgroundTransparency={0.95}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    LayoutOrder={2}
                    Position={UDim2.fromScale(0.877, 0.477)}
                    Size={UDim2.fromScale(0.0398, 1)}
                    ZIndex={6}
                    Key={"price2"}
                >
                    <uipadding
                        Key={"UIPadding1"}
                        PaddingBottom={new UDim(0.2, 0)}
                        PaddingLeft={new UDim(0, 10)}
                        PaddingRight={new UDim(0, 10)}
                        PaddingTop={new UDim(0.2, 0)}
                    />

                    <uistroke
                        Key={"UIStroke1"}
                        ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
                        Color={Color3.fromRGB(198, 198, 198)}
                        Transparency={0.76}
                    />

                    <uicorner Key={"UICorner"} />
                </textbutton>

                <textbutton
                    FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                    RichText={true}
                    Text={string.format("%s/%s %s:%s %s", month, day, hour12, minute, isAm ? "AM" : "PM")}
                    TextColor3={Color3.fromRGB(124, 124, 124)}
                    TextSize={ScaleTextToBounds(14)}
                    AnchorPoint={new Vector2(1, 0.5)}
                    AutomaticSize={Enum.AutomaticSize.X}
                    BackgroundColor3={Color3.fromRGB(0, 0, 0)}
                    BackgroundTransparency={0.95}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    LayoutOrder={2}
                    Position={UDim2.fromScale(0.877, 0.477)}
                    Size={UDim2.fromScale(0.0398, 1)}
                    ZIndex={6}
                    Key={"timestamp"}
                >
                    <uipadding
                        Key={"UIPadding1"}
                        PaddingBottom={new UDim(0.2, 0)}
                        PaddingLeft={new UDim(0, 10)}
                        PaddingRight={new UDim(0, 10)}
                        PaddingTop={new UDim(0.2, 0)}
                    />

                    <uistroke
                        Key={"UIStroke1"}
                        ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
                        Color={Color3.fromRGB(198, 198, 198)}
                        Transparency={0.76}
                    />

                    <uicorner Key={"UICorner"} />
                </textbutton>
            </frame>

            <textlabel
                Key={"TextLabel1"}
                FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                RichText={true}
                Text={(props.Audit.action === 11) ? "The owner has changed the treasury access." : (typeOf(props.Audit.detail) === "string") ? tostring(props.Audit.detail) : (props.Audit.reason || "No reason provided.")}
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

markPureComponent(TreasuryAuditComponent);