import Roact from "@rbxts/roact";

export default function EntryImageButtonComponent(props: {LayoutOrder?: number, Clicked: () => void }): Roact.Element {
	return <imagebutton
		Key={"ImageButton1"}
		Image={"rbxassetid://11422142913"}
		ImageTransparency={0.5}
		AnchorPoint={new Vector2(1, 0.5)}
		BackgroundColor3={Color3.fromRGB(255, 255, 255)}
		BackgroundTransparency={1}
		BorderColor3={Color3.fromRGB(0, 0, 0)}
		BorderSizePixel={0}
		Position={UDim2.fromScale(0.98, 0.5)}
		Size={UDim2.fromOffset(19, 19)}
	/>
}