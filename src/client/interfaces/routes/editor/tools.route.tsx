import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import { BaseEntity } from "client/entities/BaseEntity";
import { EditorPropertiesVisibleState, EditorSelectionPropertiesState, EditorSelectionPropertiesSubscription, EditorToolState, EditorToolSubscription } from "client/entities/player/services/Plot/ClientPlotService";
import EditorDropdownPropertyComponent from "client/interfaces/components/editor/properties/editor.dropdown.property.component";
import EditorNumberPropertyComponent from "client/interfaces/components/editor/properties/editor.number.property.component";
import EditorPropertyHolderComponent from "client/interfaces/components/editor/properties/property.holder.component";
import PathsToolsHolderComponent from "client/interfaces/components/editor/tools/paths.tools.component";
import ToolbuttonComponent from "client/interfaces/components/editor/tools/tool.button.component";
import EditorToolHolderComponent from "client/interfaces/components/editor/tools/tool.holder.component";
import { useStateSelector } from "client/interfaces/management/InterfaceSelector";

export default function EditorToolsRoute() : Roact.Element {
	const tool = useStateSelector(EditorToolState, (state) => {
        return state.get();
    }) ?? 0;

	const properties = useStateSelector(EditorSelectionPropertiesState, (state) => {
		return state.get();
	});

	const propertiesVisible = useStateSelector(EditorPropertiesVisibleState, (state) => {
		return state.get();
	});
	
	return <>
		<EditorToolHolderComponent>
			<ToolbuttonComponent Icon="rbxassetid://11422141155" Selected={() => EditorToolState.set(0)} isSelected={tool === 0} />
			<ToolbuttonComponent Icon="rbxassetid://12967714846" Selected={() => EditorToolState.set(1)} isSelected={tool === 1} />
			<ToolbuttonComponent Icon="rbxassetid://11419705585" Selected={() => EditorToolState.set(2)} isSelected={tool === 2} />
		</EditorToolHolderComponent>

		<PathsToolsHolderComponent>
			<ToolbuttonComponent Icon="rbxassetid://12967537713" Selected={() => EditorToolState.set(3)} isSelected={tool === 3} Size={UDim2.fromScale(0.583, 2.15)} />
			<ToolbuttonComponent Icon="rbxassetid://12966849577" Selected={() => EditorToolState.set(4)} isSelected={tool === 4} Size={UDim2.fromScale(0.583, 2.15)} />
		</PathsToolsHolderComponent>

		<PathsToolsHolderComponent Position={UDim2.fromScale(0.275, 0.701)} >
		<ToolbuttonComponent Icon="rbxassetid://18381979170" Selected={() => EditorToolState.set(5)} isSelected={tool === 5} Size={UDim2.fromScale(0.583, 2.15)} />
		<ToolbuttonComponent Icon="rbxassetid://14187756336" Selected={() => EditorToolState.set(6)} isSelected={tool === 6} Size={UDim2.fromScale(0.583, 2.15)} />
		</PathsToolsHolderComponent>

		<EditorPropertyHolderComponent Visible={propertiesVisible ?? false}>
			{properties !== undefined && Object.entries(properties).map(([key, value]) => {
				if(value.type === "dropdown") return <EditorDropdownPropertyComponent Selections={value.options!} Label={key} Selected={value.value as string} OnSelected={(selection) => {
					BaseEntity.resolveClientEntity().then((entity) => {
						value.value = selection;
						entity.getPlotService().updateSelectionProperty(key, value);
					});
				}}/>
				else if (value.type === "number") return <EditorNumberPropertyComponent Label={key} Value={value.value as number} Increments={value.increments} Maximum={value.maximum} Minimum={value.minimum} Suffix={value.suffix} OnValueChanged={(selection) => {
					BaseEntity.resolveClientEntity().then((entity) => {
						value.value = selection;
						entity.getPlotService().updateSelectionProperty(key, value);
					});
				}} />
				
				return <></>
			})}
		</EditorPropertyHolderComponent>
	</>
}