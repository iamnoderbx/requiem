import Roact from "@rbxts/roact";
import ContainerFrameComponent from "client/interfaces/components/utilities/frame.component";
import BlueprintsRoutePage from "./blueprints.route";
import { useStateSelector } from "client/interfaces/management/InterfaceSelector";
import { States } from "client/entities/player/ClientPlayerStates";
import EditorSnappingRoute from "./snapping.route";
import EditorToolsRoute from "./tools.route";

export default function WorldEditorRoute() : Roact.Element {
	const isBuilding = useStateSelector(States.States.subscription("building"), (state) => {
        return state.get();
    })

	return <ContainerFrameComponent Visible={isBuilding}>
		<BlueprintsRoutePage />
		<EditorSnappingRoute />
		<EditorToolsRoute />
	</ContainerFrameComponent>
}