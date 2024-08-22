import Roact from "@rbxts/roact";
import { ScaleTextToBounds } from "../utilities/textscaler.effect";

export default function ButtonHeaderSubmenuListComponent(props: { Header: string, Body: string, HeaderPosition?: UDim2, Clicked: () => void, Arrow?: boolean }): Roact.Element {
	return (
		<frame
			BackgroundColor3={Color3.fromRGB(41, 42, 48)}
			BackgroundTransparency={1}
			BorderColor3={Color3.fromRGB(0, 0, 0)}
			BorderSizePixel={0}
			Position={UDim2.fromScale(-5.9e-08, 0.0764)}
			Size={UDim2.fromScale(0.962, 0.0546)}
			Key={"header1"}
		>
			<uicorner
				Key={"UICorner1"}
				CornerRadius={new UDim(0.2, 0)}
			/>

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
				ZIndex={0}
				Key={"menu1"}
			>
				<uicorner
					Key={"UICorner1"}
					CornerRadius={new UDim(0.2, 0)}
				/>
			</imagelabel>

			<textlabel
				Key={"TextLabel1"}
				FontFace={new Font(
					"rbxasset://fonts/families/SourceSansPro.json",
					Enum.FontWeight.Bold,
					Enum.FontStyle.Normal
				)}
				Text={props.Header}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextScaled={true}
				TextSize={14}
				TextTransparency={0.24}
				TextWrapped={true}
				TextXAlignment={Enum.TextXAlignment.Left}
				TextYAlignment={Enum.TextYAlignment.Bottom}
				BackgroundColor3={Color3.fromRGB(255, 255, 255)}
				BackgroundTransparency={1}
				BorderColor3={Color3.fromRGB(0, 0, 0)}
				BorderSizePixel={0}
				Position={props.HeaderPosition ?? UDim2.fromScale(0.0512, 0.281)}
				Size={UDim2.fromScale(0.516, 0.4)}
				ZIndex={2}
			/>

			<textbutton 
				Size={UDim2.fromScale(1, 1)}
				BackgroundTransparency={1}
				Text=""
				TextTransparency={1}
				ZIndex={5}
				Event={{
					MouseButton1Down: () => {
						props.Clicked();
					}
				}}
			/>

			<frame
				Key={"Frame1"}
				AnchorPoint={new Vector2(1, 0.5)}
				BackgroundColor3={Color3.fromRGB(255, 255, 255)}
				BackgroundTransparency={1}
				BorderColor3={Color3.fromRGB(0, 0, 0)}
				BorderSizePixel={0}
				Position={UDim2.fromScale(0.965, 0.493)}
				Size={new UDim2(0.378, 100, 1, 0)}
			>
				<uilistlayout
					Key={"UIListLayout1"}
					Padding={new UDim(0, 5)}
					FillDirection={Enum.FillDirection.Horizontal}
					HorizontalAlignment={Enum.HorizontalAlignment.Right}
					SortOrder={Enum.SortOrder.LayoutOrder}
					VerticalAlignment={Enum.VerticalAlignment.Center}
				/>

				<textlabel
					Key={"TextLabel1"}
					FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
					Text={props.Body}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={false}
					TextSize={ScaleTextToBounds(14)}
					TextTransparency={0.67}
					TextWrapped={true}
					TextXAlignment={Enum.TextXAlignment.Right}
					TextYAlignment={Enum.TextYAlignment.Bottom}
					AnchorPoint={new Vector2(1, 0.5)}
					AutomaticSize={Enum.AutomaticSize.X}
					BackgroundColor3={Color3.fromRGB(255, 255, 255)}
					BackgroundTransparency={1}
					BorderColor3={Color3.fromRGB(0, 0, 0)}
					BorderSizePixel={0}
					Position={UDim2.fromScale(0.971, 0.485)}
					Size={UDim2.fromScale(0, 0.343)}
					ZIndex={2}
				/>

				<imagelabel
					Key={"ImageLabel1"}
					Image={"rbxassetid://11422143469"}
					ImageTransparency={0.24}
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundColor3={Color3.fromRGB(255, 255, 255)}
					BackgroundTransparency={1}
					BorderColor3={Color3.fromRGB(0, 0, 0)}
					BorderSizePixel={0}
					LayoutOrder={-1}
					Position={UDim2.fromScale(0.984, 0.672)}
					Size={UDim2.fromScale(0.0314, 0.346)}
					ZIndex={2}
					Visible={props.Arrow}
				>
					<uiaspectratioconstraint
						Key={"UIAspectRatioConstraint1"}
						AspectRatio={1.02}
					/>
				</imagelabel>
			</frame>
		</frame>
	)
}