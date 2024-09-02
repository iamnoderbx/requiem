import Roact from "@rbxts/roact";

export default function SplitboundComponent(props : {Position? : UDim2, Size? : UDim2} & Roact.PropsWithChildren): Roact.Element {
	return (
		<frame
			BackgroundColor3={Color3.fromRGB(41, 42, 48)}
			BackgroundTransparency={1}
			BorderColor3={Color3.fromRGB(0, 0, 0)}
			BorderSizePixel={0}
			LayoutOrder={2}
			Position={props.Position ?? UDim2.fromScale(0.022, 0.155)}
			Size={props.Size ?? UDim2.fromScale(0.479, 1.02)}
			Key={"log1"}
		>
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
				Key={"menu1"}
			>
				<uicorner
					Key={"UICorner1"}
					CornerRadius={new UDim(0, 10)}
				/>
			</imagelabel>

			{props[Roact.Children]}
		</frame>
	)
}