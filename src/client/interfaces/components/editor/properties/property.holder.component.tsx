import Roact from "@rbxts/roact";

export default function EditorPropertyHolderComponent(props: { Visible: boolean, Position? : UDim2 } & Roact.PropsWithChildren) {
	return (
		<imagelabel
			Image={"rbxassetid://16255699706"}
			ImageColor3={Color3.fromRGB(149, 197, 255)}
			ImageTransparency={0.92}
			ScaleType={Enum.ScaleType.Crop}
			AnchorPoint={new Vector2(0.5, 1)}
			AutomaticSize={Enum.AutomaticSize.Y}
			BackgroundColor3={Color3.fromRGB(14, 14, 17)}
			BackgroundTransparency={0.1}
			BorderColor3={Color3.fromRGB(0, 0, 0)}
			BorderSizePixel={0}
			Position={props.Position ?? UDim2.fromScale(0.937, 0.681)}
			Size={UDim2.fromScale(0.115, 0)}
			ZIndex={2}
			Key={"menu1"}
			Visible={props.Visible}
		>
			<uicorner
				CornerRadius={new UDim(0, 4)}
				Key={"corner1"}
			/>

			<uilistlayout
				Padding={new UDim(0, 10)}
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				SortOrder={Enum.SortOrder.LayoutOrder}
				VerticalAlignment={Enum.VerticalAlignment.Bottom}
				Key={"list1"}
			/>

			<uipadding
				Key={"UIPadding1"}
				PaddingBottom={new UDim(0, 15)}
				PaddingLeft={new UDim(0, 15)}
				PaddingRight={new UDim(0, 15)}
				PaddingTop={new UDim(0, 15)}
			/>

			{props[Roact.Children]}
		</imagelabel>
	)
}