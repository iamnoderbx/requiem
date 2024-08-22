import Roact from "@rbxts/roact";

export default function EntryParagraphComponent(props: { Header: string, Body: string, LayoutOrder?: number }): Roact.Element {
	return (
		<frame
			BackgroundColor3={Color3.fromRGB(255, 255, 255)}
			BackgroundTransparency={1}
			BorderColor3={Color3.fromRGB(0, 0, 0)}
			BorderSizePixel={0}
			LayoutOrder={props.LayoutOrder ?? 2}
			Position={UDim2.fromScale(0.0174, 0.171)}
			Size={UDim2.fromScale(0.962, 0.118)}
			Key={"shout1"}
		>
			<uiaspectratioconstraint
				Key={"UIAspectRatioConstraint1"}
				AspectRatio={12.2}
			/>
			<textlabel
				FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
				Text={props.Body}
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
				Position={UDim2.fromScale(0.0312, 0.498)}
				Size={UDim2.fromScale(0.949, 0.195)}
				ZIndex={3}
				Key={"description1"}
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
				ZIndex={0}
				Key={"menu1"}
			>
				<uicorner Key={"UICorner"} />
			</imagelabel>

			<frame
				AnchorPoint={new Vector2(0, 0.5)}
				BackgroundColor3={Color3.fromRGB(255, 255, 255)}
				BackgroundTransparency={1}
				BorderColor3={Color3.fromRGB(0, 0, 0)}
				BorderSizePixel={0}
				Position={UDim2.fromScale(0.0312, 0.345)}
				Size={UDim2.fromScale(0.436, 0.222)}
				Key={"data1"}
			>
				<uilistlayout
					Key={"UIListLayout1"}
					ItemLineAlignment={Enum.ItemLineAlignment.Center}
					Padding={new UDim(0.015, 0)}
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
					Text={props.Header}
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
					Position={UDim2.fromScale(-7.03e-08, 0.221)}
					Size={UDim2.fromScale(0.21, 1)}
					ZIndex={2}
					Key={"name1"}
				/>
			</frame>
		</frame>
	)
}