import Roact from "@rbxts/roact";

export default function EntrySoldOverlayComponent(props: { Visible: boolean }): Roact.Element {
	return (
		<frame
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundColor3={Color3.fromRGB(0, 0, 0)}
			BackgroundTransparency={0.35}
			BorderColor3={Color3.fromRGB(0, 0, 0)}
			BorderSizePixel={0}
			Position={UDim2.fromScale(0.5, 0.5)}
			Size={UDim2.fromScale(1, 1)}
			ZIndex={10}
			Key={"sold1"}
			Visible={props.Visible}
		>
			<uicorner
				Key={"UICorner11"}
			/>

			<textlabel
				Key={"TextLabel1"}
				FontFace={new Font(
					"rbxasset://fonts/families/SourceSansPro.json",
					Enum.FontWeight.Bold,
					Enum.FontStyle.Normal
				)}
				Text={"SOLD"}
				TextColor3={Color3.fromRGB(190, 50, 50)}
				TextScaled={true}
				TextSize={14}
				TextWrapped={true}
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundColor3={Color3.fromRGB(255, 255, 255)}
				BackgroundTransparency={1}
				BorderColor3={Color3.fromRGB(0, 0, 0)}
				BorderSizePixel={0}
				Position={UDim2.fromScale(0.485, 0.497)}
				Rotation={-3}
				Size={UDim2.fromOffset(123, 30)}
				ZIndex={12}
			>
				<uistroke
					Key={"UIStroke1"}
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					Color={Color3.fromRGB(190, 50, 50)}
					Thickness={2}
				/>

				<uicorner
					Key={"UICorner1"}
					CornerRadius={new UDim(0, 5)}
				/>

				<uipadding
					Key={"UIPadding1"}
					PaddingBottom={new UDim(0.1, 0)}
					PaddingTop={new UDim(0.1, 0)}
				/>
			</textlabel>
		</frame>
	)
}