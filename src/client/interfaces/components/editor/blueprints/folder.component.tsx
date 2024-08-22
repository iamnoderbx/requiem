import Roact from "@rbxts/roact";

export default function FolderDocketComponent(props: { Name: string }): Roact.Element {
	return (
		<frame
			BackgroundColor3={Color3.fromRGB(255, 255, 255)}
			BackgroundTransparency={1}
			BorderColor3={Color3.fromRGB(0, 0, 0)}
			BorderSizePixel={0}
			Size={UDim2.fromOffset(100, 100)}
			Key={"blueprint1"}
		>
			<uicorner
				Key={"UICorner1"}
				CornerRadius={new UDim(0, 4)}
			/>

			<uistroke
				Key={"UIStroke1"}
				Color={Color3.fromRGB(27, 30, 36)}
			/>

			<imagelabel
				Image={"rbxassetid://13056279627"}
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundColor3={Color3.fromRGB(255, 255, 255)}
				BackgroundTransparency={1}
				BorderColor3={Color3.fromRGB(0, 0, 0)}
				BorderSizePixel={0}
				LayoutOrder={1}
				Position={UDim2.fromScale(0.499, 0.373)}
				Size={UDim2.fromScale(0.643, 0.48)}
				ZIndex={3}
				Key={"icon1"}
			>
				<uiaspectratioconstraint
					Key={"UIAspectRatioConstraint1"}
					AspectType={Enum.AspectType.ScaleWithParentSize}
					DominantAxis={Enum.DominantAxis.Height}
				/>
			</imagelabel>

			<frame
				AnchorPoint={new Vector2(0.5, 1)}
				BackgroundColor3={Color3.fromRGB(139, 109, 75)}
				BorderColor3={Color3.fromRGB(0, 0, 0)}
				BorderSizePixel={0}
				Position={UDim2.fromScale(0.5, 0.79)}
				Size={UDim2.fromScale(0.999, 0.00933)}
				ZIndex={6}
				Key={"line1"}
			/>

			<frame
				AnchorPoint={new Vector2(0.5, 1)}
				BackgroundColor3={Color3.fromRGB(49, 52, 57)}
				BorderColor3={Color3.fromRGB(0, 0, 0)}
				BorderSizePixel={0}
				Position={UDim2.fromScale(0.5, 1)}
				Size={UDim2.fromScale(0.999, 0.21)}
				ZIndex={3}
				Key={"body1"}
			>
				<uicorner
					Key={"UICorner1"}
					CornerRadius={new UDim(0, 4)}
				/>

				<textlabel
					Key={"TextLabel1"}
					FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
					Text={props.Name}
					TextColor3={Color3.fromRGB(176, 176, 176)}
					TextScaled={true}
					TextSize={14}
					TextWrapped={true}
					TextXAlignment={Enum.TextXAlignment.Left}
					TextYAlignment={Enum.TextYAlignment.Top}
					BackgroundColor3={Color3.fromRGB(255, 255, 255)}
					BackgroundTransparency={1}
					BorderColor3={Color3.fromRGB(0, 0, 0)}
					BorderSizePixel={0}
					Position={UDim2.fromScale(0.04, 0.0857)}
					Size={UDim2.fromOffset(143, 14)}
					ZIndex={5}
				/>

				<uipadding
					Key={"UIPadding1"}
					PaddingBottom={new UDim(0, 5)}
					PaddingLeft={new UDim(0, 5)}
					PaddingRight={new UDim(0, 5)}
					PaddingTop={new UDim(0, 5)}
				/>
			</frame>
		</frame>
	)
}