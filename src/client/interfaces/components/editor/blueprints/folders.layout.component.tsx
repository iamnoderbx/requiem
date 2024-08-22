import Roact from "@rbxts/roact";
import { ScaleTextToBounds } from "../../utilities/textscaler.effect";
import { useEffect, useState } from "@rbxts/roact-hooked";

export function BlueprintFolderComponent(props: { Name: string, Icon?: string, Arrow?: boolean, Selected?: boolean, OnSelected?: () => void } & Roact.PropsWithChildren): Roact.Element {
	const [ isHovered, setHovered ] = useState(false);
	const [ isClicked, setClicked ] = useState(false);
	const [ isExpanded, setExpanded ] = useState(false);

	useEffect(() => {
		if(props.Selected !== undefined) setClicked(props.Selected);
	}, [ props.Selected ])

	return (
		<frame
			AutomaticSize={Enum.AutomaticSize.Y}
			BackgroundColor3={Color3.fromRGB(255, 255, 255)}
			BackgroundTransparency={1}
			BorderColor3={Color3.fromRGB(0, 0, 0)}
			BorderSizePixel={0}
			Size={UDim2.fromScale(1, 0)}
			Key={"container1"}
		>
			<frame 
				AnchorPoint={new Vector2(0.5, 0)}
				Size={new UDim2(1, 100, 0, ScaleTextToBounds(25))}
				BackgroundColor3={isClicked ? Color3.fromRGB(11, 90, 175) : Color3.fromRGB(255, 255, 255)}
				BackgroundTransparency={isClicked ? 0 : isHovered ? 0.925 : 1}
				BorderSizePixel={0}
				Position={UDim2.fromScale(0.5, 0)}
			>
				<textbutton 
					AnchorPoint={new Vector2(0, 0)}
					Size={UDim2.fromScale(1, 1)}
					BackgroundTransparency={1}
					TextTransparency={1}
					Text={""}
					Event={{
						MouseButton1Click: () => props.OnSelected?.(),
					}}
				/>
			</frame>
			<frame
				AutomaticSize={Enum.AutomaticSize.Y}
				BackgroundColor3={Color3.fromRGB(255, 255, 255)}
				BackgroundTransparency={1}
				BorderColor3={Color3.fromRGB(0, 0, 0)}
				BorderSizePixel={0}
				Size={UDim2.fromScale(1, 0)}
				Key={"container1"}
			>
				<frame
					BackgroundColor3={Color3.fromRGB(255, 255, 255)}
					BackgroundTransparency={1}
					BorderColor3={Color3.fromRGB(0, 0, 0)}
					BorderSizePixel={0}
					Size={new UDim2(1, 0, 0, ScaleTextToBounds(25))}
					Key={"header1"}
					Event={{
						MouseEnter: () => setHovered(true),
						MouseLeave: () => setHovered(false),
					}}
				>
					<uilistlayout
						Key={"UIListLayout1"}
						Padding={new UDim(0, 5)}
						FillDirection={Enum.FillDirection.Horizontal}
						SortOrder={Enum.SortOrder.LayoutOrder}
						VerticalAlignment={Enum.VerticalAlignment.Center}
					/>

					<imagelabel
						Image={isExpanded ? "rbxassetid://11421095840" : "rbxassetid://11419703997"}
						AnchorPoint={new Vector2(0.5, 0.5)}
						BackgroundColor3={Color3.fromRGB(255, 255, 255)}
						BackgroundTransparency={1}
						BorderColor3={Color3.fromRGB(0, 0, 0)}
						BorderSizePixel={0}
						Position={UDim2.fromOffset(30, 12)}
						Size={UDim2.fromOffset(11, ScaleTextToBounds(15))}
						ZIndex={3}
						Key={"arrow1"}
						ImageTransparency={(props.Arrow !== undefined && props.Arrow === false) ? 1 : 0}
					>
						<uiaspectratioconstraint
							Key={"UIAspectRatioConstraint1"}
							AspectType={Enum.AspectType.ScaleWithParentSize}
							DominantAxis={Enum.DominantAxis.Height}
						/>
						<textbutton 
							AnchorPoint={new Vector2(0.5, 0.5)}
							Size={UDim2.fromScale(1.5, 1.5)}
							Position={UDim2.fromScale(0.5, 0.5)}
							BackgroundTransparency={1}
							TextTransparency={1}
							ZIndex={5}
							Text={""}
							Event={{
								MouseButton1Click: () => setExpanded(!isExpanded),
							}}
						/>
					</imagelabel>

					<textlabel
						FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
						Text={props.Name}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						TextScaled={true}
						TextSize={14}
						TextTransparency={0.32}
						TextWrapped={true}
						TextXAlignment={Enum.TextXAlignment.Left}
						AnchorPoint={new Vector2(0, 0.5)}
						AutomaticSize={Enum.AutomaticSize.X}
						BackgroundColor3={Color3.fromRGB(255, 255, 255)}
						BackgroundTransparency={1}
						BorderColor3={Color3.fromRGB(0, 0, 0)}
						BorderSizePixel={0}
						LayoutOrder={2}
						Position={UDim2.fromOffset(40, 14)}
						Size={UDim2.fromOffset(85, ScaleTextToBounds(16))}
						ZIndex={3}
						Key={"body1"}
					>

					</textlabel>

					<imagelabel
						Image={props.Icon ?? "rbxassetid://13537927238"}
						AnchorPoint={new Vector2(0.5, 0.5)}
						BackgroundColor3={Color3.fromRGB(255, 255, 255)}
						BackgroundTransparency={1}
						BorderColor3={Color3.fromRGB(0, 0, 0)}
						BorderSizePixel={0}
						LayoutOrder={1}
						Position={UDim2.fromOffset(23, 12)}
						Size={UDim2.fromOffset(14, ScaleTextToBounds(14))}
						ZIndex={5}
						Visible={props.Icon !== undefined}
					>
						<uiaspectratioconstraint
							Key={"UIAspectRatioConstraint1"}
							AspectType={Enum.AspectType.ScaleWithParentSize}
							DominantAxis={Enum.DominantAxis.Height}
						/>
					</imagelabel>
				</frame>

				<uilistlayout
					Key={"UIListLayout1"}
					SortOrder={Enum.SortOrder.LayoutOrder}
				/>

				<frame
					AutomaticSize={Enum.AutomaticSize.Y}
					BackgroundColor3={Color3.fromRGB(255, 255, 255)}
					BackgroundTransparency={1}
					BorderColor3={Color3.fromRGB(0, 0, 0)}
					BorderSizePixel={0}
					Size={UDim2.fromScale(1, 0)}
					Key={"content1"}
					Visible={isExpanded}
				>
					<uilistlayout
						Key={"UIListLayout1"}
						SortOrder={Enum.SortOrder.LayoutOrder}
						VerticalAlignment={Enum.VerticalAlignment.Center}
					/>

					<uipadding
						Key={"UIPadding1"}
						PaddingLeft={new UDim(0, 10)}
					/>

					{props[Roact.Children]}
				</frame>
			</frame>
		</frame>
	)
}

