import Roact from "@rbxts/roact";

export default function BlueprintsHeaderComponent(props: {} & Roact.PropsWithChildren): Roact.Element {
	return (
		<frame
			BackgroundColor3={Color3.fromRGB(0, 0, 0)}
			BackgroundTransparency={0.8}
			BorderColor3={Color3.fromRGB(0, 0, 0)}
			BorderSizePixel={0}
			Size={UDim2.fromScale(1, 0.139)}
			ZIndex={2}
			Key={"header1"}
		>
			<uilistlayout
				Key={"UIListLayout1"}
				Padding={new UDim(0, 15)}
				FillDirection={Enum.FillDirection.Horizontal}
				SortOrder={Enum.SortOrder.LayoutOrder}
			/>

			<frame
				AutomaticSize={Enum.AutomaticSize.X}
				BackgroundColor3={Color3.fromRGB(255, 255, 255)}
				BackgroundTransparency={1}
				BorderColor3={Color3.fromRGB(0, 0, 0)}
				BorderSizePixel={0}
				Size={UDim2.fromScale(0, 1)}
				Key={"plot1"}
			>
				<uilistlayout
					Key={"UIListLayout1"}
					Padding={new UDim(0, 5)}
					FillDirection={Enum.FillDirection.Horizontal}
					SortOrder={Enum.SortOrder.LayoutOrder}
					VerticalAlignment={Enum.VerticalAlignment.Center}
				/>

				<textlabel
					Key={"TextLabel1"}
					FontFace={new Font(
						"rbxasset://fonts/families/SourceSansPro.json",
						Enum.FontWeight.Bold,
						Enum.FontStyle.Normal
					)}
					Text={"DEVELOPMENT WORKSPACE"}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
					TextSize={14}
					TextTransparency={0.32}
					TextWrapped={true}
					TextXAlignment={Enum.TextXAlignment.Left}
					AutomaticSize={Enum.AutomaticSize.X}
					BackgroundColor3={Color3.fromRGB(255, 255, 255)}
					BackgroundTransparency={1}
					BorderColor3={Color3.fromRGB(0, 0, 0)}
					BorderSizePixel={0}
					Size={UDim2.fromScale(0, 0.5)}
				/>

				<uicorner
					CornerRadius={new UDim(0, 4)}
					Key={"corner1"}
				/>

				<uipadding
					Key={"UIPadding1"}
					PaddingBottom={new UDim(0, 1)}
					PaddingLeft={new UDim(0, 5)}
					PaddingTop={new UDim(0, 1)}
				/>
			</frame>

			{props[Roact.Children]}

			<uiaspectratioconstraint
				Key={"UIAspectRatioConstraint1"}
				AspectRatio={56.6}
			/>
		</frame>
	)
}