import Roact from "@rbxts/roact";

export default function BlueprintsHeaderButtonComponent(props: { Text: string, Icon: string, OnClick: () => void } & Roact.PropsWithChildren): Roact.Element {
	return <frame
		AutomaticSize={Enum.AutomaticSize.X}
		BackgroundColor3={Color3.fromRGB(33, 36, 44)}
		BorderColor3={Color3.fromRGB(0, 0, 0)}
		BorderSizePixel={0}
		Position={UDim2.fromScale(0.0968, 0.05)}
		Size={UDim2.fromScale(0.04, 0.9)}
		Key={"save1"}
		LayoutOrder={2}
	>
		<frame
			AnchorPoint={new Vector2(0.5, 0.5)}
			AutomaticSize={Enum.AutomaticSize.X}
			BackgroundColor3={Color3.fromRGB(255, 255, 255)}
			BackgroundTransparency={1}
			BorderColor3={Color3.fromRGB(0, 0, 0)}
			BorderSizePixel={0}
			Position={UDim2.fromScale(0.5, 0.5)}
			Size={UDim2.fromScale(0.041, 1)}
			Key={"container1"}
		>
			<uilistlayout
				Key={"UIListLayout1"}
				Padding={new UDim(0, 5)}
				FillDirection={Enum.FillDirection.Horizontal}
				SortOrder={Enum.SortOrder.LayoutOrder}
				VerticalAlignment={Enum.VerticalAlignment.Center}
			/>

			<uipadding
				Key={"UIPadding1"}
				PaddingBottom={new UDim(0, 1)}
				PaddingTop={new UDim(0, 1)}
			/>

			<imagelabel
				Image={props.Icon}
				BackgroundColor3={Color3.fromRGB(255, 255, 255)}
				BackgroundTransparency={1}
				BorderColor3={Color3.fromRGB(0, 0, 0)}
				BorderSizePixel={0}
				Position={UDim2.fromScale(0.0659, 0.0323)}
				Size={UDim2.fromScale(0.434, 0.6)}
				Key={"icon1"}
				LayoutOrder={-1}
			>
				<uiaspectratioconstraint
					Key={"UIAspectRatioConstraint1"}
					AspectType={Enum.AspectType.ScaleWithParentSize}
					DominantAxis={Enum.DominantAxis.Height}
				/>
			</imagelabel>

			<textlabel
				FontFace={new Font(
					"rbxasset://fonts/families/SourceSansPro.json",
					Enum.FontWeight.Bold,
					Enum.FontStyle.Normal
				)}
				Text={props.Text}
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
				Key={"label1"}
			/>
		</frame>

		<textbutton
			FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
			Text={""}
			TextColor3={Color3.fromRGB(0, 0, 0)}
			TextSize={14}
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundColor3={Color3.fromRGB(255, 255, 255)}
			BackgroundTransparency={1}
			BorderColor3={Color3.fromRGB(0, 0, 0)}
			BorderSizePixel={0}
			Position={UDim2.fromScale(0.5, 0.5)}
			Size={UDim2.fromScale(1, 1)}
			ZIndex={6}
			Key={"button1"}
			Event={{
				MouseButton1Click: props.OnClick,
			}}
		/>

		<uistroke
			Key={"UIStroke1"}
			Color={Color3.fromRGB(65, 65, 65)}
		/>

		<uicorner
			CornerRadius={new UDim(0, 4)}
			Key={"corner1"}
		/>
	</frame>
}