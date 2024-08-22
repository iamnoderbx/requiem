import Roact from "@rbxts/roact";

export default function ToolbuttonComponent(props: { Icon: string, Selected: () => void, isSelected: boolean, Size?: UDim2}) {
	return (
		<imagebutton
			ImageTransparency={1}
			AutoButtonColor={false}
			BackgroundColor3={Color3.fromRGB(0, 0, 0)}
			BackgroundTransparency={props.isSelected ? 0.8 :  1}
			BorderColor3={Color3.fromRGB(0, 0, 0)}
			BorderSizePixel={0}
			Position={UDim2.fromScale(-0.185, -1.28)}
			Size={props.Size ?? UDim2.fromScale(0.359, 2.16)} // UDim2.fromScale(0.583, 2.15)
			Event={{
				MouseButton1Click: props.Selected
			}}
		>
			<imagelabel
				Image={props.Icon}
				ImageTransparency={0.27}
				ScaleType={Enum.ScaleType.Fit}
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundColor3={Color3.fromRGB(255, 255, 255)}
				BackgroundTransparency={1}
				BorderColor3={Color3.fromRGB(0, 0, 0)}
				BorderSizePixel={0}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.7, 0.7)}
				Key={"icon1"}
			>
				<uiscale
					Key={"scale1"}
				/>

				<uiaspectratioconstraint Key={"UIAspectRatioConstraint"} />
			</imagelabel>

			<uicorner
				CornerRadius={new UDim(0, 4)}
				Key={"corner1"}
			/>

			<uiaspectratioconstraint
				Key={"UIAspectRatioConstraint1"}
				DominantAxis={Enum.DominantAxis.Height}
			/>

			<uistroke
				Key={"UIStroke1"}
				Color={Color3.fromRGB(68, 68, 68)}
				Enabled={props.isSelected}
			/>
		</imagebutton>
	)
}