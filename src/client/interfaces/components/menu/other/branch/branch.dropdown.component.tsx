import Roact from "@rbxts/roact";
import { markPureComponent, useEffect, useState, withHooks } from "@rbxts/roact-hooked";

const branchDropdownComponent =  withHooks((props: {Visible?: boolean, Size?: UDim2, Position?: UDim2, Override? : string, Default: string, Selections: string[], OnSelected: (selection : string) => boolean | void }): Roact.Element => {
    const [ visible, setVisible ] = useState(false);
    const [ selected, setSelected ] = useState(props.Default);


    const canAccess = props.Visible;
    const transparencyRemoval = canAccess ? 0 : 0.2;

    const totalSelections = props.Selections.size()

    useEffect(() => {
        if(props.Override !== undefined) setSelected(props.Override)
    }, [props.Override])
    
    return (
        <imagelabel
            Image={"rbxassetid://16255699706"}
            ImageColor3={Color3.fromRGB(149, 197, 255)}
            ImageTransparency={0.99}
            ScaleType={Enum.ScaleType.Crop}
            AnchorPoint={new Vector2(0.5, 0.5)}
            BackgroundColor3={Color3.fromRGB(19, 20, 24)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={props.Position ?? UDim2.fromScale(0.846, 0.48)}
            Size={props.Size ?? UDim2.fromScale(0.322, 1.04)}
            ZIndex={5}
            Key={"menu1"}
        >
            <uicorner
                Key={"UICorner1"}
                CornerRadius={new UDim(0.4, 0)}
            />

            <uistroke
                Key={"UIStroke1"}
                Color={Color3.fromRGB(44, 48, 62)}
                Transparency={transparencyRemoval}
            />

            <imagelabel
                Key={"ImageLabel1"}
                Image={"rbxassetid://11421095840"}
                ImageTransparency={0.24 + transparencyRemoval}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.896, 0.302)}
                Size={UDim2.fromScale(0.0665, 0.481)}
                ZIndex={2}
                Visible={canAccess}
            >
                <uiaspectratioconstraint
                    Key={"UIAspectRatioConstraint1"}
                    AspectRatio={1.02}
                />
            </imagelabel>

            <textlabel
                FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                RichText={true}
                Text={selected}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextScaled={true}
                TextSize={14}
                TextTransparency={0.48 + transparencyRemoval}
                TextWrapped={true}
                TextXAlignment={Enum.TextXAlignment.Left}
                TextYAlignment={Enum.TextYAlignment.Bottom}
                AnchorPoint={new Vector2(0, 0.5)}
                AutomaticSize={Enum.AutomaticSize.X}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.0704, 0.5)}
                Size={UDim2.fromScale(0.826, 0.553)}
                ZIndex={2}
                Key={"name1"}
            />

            <textbutton 
                Size={UDim2.fromScale(1, 1)}
                Text={""}
                TextTransparency={1}
                BackgroundTransparency={1}
                Event={{
                    MouseButton1Click: (box) => {
                        if(!canAccess) return;

                        setVisible(!visible)
                        const _frame = box!.Parent!.Parent! as Frame
                        _frame.ZIndex = !visible ? 5 : 1;
                    }
                }}
            />

            <frame
                Key={"Frame1"}
                AnchorPoint={new Vector2(0.5, 0)}
                BackgroundColor3={Color3.fromRGB(25, 27, 33)}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={new UDim2(0.5, 0, 1, 3)}
                Size={UDim2.fromScale(1, math.clamp(totalSelections * 0.95, 1, 7))} // math.clamp(totalSelections * 0.4, 0.1, 0.95)
                Visible={visible}
            >
                <scrollingframe
                    AutomaticCanvasSize={Enum.AutomaticSize.Y}
                    CanvasSize={new UDim2}
                    ScrollBarThickness={3}
                    AnchorPoint={new Vector2(0.5, 0.5)}
                    BackgroundColor3={Color3.fromRGB(22, 24, 29)}
                    BackgroundTransparency={1}
                    BorderColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}
                    Position={UDim2.fromScale(0.5, 0.5)}
                    Selectable={false}
                    Size={UDim2.fromScale(1, 0.95)} // 0.95
                    ZIndex={5}
                    Key={"Frame1"}
                >
                    <uilistlayout
                        Key={"UIListLayout1"}
                        Padding={new UDim(0, 3)}
                        HorizontalAlignment={Enum.HorizontalAlignment.Center}
                        SortOrder={Enum.SortOrder.LayoutOrder}
                    />

                    {props.Selections.map((selection, index) => {
                        return <frame
                            Key={"Frame1"}
                            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                            BackgroundTransparency={1}
                            BorderColor3={Color3.fromRGB(0, 0, 0)}
                            BorderSizePixel={0}
                            Position={UDim2.fromScale(0.0704, 0)}
                            Size={new UDim2(1, 0, 0, 24)}
                        >
                            <textlabel
                                Key={"TextLabel1"}
                                FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                                Text={selection}
                                TextColor3={Color3.fromRGB(255, 255, 255)}
                                TextScaled={true}
                                TextSize={14}
                                TextTransparency={0.48}
                                TextWrapped={true}
                                TextXAlignment={Enum.TextXAlignment.Left}
                                AnchorPoint={new Vector2(0.5, 0.5)}
                                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                                BackgroundTransparency={1}
                                BorderColor3={Color3.fromRGB(0, 0, 0)}
                                BorderSizePixel={0}
                                Position={UDim2.fromScale(0.5, 0.5)}
                                Size={UDim2.fromScale(1, 0.6)}
                            >
                                <uipadding
                                    PaddingLeft={new UDim(0.1, 0)}
                                />
                            </textlabel>
                            <textbutton
                                Size={UDim2.fromScale(1, 1)}
                                Text={""}
                                TextTransparency={1}
                                BackgroundColor3={Color3.fromRGB(25, 27, 33)}
                                BorderSizePixel={0}
                                Event={{
                                    MouseButton1Click: (box) => {
                                        setVisible(false)

                                        const _frame = box!.Parent!.Parent!.Parent!.Parent!.Parent!.Parent! as Frame
                                        _frame.ZIndex = 1;

                                        const result = props.OnSelected(selection)
                                        if(result === undefined || result === true) setSelected(selection)
                                    }
                                }}
                            />
                        </frame>
                    })}

                    <uicorner Key={"UICorner"} />
                </scrollingframe>

                <uicorner Key={"UICorner"} />
            </frame>
        </imagelabel>
    )
})

markPureComponent(branchDropdownComponent);
export default branchDropdownComponent;