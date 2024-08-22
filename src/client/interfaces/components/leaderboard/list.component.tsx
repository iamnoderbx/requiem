import Roact from "@rbxts/roact";

export default function LeaderboardListComponent(props: {} & Roact.PropsWithChildren): Roact.Element {
    return <scrollingframe
        Key={"scrollingFrame"}
        AutomaticCanvasSize={Enum.AutomaticSize.Y}
        CanvasSize={new UDim2}
        ScrollBarImageColor3={Color3.fromRGB(0, 0, 0)}
        ScrollBarThickness={3}
        Active={true}
        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
        BackgroundTransparency={1}
        BorderColor3={Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        Position={UDim2.fromScale(-0.015, 0.156)}
        Size={UDim2.fromScale(1.02, 1.05)}
    >
        <uilistlayout
            Key={"uIListLayout1"}
            HorizontalAlignment={Enum.HorizontalAlignment.Right}
            SortOrder={Enum.SortOrder.LayoutOrder}
        />

        {props[Roact.Children]}
    </scrollingframe>
}