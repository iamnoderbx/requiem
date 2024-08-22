import Roact from "@rbxts/roact";
import { useEffect, useState } from "@rbxts/roact-hooked";

export default function TransformSnappingComponent(props: {Changed: (enabled : boolean) => void}): Roact.Element {
	const [ enabled, setEnabled ] = useState(false);
	
	useEffect(() => {
		props.Changed(enabled);
	}, [ enabled ]);

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
			Position={UDim2.fromScale(0.938, 0.708)}
			Size={UDim2.fromScale(0.115, 0.0353)}
			ZIndex={2}
			Key={"menu1"}
		>
			<uicorner
				CornerRadius={new UDim(0, 4)}
				Key={"corner1"}
			/>

			<uilistlayout
				Padding={new UDim(0, 10)}
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				SortOrder={Enum.SortOrder.LayoutOrder}
				VerticalAlignment={Enum.VerticalAlignment.Center}
				Key={"list1"}
			/>

			<uipadding
				Key={"UIPadding1"}
				PaddingBottom={new UDim(0, 15)}
				PaddingLeft={new UDim(0, 15)}
				PaddingRight={new UDim(0, 15)}
				PaddingTop={new UDim(0, 15)}
			/>

			<frame
				Key={"Frame1"}
				BackgroundColor3={Color3.fromRGB(255, 255, 255)}
				BackgroundTransparency={1}
				BorderColor3={Color3.fromRGB(0, 0, 0)}
				BorderSizePixel={0}
				Position={UDim2.fromScale(-0.0248, -0.652)}
				Size={new UDim2(1.05, 0, 0, 25)}
			>
				<textlabel
					FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
					Text={"Snapping Transforms"}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
					TextSize={14}
					TextTransparency={0.32}
					TextWrapped={true}
					TextXAlignment={Enum.TextXAlignment.Left}
					AnchorPoint={new Vector2(0, 0.5)}
					BackgroundColor3={Color3.fromRGB(255, 255, 255)}
					BackgroundTransparency={1}
					BorderColor3={Color3.fromRGB(0, 0, 0)}
					BorderSizePixel={0}
					LayoutOrder={1}
					Position={UDim2.fromScale(0.0884, 0.5)}
					Size={UDim2.fromScale(0.857, 0.567)}
					ZIndex={3}
					Key={"body1"}
				/>

				<uilistlayout
					Padding={new UDim(0, 5)}
					FillDirection={Enum.FillDirection.Horizontal}
					SortOrder={Enum.SortOrder.LayoutOrder}
					VerticalAlignment={Enum.VerticalAlignment.Center}
					Key={"list1"}
				/>

				<frame
					Key={"Frame1"}
					BackgroundColor3={Color3.fromRGB(43, 177, 255)}
					BorderColor3={Color3.fromRGB(0, 0, 0)}
					BorderSizePixel={0}
					Position={UDim2.fromScale(-0.0131, 0.251)}
					Size={UDim2.fromScale(0.0646, 0.498)}
					BackgroundTransparency={!enabled ? 1 : 0}
				>
					<uistroke
						Key={"UIStroke1"}
						ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
						Color={!enabled ? Color3.fromRGB(200, 200, 200) : Color3.fromRGB(0, 0, 0)}
						Transparency={!enabled ? 0.4 : 0.73}
					/>

					<uicorner
						Key={"UICorner1"}
						CornerRadius={new UDim(0, 4)}
					/>

					<imagebutton
						Key={"ImageButton1"}
						Image={"rbxassetid://17153645795"}
						AnchorPoint={new Vector2(0.5, 0.5)}
						BackgroundColor3={Color3.fromRGB(255, 255, 255)}
						BackgroundTransparency={1}
						BorderColor3={Color3.fromRGB(0, 0, 0)}
						BorderSizePixel={0}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.6, 0.6)}

						ImageTransparency={!enabled ? 1 : 0}
						Event={{
							MouseButton1Click: () => {
								setEnabled(!enabled)
							}
						}}
					/>

					<uiaspectratioconstraint
						Key={"UIAspectRatioConstraint1"}
						AspectRatio={0.972}
					/>
				</frame>
			</frame>
		</imagelabel>
	)
}