export default function BlueprintFoldersComponent(props: {} & Roact.PropsWithChildren): Roact.Element {
	return (
		<frame
			BackgroundColor3={Color3.fromRGB(255, 255, 255)}
			BackgroundTransparency={1}
			BorderColor3={Color3.fromRGB(0, 0, 0)}
			BorderSizePixel={0}
			LayoutOrder={1}
			Position={UDim2.fromScale(0, 0.121)}
			Size={UDim2.fromScale(0.152, 1)}
			ZIndex={2}
			Key={"blueprints1"}
			ClipsDescendants={true}
		>
			<frame
				AnchorPoint={new Vector2(0, 1)}
				BackgroundColor3={Color3.fromRGB(33, 36, 44)}
				BorderColor3={Color3.fromRGB(0, 0, 0)}
				BorderSizePixel={0}
				Position={UDim2.fromScale(0, 0.151)}
				Size={UDim2.fromScale(1, 0.151)}
				ZIndex={3}
				Key={"header1"}
				LayoutOrder={-1}
			>
				<textlabel
					Key={"TextLabel1"}
					FontFace={new Font(
						"rbxasset://fonts/families/SourceSansPro.json",
						Enum.FontWeight.Bold,
						Enum.FontStyle.Normal
					)}
					Text={"BLUEPRINTS"}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
					TextSize={14}
					TextTransparency={0.32}
					TextWrapped={true}
					TextXAlignment={Enum.TextXAlignment.Left}
					AnchorPoint={new Vector2(0, 0.5)}
					AutomaticSize={Enum.AutomaticSize.X}
					BackgroundColor3={Color3.fromRGB(255, 255, 255)}
					BackgroundTransparency={1}
					BorderColor3={Color3.fromRGB(0, 0, 0)}
					BorderSizePixel={0}
					Position={UDim2.fromScale(0.101, 0.5)}
					Size={UDim2.fromScale(0.234, 0.466)}
					ZIndex={3}
				/>

				<imagelabel
					Key={"ImageLabel1"}
					Image={"rbxassetid://11421095840"}
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundColor3={Color3.fromRGB(255, 255, 255)}
					BackgroundTransparency={1}
					BorderColor3={Color3.fromRGB(0, 0, 0)}
					BorderSizePixel={0}
					Position={UDim2.fromScale(0.049, 0.5)}
					Size={UDim2.fromScale(0.061, 0.45)}
					ZIndex={3}
				>
					<uiaspectratioconstraint
						Key={"UIAspectRatioConstraint1"}
						AspectType={Enum.AspectType.ScaleWithParentSize}
						DominantAxis={Enum.DominantAxis.Height}
					/>
				</imagelabel>

				<uiaspectratioconstraint
					Key={"UIAspectRatioConstraint1"}
					AspectRatio={9.51}
				/>
			</frame>

			<frame
				BackgroundColor3={Color3.fromRGB(0, 0, 0)}
				BackgroundTransparency={0.8}
				BorderColor3={Color3.fromRGB(0, 0, 0)}
				BorderSizePixel={0}
				Position={UDim2.fromScale(0, 0.113)}
				Size={UDim2.fromScale(1, 0.849)}
				Key={"folders1"}
			>
				<uilistlayout
					Key={"UIListLayout1"}
					SortOrder={Enum.SortOrder.LayoutOrder}
				/>

				<uipadding
					Key={"UIPadding1"}
					PaddingLeft={new UDim(0.02, 0)}
				/>

				{props[Roact.Children]}
			</frame>

			<uilistlayout
				Key={"UIListLayout1"}
				SortOrder={Enum.SortOrder.LayoutOrder}
			/>

			<uicorner
				CornerRadius={new UDim(0, 4)}
				Key={"corner1"}
			/>
		</frame>
	)
}