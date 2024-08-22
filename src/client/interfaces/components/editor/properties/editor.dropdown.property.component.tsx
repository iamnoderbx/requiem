import Roact from "@rbxts/roact";
import { useEffect, useState } from "@rbxts/roact-hooked";

export default function EditorDropdownPropertyComponent(props: { Label: string, Selected: string, Selections: string[], OnSelected: (selection: string) => void }): Roact.Element {
	const [ selected, setSelected ] = useState<string>(props.Selected);
	const [ open, setOpened ] = useState<boolean>(false);

	return (
		<frame
			Key={"Frame1"}
			BackgroundColor3={Color3.fromRGB(255, 255, 255)}
			BackgroundTransparency={1}
			BorderColor3={Color3.fromRGB(0, 0, 0)}
			BorderSizePixel={0}
			Position={UDim2.fromScale(0.309, 0.263)}
			Size={new UDim2(1, 0, 0, 25)}
			ZIndex={4}
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
				Position={UDim2.fromScale(0.108, 0.486)}
				Size={UDim2.fromScale(0.39, 0.567)}
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
				BackgroundColor3={Color3.fromRGB(20, 23, 27)}
				BorderColor3={Color3.fromRGB(0, 0, 0)}
				BorderSizePixel={0}
				LayoutOrder={2}
				Position={UDim2.fromScale(0.456, 0.125)}
				Size={UDim2.fromScale(0.541, 0.75)}
				ZIndex={3}
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

				<uipadding
					Key={"UIPadding1"}
					PaddingLeft={new UDim(0, 5)}
				/>

				<imagebutton
					Key={"ImageButton1"}
					Image={"rbxassetid://11421095840"}
					ImageColor3={Color3.fromRGB(145, 145, 145)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundColor3={Color3.fromRGB(255, 255, 255)}
					BackgroundTransparency={1}
					BorderColor3={Color3.fromRGB(0, 0, 0)}
					BorderSizePixel={0}
					Position={UDim2.fromScale(0.9, 0.5)}
					Size={UDim2.fromScale(0.12, 0.648)}
					ZIndex={5}
				/>

				<textlabel
					FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
					Text={selected}
					TextColor3={Color3.fromRGB(157, 157, 157)}
					TextScaled={true}
					TextSize={14}
					TextWrapped={true}
					TextXAlignment={Enum.TextXAlignment.Left}
					Active={true}
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundColor3={Color3.fromRGB(248, 248, 248)}
					BackgroundTransparency={1}
					BorderColor3={Color3.fromRGB(0, 0, 0)}
					BorderSizePixel={0}
					Position={UDim2.fromScale(0.341, 0.5)}
					Selectable={true}
					Size={UDim2.fromScale(0.649, 0.8)}
					Key={"TextBox1"}
				/>

				<textbutton
					Size={UDim2.fromScale(1, 1)}
					BackgroundTransparency={1}
					Text=""
					TextTransparency={1}
					Event={{
						MouseButton1Click: () => setOpened(!open)
					}}
				/>

				<frame
					Key={"Frame1"}
					AnchorPoint={new Vector2(0.5, 0)}
					AutomaticSize={Enum.AutomaticSize.Y}
					BackgroundColor3={Color3.fromRGB(33, 33, 33)}
					BorderColor3={Color3.fromRGB(0, 0, 0)}
					BorderSizePixel={0}
					Position={UDim2.fromScale(0.474, 1)}
					Size={UDim2.fromScale(1.053, 0)}
					ZIndex={5}
					Visible={open}
				>
					<uilistlayout
						Padding={new UDim(0, 1)}
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
						SortOrder={Enum.SortOrder.LayoutOrder}
						VerticalAlignment={Enum.VerticalAlignment.Center}
						Key={"list1"}
					/>

					{props.Selections.map((selection, index) => {
						return <frame
							Key={"Frame1"}
							BackgroundColor3={Color3.fromRGB(13, 15, 17)}
							BorderColor3={Color3.fromRGB(0, 0, 0)}
							BorderSizePixel={0}
							LayoutOrder={2}
							Position={UDim2.fromScale(0.456, 0.125)}
							Size={new UDim2(1, 0, 0, 20)}
							ZIndex={3}
						>
							<uipadding
								Key={"UIPadding1"}
								PaddingLeft={new UDim(0, 5)}
							/>

							<textbutton
								FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
								Text={selection}
								TextColor3={Color3.fromRGB(157, 157, 157)}
								TextScaled={true}
								TextSize={14}
								TextWrapped={true}
								TextXAlignment={Enum.TextXAlignment.Left}
								Active={true}
								AnchorPoint={new Vector2(0.5, 0.5)}
								BackgroundColor3={Color3.fromRGB(248, 248, 248)}
								BackgroundTransparency={1}
								BorderColor3={Color3.fromRGB(0, 0, 0)}
								BorderSizePixel={0}
								Position={UDim2.fromScale(0.341, 0.5)}
								Selectable={true}
								Size={UDim2.fromScale(0.649, 0.75)}
								Key={"TextBox1"}
								Event={{
									MouseButton1Click: () => {
										setSelected(selection);
										setOpened(false);

										props.OnSelected(selection);
									}
								}}
							/>
						</frame>
					})}

					<uistroke
						Key={"UIStroke1"}
						Color={Color3.fromRGB(81, 81, 81)}
						Transparency={0.58}
					/>

					<uicorner
						Key={"UICorner1"}
						CornerRadius={new UDim(0, 2)}
					/>
				</frame>
			</frame>

			<frame
				Key={"Frame2"}
				BackgroundColor3={Color3.fromRGB(43, 177, 255)}
				BackgroundTransparency={1}
				BorderColor3={Color3.fromRGB(0, 0, 0)}
				BorderSizePixel={0}
				Position={UDim2.fromScale(0, 0.251)}
				Size={UDim2.fromScale(0.0646, 0.498)}
			>
				<uistroke
					Key={"UIStroke1"}
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					Transparency={0.73}
				/>

				<uicorner
					Key={"UICorner1"}
					CornerRadius={new UDim(0, 4)}
				/>

				<uiaspectratioconstraint
					Key={"UIAspectRatioConstraint1"}
					AspectRatio={0.972}
				/>
			</frame>
		</frame>
	)
}