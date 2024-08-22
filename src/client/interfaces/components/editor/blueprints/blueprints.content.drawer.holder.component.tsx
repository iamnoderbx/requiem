import Roact from "@rbxts/roact";

export default function BlueprintContentDrawerHolderComponent(props: {} & Roact.PropsWithChildren): Roact.Element {
	return (
		<imagelabel
			Image={"rbxassetid://16255699706"}
			ImageColor3={Color3.fromRGB(149, 197, 255)}
			ImageTransparency={0.92}
			ScaleType={Enum.ScaleType.Crop}
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundColor3={Color3.fromRGB(14, 14, 17)}
			BackgroundTransparency={0.1}
			BorderColor3={Color3.fromRGB(0, 0, 0)}
			BorderSizePixel={0}
			Position={UDim2.fromScale(0.501, 0.861)}
			Size={UDim2.fromScale(0.99, 0.266)}
			ZIndex={2}
			Key={"blueprints1"}
		>
			<uicorner
				CornerRadius={new UDim(0, 4)}
				Key={"corner1"}
			/>

			<uipadding
				Key={"UIPadding1"}
				PaddingBottom={new UDim(0, 5)}
				PaddingLeft={new UDim(0, 5)}
				PaddingRight={new UDim(0, 5)}
				PaddingTop={new UDim(0, 5)}
			/>

			<uilistlayout
				Key={"UIListLayout1"}
				Padding={new UDim(0, 5)}
				SortOrder={Enum.SortOrder.LayoutOrder}
			/>

			{props[Roact.Children]}
		</imagelabel>
	)
}