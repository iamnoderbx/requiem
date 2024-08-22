import { Players, RunService, UserInputService, Workspace } from "@rbxts/services";

export namespace ClientPlotCamera {
	const connections: Array<RBXScriptConnection> = [];

	let startedMovementDt = tick();
	let maxDirectionalView = 90;
	let isMoving: boolean = false;

	let originalCameraCFrame : CFrame | undefined;

	let boundsCenter : Vector3 | undefined;
	let boundsSize : number = 0;

	let location : CFrame = new CFrame()

	let defaultSpeed = 0.5;
	let speed : number = defaultSpeed;
	
	let cameraRotationEnabled = true;

	const clientSettings = UserSettings().GetService("UserGameSettings");
	let cameraTurnDampening = math.clamp(4 - (clientSettings.MouseSensitivity * 3), 1, 4);

	function getVectorDirection() {
		let vector = new Vector3();

		if (UserInputService.IsKeyDown(Enum.KeyCode.W)) {
			vector = vector.add(new Vector3(0, 0, -1));
		}

		if (UserInputService.IsKeyDown(Enum.KeyCode.S)) {
			vector =vector.add(new Vector3(0, 0, 1));
		}

		if (UserInputService.IsKeyDown(Enum.KeyCode.A)) {
			vector = vector.add(new Vector3(-1, 0, 0));
		}

		if (UserInputService.IsKeyDown(Enum.KeyCode.D)) {
			vector = vector.add(new Vector3(1, 0, 0));
		}

		if (UserInputService.IsKeyDown(Enum.KeyCode.E)) {
			vector = vector.add(new Vector3(0, 1, 0));
		}

		if (UserInputService.IsKeyDown(Enum.KeyCode.Q)) {
			vector = vector.add(new Vector3(0, -1, 0));
		}

		return vector;
	}

	export function setCameraRotationEnabled(enabled : boolean) {
		cameraRotationEnabled = enabled;
	}

	export function bounds(center : Vector3, size : number) {
		boundsCenter = center;
		boundsSize = size;
	}

	export function disable() {
		const client = Players.LocalPlayer;

		connections.forEach(connection => connection.Disconnect());
		connections.clear();

		if(originalCameraCFrame) {
			Workspace.CurrentCamera!.CFrame = originalCameraCFrame;
		}

		client.CameraMinZoomDistance = 0;
	}

	export function enable() {
		const cam = Workspace.CurrentCamera!;
		const mouse = Players.LocalPlayer.GetMouse();

		originalCameraCFrame = cam.CFrame;
		location = boundsCenter ? new CFrame(boundsCenter.add(new Vector3(0, 10, 0))) : cam.CFrame; 
		

		let yaw = 0;
		let pitch = 0;
		const maxPitch = math.rad(85);

		const client = Players.LocalPlayer;
		const userInputService = UserInputService;

		client.CameraMinZoomDistance = 30;

		const inputChanged = userInputService.InputChanged.Connect((inputObj) => {
			if (inputObj.UserInputType === Enum.UserInputType.MouseMovement) {
				if(UserInputService.MouseBehavior === Enum.MouseBehavior.LockCenter) return;
				if(!cameraRotationEnabled) return;

				const dx = inputObj.Delta.X / cameraTurnDampening;
				const dy = inputObj.Delta.Y / cameraTurnDampening;

				yaw = yaw - dx * math.pi / 180;
				pitch = pitch - dy * math.pi / 180;
				pitch = math.clamp(pitch, -maxPitch, maxPitch);

				location = new CFrame(cam.CFrame.Position).mul(CFrame.Angles(0, yaw, 0)).mul(CFrame.Angles(pitch, 0, 0));
			}
		})

		const calculateNudgeDirection = () => {
			const mousePosition = new Vector2(mouse.X, mouse.Y);
			const screenSize = Workspace.CurrentCamera!.ViewportSize;
			const screenCenter = new Vector2(screenSize.X / 2, screenSize.Y / 2);
			const mouseOffset = (mousePosition.sub(screenCenter)).div(screenSize);

			const nudgeFactor = 3;
			const nudgeDirection = new CFrame(mouseOffset.X * nudgeFactor, -mouseOffset.Y * nudgeFactor, 0);

			return nudgeDirection;
		}

		const wheelForward = mouse.WheelForward.Connect(() => {
			location = location.mul(new CFrame(0, 0, -7).mul(calculateNudgeDirection()));
			cam.CFrame = location;
		})

		const wheelBackward = mouse.WheelBackward.Connect(() => {
			location = location.mul(new CFrame(0, 0, 7).mul(calculateNudgeDirection().Inverse()));
			cam.CFrame = location;
		})

		const onGameSettingChanged = (nameOfSetting: string) => {
			const [ canGetSetting, setting ] = pcall(() => {
				return (clientSettings as unknown as Record<string, unknown>)[nameOfSetting];
			})

			if (canGetSetting && nameOfSetting === "MouseSensitivity") {
				cameraTurnDampening = math.clamp(4 - (clientSettings.MouseSensitivity * 3), 1, 4);
			}
		}

		const changedConnector = clientSettings.Changed as RBXScriptSignal;
		const sensitivityChanged = changedConnector.Connect(onGameSettingChanged);

		const connection = RunService.RenderStepped.Connect(() => {
			if(UserInputService.GetFocusedTextBox()) {
				cam.CFrame = location;
				return
			}

			const direction = getVectorDirection();
			if ((direction.Magnitude === direction.Magnitude && !isMoving) && direction.Magnitude > 0) {
				startedMovementDt = tick();
				isMoving = true;
				speed = defaultSpeed;
			} else if ((isMoving && !(direction.Magnitude === direction.Magnitude)) || direction.Magnitude === 0) {
				isMoving = false;
				speed = defaultSpeed;
			}

			const dt = isMoving && tick() - startedMovementDt;
			if (dt) {
				speed = defaultSpeed * (1 + (dt / 3));
			}

			const speedMultiplier = userInputService.IsKeyDown(Enum.KeyCode.LeftShift) ? 0.2 : speed
			location = location.mul(new CFrame(direction.mul(speedMultiplier)));

			// Check if the camera is within the bounds, if not then clamp
			// the camera to the bounds.
			if(boundsCenter && boundsSize) {
				const position = location.Position;

				// Check if the position is within the bounds
				const topLeft = new Vector3(boundsCenter.X - boundsSize, boundsCenter.Y, boundsCenter.Z + boundsSize);
				const bottomRight = new Vector3(boundsCenter.X + boundsSize, boundsCenter.Y, boundsCenter.Z - boundsSize);

				// // Clamp the camera to the bounds
				const clampedPosition = new Vector3(
					math.clamp(position.X, topLeft.X, bottomRight.X),
					math.clamp(position.Y, boundsCenter.Y + 1, 400),
					math.clamp(position.Z, bottomRight.Z, topLeft.Z)
				)

				// Update only the position of the camera, deconstruct the CFrame
				const [ x, y, z, R00, R01, R02, R10, R11, R12, R20, R21, R22 ] = location.GetComponents()
				location = new CFrame(clampedPosition.X, clampedPosition.Y, clampedPosition.Z, R00, R01, R02, R10, R11, R12, R20, R21, R22);
			}

			cam.CFrame = location;
		})
		
		cam.CFrame = location;

		connections.push(inputChanged);
		connections.push(wheelForward);
		connections.push(wheelBackward);
		connections.push(sensitivityChanged);
		connections.push(connection);
		
	}
}