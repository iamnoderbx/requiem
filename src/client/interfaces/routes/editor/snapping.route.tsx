import Roact from "@rbxts/roact";
import { BaseEntity } from "client/entities/BaseEntity";
import SnappingComponent from "client/interfaces/components/editor/snapping/snapping.component";
import SnappingHolderComponent from "client/interfaces/components/editor/snapping/snapping.holder.component";
import TransformSnappingComponent from "client/interfaces/components/editor/snapping/transform.snapping.component";

export default function EditorSnappingRoute(): Roact.Element {
	return <>
		<SnappingHolderComponent>
			<SnappingComponent Label="Move Snap" Increments={0.2} Default={0.2} Suffix="studs" OnValueChanged={(value: number) => {
				BaseEntity.resolveClientEntity().then((entity) => {
					entity.getPlotService().setMoveSnap(value);
				});
			}} />

			<SnappingComponent Label="Rotation Snap" Increments={5} Default={5} Suffix="degrees" OnValueChanged={(value: number) => {
				BaseEntity.resolveClientEntity().then((entity) => {
					entity.getPlotService().setRotationSnap(value);
				});
			}} />
		</SnappingHolderComponent>

		<TransformSnappingComponent Changed={(enabled) => {
			BaseEntity.resolveClientEntity().then((entity) => {
				entity.getPlotService().setNodeSnapping(enabled);
			});
		}}/>
	</>
}