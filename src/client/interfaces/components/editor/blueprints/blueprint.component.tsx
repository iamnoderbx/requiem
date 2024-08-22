import Roact from "@rbxts/roact";
import { Blueprint } from "shared/Blueprint";
import { ScaleTextToBounds } from "../../utilities/textscaler.effect";
import { useEffect, useState } from "@rbxts/roact-hooked";
import { BaseEntity } from "client/entities/BaseEntity";
import { RunService } from "@rbxts/services";

export default function BlueprintComponent(props : {Blueprint: Blueprint.Type} & Roact.PropsWithChildren): Roact.Element {
	const [ hovered, setHovered ] = useState(false);
	
    const [isDragging, setDragging] = useState(false);
    const [connections, setConnections] = useState<Array<RBXScriptConnection | undefined>>([]);

	useEffect(() => {
        if (!isDragging) {
            for (const connection of connections) {
                connection?.Disconnect();
            }

			RunService.UnbindFromRenderStep("blueprint_drag")
            setConnections([]);
            return;
        }

		BaseEntity.resolveClientEntity().then((entity) => {
			const connections = entity.getPlotService().onBlueprintDragged(props.Blueprint, setDragging);
			connections && setConnections(connections);
		});

		return () => {
			RunService.UnbindFromRenderStep("blueprint_drag")

			for (const connection of connections) {
				connection?.Disconnect();
			}
		}
    }, [isDragging])

	return (
		<frame
			BackgroundColor3={Color3.fromRGB(255, 255, 255)}
			BackgroundTransparency={1}
			BorderColor3={Color3.fromRGB(0, 0, 0)}
			BorderSizePixel={0}
			Size={UDim2.fromOffset(100, 100)}
			Key={"blueprint1"}
			Event={{
				MouseEnter: () => setHovered(true),
				MouseLeave: () => setHovered(false),
			}}
		>
			<textbutton 
				BackgroundTransparency={1}
				TextTransparency={1}
				Size={UDim2.fromScale(1, 1)}
				Visible={!isDragging}

				Event={{
					MouseButton1Down: () => setDragging(true)
				}}
			/>
			<imagelabel
				Image={"rbxassetid://18318517344"}
				ImageColor3={Color3.fromRGB(22, 22, 22)}
				ScaleType={Enum.ScaleType.Tile}
				TileSize={UDim2.fromScale(0.25, 0.25)}
				BackgroundColor3={Color3.fromRGB(255, 255, 255)}
				BackgroundTransparency={1}
				BorderColor3={Color3.fromRGB(0, 0, 0)}
				BorderSizePixel={0}
				Size={UDim2.fromScale(1, 0.747)}
				Key={"image1"}
			>
				<uicorner
					Key={"UICorner1"}
					CornerRadius={new UDim(0, 4)}
				/>

				<uiaspectratioconstraint
					Key={"UIAspectRatioConstraint1"}
					AspectType={Enum.AspectType.ScaleWithParentSize}
				/>

				{props[Roact.Children]}
			</imagelabel>

			<uicorner
				Key={"UICorner1"}
				CornerRadius={new UDim(0, 4)}
			/>

			<frame
				AnchorPoint={new Vector2(0.5, 1)}
				BackgroundColor3={Color3.fromRGB(49, 52, 57)}
				BorderColor3={Color3.fromRGB(0, 0, 0)}
				BorderSizePixel={0}
				Position={UDim2.fromScale(0.5, 1)}
				Size={UDim2.fromScale(0.999, 0.322)}
				ZIndex={3}
				Key={"body1"}
			>
				<uicorner
					Key={"UICorner1"}
					CornerRadius={new UDim(0, 4)}
				/>

				<textlabel
					FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
					Text={props.Blueprint[Blueprint.Key.NAME]}
					TextColor3={Color3.fromRGB(176, 176, 176)}
					TextScaled={true}
					TextSize={14}
					TextWrapped={true}
					TextXAlignment={Enum.TextXAlignment.Left}
					TextYAlignment={Enum.TextYAlignment.Top}
					BackgroundColor3={Color3.fromRGB(255, 255, 255)}
					BackgroundTransparency={1}
					BorderColor3={Color3.fromRGB(0, 0, 0)}
					BorderSizePixel={0}
					Position={UDim2.fromScale(0.04, 0.0857)}
					Size={UDim2.fromOffset(143, ScaleTextToBounds(14))}
					ZIndex={5}
					Key={"title1"}
				/>

				<uipadding
					Key={"UIPadding1"}
					PaddingBottom={new UDim(0, 5)}
					PaddingLeft={new UDim(0, 5)}
					PaddingRight={new UDim(0, 5)}
					PaddingTop={new UDim(0, 5)}
				/>
			</frame>

			<uistroke
				Key={"UIStroke1"}
				Color={hovered ? Color3.fromRGB(64, 71, 89) : Color3.fromRGB(27, 30, 36)}
			/>

			<frame
				AnchorPoint={new Vector2(0.5, 1)}
				BackgroundColor3={Color3.fromRGB(71, 92, 139)}
				BorderColor3={Color3.fromRGB(0, 0, 0)}
				BorderSizePixel={0}
				Position={UDim2.fromScale(0.5, 0.692)}
				Size={UDim2.fromScale(0.999, 0.00933)}
				ZIndex={6}
				Key={"line1"}
			/>
		</frame>
	)
}