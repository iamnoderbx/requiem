import Roact from "@rbxts/roact";
import { useEffect, useRef, useState } from "@rbxts/roact-hooked";
import { RunService } from "@rbxts/services";

export function EntryViewportFrame(props: {Model? : Model, Scale?: number, Spins?: boolean} & Roact.PropsWithChildren): Roact.Element {
	const ref = useRef<ViewportFrame>();
	const [ hovered, setHovered ] = useState(false);
	const [ model, setModel ] = useState<Model>();

	const [ connection, setConnection ] = useState<RBXScriptConnection>();

	useEffect(() => {
		if(!ref.getValue()) return;
		if(!props.Model) return;

		if(!model) return;

		const calculateCameraAngle = (camera : Camera, model : Model, angle : number, spin : boolean) => {
			let [ modelCF, modelSize ] = model.GetBoundingBox();
			const rotInv = (modelCF.sub(modelCF.Position)).Inverse();

			modelCF = modelCF.mul(rotInv).mul(new CFrame(0, 0, 0));
			modelSize = rotInv.mul(modelSize);
			modelSize = new Vector3(math.abs(modelSize.X), math.abs(modelSize.Y), math.abs(modelSize.Z));

			let diagonal = 0;
			let maxExtent = math.max(modelSize.X, modelSize.Y, modelSize.Z);
			let tan = math.tan(math.rad(45 / 2));

			if (maxExtent === modelSize.X) {
				diagonal = math.sqrt(modelSize.Y * modelSize.Y + modelSize.Z * modelSize.Z) / 2;
			} else if (maxExtent === modelSize.Y) {
				diagonal = math.sqrt(modelSize.X * modelSize.X + modelSize. Z* modelSize.Z) / 2;
			} else {
				diagonal = math.sqrt(modelSize.X * modelSize.X + modelSize.Y * modelSize.Y) / 2;
			}

			let minDist = (maxExtent / 5) / tan + diagonal;
			camera.CFrame = modelCF.mul(CFrame.fromEulerAnglesXYZ(0, math.rad(angle), 0).mul(new CFrame(0, 0, minDist + (props.Scale ?? 3))));

			spin && setConnection(RunService.RenderStepped.Connect((dt) => {
				angle += (0.2 * dt * 60);
				camera.CFrame = modelCF.mul(CFrame.fromEulerAnglesXYZ(0, math.rad(angle), 0).mul(new CFrame(0, 0, minDist + (props.Scale ?? 3))));
			}));
		}

		const viewport = ref.getValue()!;

		if(ref.getValue()?.CurrentCamera) ref.getValue()?.CurrentCamera?.Destroy();

		const camera = new Instance("Camera");
		camera.Parent = ref.getValue();

		viewport.CurrentCamera = camera;

		let worldviewModel = viewport.FindFirstChildWhichIsA("WorldModel");

		if(!model?.Parent) {
			if(!worldviewModel) {
				worldviewModel = new Instance("WorldModel")
				worldviewModel.Parent = viewport;
			}

			model.PivotTo(new CFrame(0, 0, 0))
			model.Parent = worldviewModel;
		}

		calculateCameraAngle(camera, model, 45 + 180, false);

		if(connection) connection.Disconnect();
		if(hovered && props.Spins !== false) {
			calculateCameraAngle(camera, model, 45 + 180, true);
		}

	}, [ ref.getValue(), model, hovered ]);

	useEffect(() => {
		if(!props.Model) return setModel(undefined);

		if(!ref.getValue()) return;
		if(model?.Name === props.Model.Name) return;

		if(model) model.Destroy()

		setModel(props.Model.Clone());
	}, [ props.Model ]);

	return <viewportframe
		Key={"ViewportFrame1"}
		Ambient={Color3.fromRGB(148, 154, 163)}
		LightColor={Color3.fromRGB(120, 130, 186)}
		AnchorPoint={new Vector2(0.5, 0.5)}
		BackgroundColor3={Color3.fromRGB(0, 0, 0)}
		BackgroundTransparency={1}
		BorderColor3={Color3.fromRGB(0, 0, 0)}
		BorderSizePixel={0}
		Position={UDim2.fromScale(0.5, 0.5)}
		Size={UDim2.fromScale(1, 1)}
		Ref={ref}
		Event={{
			MouseEnter: () => setHovered(true),
			MouseLeave: () => setHovered(false),
		}}
	>
		{props[Roact.Children]}
	</viewportframe>
}

export function EntryViewportDataListComponent(props: {} & Roact.PropsWithChildren): Roact.Element {
	return <frame
		AnchorPoint={new Vector2(0, 0.5)}
		BackgroundColor3={Color3.fromRGB(255, 255, 255)}
		BackgroundTransparency={1}
		BorderColor3={Color3.fromRGB(0, 0, 0)}
		BorderSizePixel={0}
		Position={UDim2.fromScale(-3.07e-08, 0.919)}
		Size={UDim2.fromScale(1, 0.0366)}
		Key={"data1"}
		ZIndex={5}
	>
		<uilistlayout
			Key={"UIListLayout1"}
			ItemLineAlignment={Enum.ItemLineAlignment.Center}
			Padding={new UDim(0.02, 0)}
			FillDirection={Enum.FillDirection.Horizontal}
			HorizontalAlignment={Enum.HorizontalAlignment.Center}
			SortOrder={Enum.SortOrder.LayoutOrder}
			VerticalAlignment={Enum.VerticalAlignment.Center}
		/>

		{props[Roact.Children]}
	</frame>
}

export default function EntryViewportComponent(props: {Position?: UDim2, Transparent?: boolean} & Roact.PropsWithChildren): Roact.Element {
	return (
		<frame
			BackgroundColor3={Color3.fromRGB(41, 42, 48)}
			BackgroundTransparency={1}
			BorderColor3={Color3.fromRGB(0, 0, 0)}
			BorderSizePixel={0}
			LayoutOrder={2}
			Position={props.Position ?? UDim2.fromScale(0.0188, 0.267)}
			Size={UDim2.fromScale(0.962, 0.657)}
			Key={"log1"}
		>
			<uicorner Key={"UICorner"} />

			<imagelabel
				Image={"rbxassetid://16255699706"}
				ImageColor3={Color3.fromRGB(149, 197, 255)}
				ImageTransparency={props.Transparent ? 1 : 0.97}
				ScaleType={Enum.ScaleType.Crop}
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundColor3={Color3.fromRGB(31, 33, 39)}
				BackgroundTransparency={props.Transparent ? 1 : 0.35}
				BorderColor3={Color3.fromRGB(0, 0, 0)}
				BorderSizePixel={0}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(1, 1)}
				Key={"menu1"}
				ZIndex={-1}

			>
				<uicorner Key={"UICorner"} />
			</imagelabel>

			{props[Roact.Children]}


		</frame>
	)
}