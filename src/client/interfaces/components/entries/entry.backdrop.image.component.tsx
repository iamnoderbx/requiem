import Roact from "@rbxts/roact";

export default function EntryBackdropImageComponent(props: { Image: string }): Roact.Element {
	return (
		<imagelabel
			Image={props.Image}
			ImageTransparency={0.5}
			AnchorPoint={new Vector2(1, 0.5)}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(1, 0.479)}
			Size={UDim2.fromOffset(549, 529)}
			Key={"11"}
		>
			<uigradient
				Key={"UIGradient1"}
				Transparency={new NumberSequence([
					new NumberSequenceKeypoint(0, 1),
					new NumberSequenceKeypoint(0.285, 0.607),
					new NumberSequenceKeypoint(0.503, 0.607),
					new NumberSequenceKeypoint(0.736, 0.601),
					new NumberSequenceKeypoint(1, 1),
				])}
			/>
		</imagelabel>
	)
}