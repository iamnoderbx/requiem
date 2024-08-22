import Roact from "@rbxts/roact";
import { markPureComponent } from "@rbxts/roact-hooked";
import { ScaleTextToBounds } from "client/interfaces/components/utilities/textscaler.effect";
import { Treasuries } from "shared/Treasuries";
import { Treasury } from "shared/types/Treasury";
import { Number } from "shared/utilities/number.utilities";

export default function TreasuryIncomeComponent(props: { Income: Treasury.IncomeSource, Clicked: (frame: Frame) => void }): Roact.Element {
    const cycles = Treasuries.getAmountOfRedeemableIncome(props.Income);
    const isRedeemable = Treasuries.isIncomeSourceRedeemable(props.Income);

    const profitAmount = Treasuries.getIncomeSourceProfitAmount(props.Income.type);
    const totalAmount = profitAmount * cycles;

    return (
        <frame
            BackgroundColor3={Color3.fromRGB(41, 42, 48)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            LayoutOrder={2}
            Position={UDim2.fromScale(2.07e-07, -1.96e-08)}
            Size={UDim2.fromScale(0.962, 0.07)}
            Key={"source1"}
            Visible={(isRedeemable && cycles > 0 && totalAmount > 0 ) ?? false}
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
                    Text={"Payslip Notice"}
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
                    LayoutOrder={1}
                    Position={UDim2.fromScale(0.0512, 0.321)}
                    Size={UDim2.fromScale(0, 1)}
                    ZIndex={2}
                    Key={"name1"}
                />

                <textlabel
                    FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                    RichText={true}
                    Text={"+$" + Number.AddCommasToNumber(totalAmount)}
                    TextColor3={Color3.fromRGB(110, 148, 112)}
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
                    Key={"amount1"}
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
                        Color={Color3.fromRGB(114, 162, 116)}
                        Transparency={0.76}
                    />

                    <uicorner Key={"UICorner"} />
                </textlabel>

                <textlabel
                    FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                    RichText={true}
                    Text={"x" + Number.AddCommasToNumber(cycles)}
                    TextColor3={Color3.fromRGB(156, 156, 156)}
                    TextSize={ScaleTextToBounds(14)}
                    AnchorPoint={new Vector2(1, 0.5)}
                    AutomaticSize={Enum.AutomaticSize.X}
                    BackgroundColor3={Color3.fromRGB(0, 0, 0)}
                    BackgroundTransparency={0.95}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    LayoutOrder={3}
                    Position={UDim2.fromScale(0.877, 0.477)}
                    Size={UDim2.fromScale(0.0398, 1)}
                    ZIndex={6}
                    Key={"amount2"}
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
                        Color={Color3.fromRGB(171, 171, 171)}
                        Transparency={0.76}
                    />

                    <uicorner Key={"UICorner"} />
                </textlabel>
            </frame>

            <textlabel
                FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                RichText={true}
                Text={"Claim your weekly profit payslip for your " + Treasury.IncomeSourceTypes[props.Income.type].lower() + "."}
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
                Position={UDim2.fromScale(0.324, 0.284)}
                Size={UDim2.fromScale(0.543, 0.343)}
                ZIndex={2}
                Key={"description1"}
            />

            <textbutton
                FontFace={new Font(
                    "rbxasset://fonts/families/SourceSansPro.json",
                    Enum.FontWeight.Bold,
                    Enum.FontStyle.Normal
                )}
                Text={"REDEEM"}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextScaled={true}
                TextSize={14}
                TextTransparency={0.41}
                TextWrapped={true}
                BackgroundColor3={Color3.fromRGB(52, 72, 51)}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.877, 0.293)}
                Size={UDim2.fromScale(0.0892, 0.408)}
                Key={"redeem1"}
                Event={{
                    MouseButton1Click: (button) => {
                        props.Clicked(button.Parent as Frame);
                    },
                }}
            >
                <uipadding
                    Key={"UIPadding1"}
                    PaddingBottom={new UDim(0.2, 0)}
                    PaddingTop={new UDim(0.2, 0)}
                />

                <uicorner Key={"UICorner"} />
            </textbutton>
        </frame>
    )
}

markPureComponent(TreasuryIncomeComponent);