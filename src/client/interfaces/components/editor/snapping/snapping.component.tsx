import Roact from "@rbxts/roact";
import { useEffect, useRef, useState } from "@rbxts/roact-hooked";
import { Math } from "shared/utilities/math.utilities";

export default function SnappingComponent(props: { Label: string, Increments: number, Default: number, OnValueChanged: (value: number) => void, Suffix?: string }): Roact.Element {
	const [ value, setValue ] = useState(props.Default);
	const [ enabled, setEnabled ] = useState(true);

	const ref = useRef<TextBox>()

	useEffect(() => {
		if(!ref.getValue()) return;

		let ignoreNextChange = false;
		const textbox = ref.getValue()!;
		
		textbox.FocusLost.Connect(() => {
			const [ res ] = string.gsub(textbox.Text, "[^%d%-%.]", "")
			
			ignoreNextChange = true;
			textbox.Text = res + " " + props.Suffix;

			setValue(math.abs(tonumber(res) || 0));
			props.OnValueChanged(math.abs(tonumber(res) || 0));
		});
	}, [ ref.getValue() ]);
	
	return <frame
		Key={"Frame1"}
		BackgroundColor3={Color3.fromRGB(255, 255, 255)}
		BackgroundTransparency={1}
		BorderColor3={Color3.fromRGB(0, 0, 0)}
		BorderSizePixel={0}
		Position={UDim2.fromScale(0.309, 0.263)}
		Size={UDim2.fromScale(1, 0.45)}
	>
		<textlabel
			FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
			Text={props.Label}
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
			Position={UDim2.fromOffset(20, 12)}
			Size={UDim2.fromOffset(72, 14)}
			ZIndex={3}
			Key={"body1"}
		/>

		<uilistlayout
			Padding={new UDim(0, 5)}
			FillDirection={Enum.FillDirection.Horizontal}
			HorizontalAlignment={Enum.HorizontalAlignment.Center}
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
			Size={UDim2.fromScale(0.0801, 0.498)}
			BackgroundTransparency={!enabled ? 1 : 0}
		>
			<uiaspectratioconstraint
				Key={"UIAspectRatioConstraint1"}
				AspectRatio={0.972}
			/>

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
						props.OnValueChanged(!enabled ? value : 0);
					}
				}}
			/>
		</frame>

		<frame
			Key={"Frame2"}
			BackgroundColor3={Color3.fromRGB(20, 23, 27)}
			BorderColor3={Color3.fromRGB(0, 0, 0)}
			BorderSizePixel={0}
			LayoutOrder={2}
			Position={UDim2.fromScale(0.456, 0.125)}
			Size={UDim2.fromScale(0.541, 0.75)}
		>
			<uistroke
				Key={"UIStroke1"}
				Color={Color3.fromRGB(81, 81, 81)}
				Transparency={0.58}
			/>

			<uicorner
				Key={"UICorner1"}
				CornerRadius={new UDim(0, 2)}
			/>

			<textbox
				Key={"TextBox1"}
				CursorPosition={-1}
				FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
				PlaceholderColor3={Color3.fromRGB(178, 178, 178)}
				Text={value + " " + props.Suffix}
				TextColor3={Color3.fromRGB(157, 157, 157)}
				TextScaled={true}
				TextSize={14}
				TextWrapped={true}
				TextXAlignment={Enum.TextXAlignment.Left}
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundColor3={Color3.fromRGB(255, 255, 255)}
				BackgroundTransparency={1}
				BorderColor3={Color3.fromRGB(0, 0, 0)}
				BorderSizePixel={0}
				Position={UDim2.fromScale(0.341, 0.5)}
				Size={UDim2.fromScale(0.683, 0.8)}
				Ref={ref}
			/>

			<uipadding
				Key={"UIPadding1"}
				PaddingLeft={new UDim(0, 5)}
			/>

			<imagebutton
				Key={"ImageButton1"}
				Image={"rbxassetid://11421092947"}
				ImageColor3={Color3.fromRGB(145, 145, 145)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundColor3={Color3.fromRGB(255, 255, 255)}
				BackgroundTransparency={1}
				BorderColor3={Color3.fromRGB(0, 0, 0)}
				BorderSizePixel={0}
				Position={UDim2.fromScale(0.9, 0.5)}
				Size={UDim2.fromOffset(12, 12)}
				ZIndex={5}
				Event={{
					MouseButton1Click: () => {
						const rounded = math.floor((value + props.Increments) * 10) / 10

						setValue(rounded);
						props.OnValueChanged(rounded);
					}
				}}
			/>

			<imagebutton
				Key={"ImageButton2"}
				Image={"rbxassetid://11421095840"}
				ImageColor3={Color3.fromRGB(145, 145, 145)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundColor3={Color3.fromRGB(255, 255, 255)}
				BackgroundTransparency={1}
				BorderColor3={Color3.fromRGB(0, 0, 0)}
				BorderSizePixel={0}
				Position={UDim2.fromScale(0.751, 0.5)}
				Size={UDim2.fromOffset(12, 12)}
				ZIndex={5}
				Event={{
					MouseButton1Click: () => {
						const rounded = math.floor((value - props.Increments) * 10) / 10
						if(rounded < 0) return;

						setValue(rounded);
						props.OnValueChanged(rounded);
					}
				}}
			/>
		</frame>
	</frame>
}