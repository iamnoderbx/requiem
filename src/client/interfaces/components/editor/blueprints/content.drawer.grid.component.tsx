import Roact from "@rbxts/roact";
import { useState } from "@rbxts/roact-hooked";

export default function ContentDrawerLookupContainer(props: {OnSearchChanged : (search : string) => void} & Roact.PropsWithChildren): Roact.Element {
	return (
		<frame
			BackgroundColor3={Color3.fromRGB(33, 36, 44)}
			BorderColor3={Color3.fromRGB(0, 0, 0)}
			BorderSizePixel={0}
			LayoutOrder={2}
			Position={UDim2.fromScale(0.153, 0)}
			Size={UDim2.fromScale(0.846, 0.95)}
			Key={"contents1"}
		>
			<uicorner
				CornerRadius={new UDim(0, 4)}
				Key={"corner1"}
			/>

			<uistroke
				Key={"UIStroke1"}
				Color={Color3.fromRGB(49, 53, 65)}
				Transparency={0.41}
			/>

			<frame
				BackgroundColor3={Color3.fromRGB(15, 16, 20)}
				BorderColor3={Color3.fromRGB(0, 0, 0)}
				BorderSizePixel={0}
				Size={UDim2.fromOffset(346, 23)}
				Key={"search1"}
			>
				<uicorner
					Key={"UICorner1"}
					CornerRadius={new UDim(1, 8)}
				/>

				<uistroke
					Key={"UIStroke1"}
					Color={Color3.fromRGB(255, 255, 255)}
					Transparency={0.7}
				/>

				<imagelabel
					Key={"ImageLabel1"}
					Image={"rbxassetid://11293977875"}
					BackgroundColor3={Color3.fromRGB(255, 255, 255)}
					BackgroundTransparency={1}
					BorderColor3={Color3.fromRGB(0, 0, 0)}
					BorderSizePixel={0}
					Position={UDim2.fromScale(0.0173, 0.13)}
					Size={UDim2.fromScale(0.0491, 0.739)}
				>
					<uiaspectratioconstraint Key={"UIAspectRatioConstraint"} />
				</imagelabel>

				<textbox
					FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
					PlaceholderColor3={Color3.fromRGB(115, 115, 115)}
					PlaceholderText={"Search Blueprints"}
					Text={""}
					TextColor3={Color3.fromRGB(189, 189, 189)}
					TextScaled={true}
					TextSize={14}
					TextWrapped={true}
					TextXAlignment={Enum.TextXAlignment.Left}
					AnchorPoint={new Vector2(0, 0.5)}
					BackgroundColor3={Color3.fromRGB(255, 255, 255)}
					BackgroundTransparency={1}
					BorderColor3={Color3.fromRGB(0, 0, 0)}
					BorderSizePixel={0}
					Position={UDim2.fromScale(0.084, 0.5)}
					Size={new UDim2(0.303, 171, 0.632, 0)}
					Key={"input1"}
					Event={{
						FocusLost: (textbox) => props.OnSearchChanged(textbox.Text),
					}}
				/>
			</frame>

			<uilistlayout
				Key={"UIListLayout1"}
				Padding={new UDim(0, 3)}
				SortOrder={Enum.SortOrder.LayoutOrder}
			/>

			<uipadding
				Key={"UIPadding1"}
				PaddingBottom={new UDim(0, 5)}
				PaddingLeft={new UDim(0, 5)}
				PaddingRight={new UDim(0, 5)}
				PaddingTop={new UDim(0, 2)}
			/>

			<scrollingframe
				AutomaticCanvasSize={Enum.AutomaticSize.Y}
				CanvasSize={new UDim2}
				ScrollBarImageColor3={Color3.fromRGB(173, 173, 173)}
				ScrollBarThickness={3}
				BackgroundColor3={Color3.fromRGB(248, 248, 248)}
				BackgroundTransparency={1}
				BorderColor3={Color3.fromRGB(0, 0, 0)}
				BorderSizePixel={0}
				Position={UDim2.fromScale(-8.27e-08, 0.103)}
				Selectable={false}
				Size={UDim2.fromScale(0.999, 0.892)}
				Key={"scroll1"}
			>
				<uigridlayout
					Key={"UIGridLayout1"}
					CellSize={UDim2.fromScale(0.109, 0.95)}
					SortOrder={Enum.SortOrder.LayoutOrder}
				/>

				{props[Roact.Children]}

				<uipadding
					Key={"UIPadding1"}
					PaddingBottom={new UDim(0, 2)}
					PaddingLeft={new UDim(0, 2)}
					PaddingRight={new UDim(0, 2)}
					PaddingTop={new UDim(0, 2)}
				/>
			</scrollingframe>
		</frame>
	)
}