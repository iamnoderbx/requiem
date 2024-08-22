import Roact from "@rbxts/roact";

export default function BlueprintsBodyComponent(props: {} & Roact.PropsWithChildren): Roact.Element {
	return (
		<frame
			BackgroundColor3={Color3.fromRGB(255, 255, 255)}
			BackgroundTransparency={1}
			BorderColor3={Color3.fromRGB(0, 0, 0)}
			BorderSizePixel={0}
			LayoutOrder={1}
			Size={UDim2.fromScale(1, 0.918)}
			Key={"body1"}
		>
			<uilistlayout
				Key={"UIListLayout1"}
				Padding={new UDim(0, 3)}
				FillDirection={Enum.FillDirection.Horizontal}
				SortOrder={Enum.SortOrder.LayoutOrder}
			/>

			{props[Roact.Children]}
		</frame>
	)
}