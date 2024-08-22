import { useEventListener } from "@rbxts/pretty-roact-hooks";
import Roact from "@rbxts/roact";
import { useBinding, useEffect, useState } from "@rbxts/roact-hooked";
import { RunService, Workspace } from "@rbxts/services";
import CompassComponent, { CreateCompassDirectionFrame, CreateCompassNodeFrame } from "../components/compass/compass.component";
import { useStateSelector } from "../management/InterfaceSelector";
import { ClientHorseSubscription, ClientPlotSubscription, PlotsSubscription } from "client/entities/player/ClientPlayerEntity";
import { Animals } from "shared/Animals";
import { Memory } from "shared/utilities/memory.utilities";
import { Plots } from "shared/Plots";
import { States } from "client/entities/player/ClientPlayerStates";

const NORTH = Vector3.xAxis;
const SOUTH = NORTH.mul(-1);

const EAST = Vector3.zAxis;
const WEST = EAST.mul(-1);

const NORTH_EAST = NORTH.add(EAST).Unit;
const NORTH_WEST = NORTH.add(WEST).Unit;
const SOUTH_EAST = SOUTH.add(EAST).Unit;
const SOUTH_WEST = SOUTH.add(WEST).Unit;

export default function CompassRoute() : Roact.Element {
    const [ degree, setDegree ] = useState(0);
    const [ rerender, setRerender ] = useState(0);
    const [ shouldRender, setShouldRender ] = useState(false);

    const ref = Roact.createRef<Frame>();

    const isHidden = useStateSelector(States.States.subscription("hide_compass"), (state) => {
        return state.get();
    })

    const rotationToFaceInDirection = (camera: Camera, direction: Vector3): number => {
        const cameraRotation = new CFrame(camera.CFrame.Position, camera.CFrame.Position.add(new Vector3(camera.CFrame.LookVector.X, 0, camera.CFrame.LookVector.Z)));
        const relativeDirection = cameraRotation.VectorToObjectSpace(direction);
        const horizontalDirection = new Vector3(relativeDirection.X, 0, relativeDirection.Z); // Project onto XZ plane
        const angle = math.atan2(horizontalDirection.X, -horizontalDirection.Z);
        return angle;
    }

    useEventListener(RunService.RenderStepped, () => {
        if(isHidden) return;
        
        // Compass logic
        const camera = Workspace.CurrentCamera!
        const rotation = rotationToFaceInDirection(camera, NORTH)
        
        setDegree(math.deg(rotation))
        setRerender(rerender + 1)
    })

    useEffect(() => {
        if(!ref.getValue()) return;
        if(isHidden) return;

        const camera = Workspace.CurrentCamera!

        const fieldOfView = 120;
        
        const northAngle = (degree / fieldOfView) + 0.5
        const southAngle = (math.deg(rotationToFaceInDirection(camera, SOUTH)) / fieldOfView) + 0.5
        const eastAngle = (math.deg(rotationToFaceInDirection(camera, EAST)) / fieldOfView) + 0.5
        const westAngle = (math.deg(rotationToFaceInDirection(camera, WEST)) / fieldOfView) + 0.5

        type NodeFrame = {angle : number, text : string, icon?: string, color?: Color3}
        const additionalAngles : NodeFrame[] = []

        const plots = Memory.getSubscription<{id : number, owner : number}[]>(ClientPlotSubscription).get();
        plots?.forEach((plot) => {
            const data = Plots.getDataFromId(plot.id);
            if(!data) return;

            const position = data[Plots.Key.POSITION];
            const plotDirection = (position.sub(camera.CFrame.Position)).Unit;

            const angle = rotationToFaceInDirection(camera, plotDirection);
            const relativeDegree = (math.deg(angle) / fieldOfView) + 0.5

            additionalAngles.push({
                angle: relativeDegree,
                text: "P", icon: "rbxassetid://11419707157", color: Color3.fromRGB(28, 112, 186)
            })
        });

        //const northEastAngle = (math.deg(rotationToFaceInDirection(camera, NORTH_EAST)) / 120) + 0.5

        const getFrame = (name: string, isNodeFrame?: boolean, node?: NodeFrame) => {
            if(!ref.getValue()!.FindFirstChild(name)) {
                const newFrame = (isNodeFrame && node) ? CreateCompassNodeFrame(name, node) : CreateCompassDirectionFrame(name)
                newFrame.Parent = ref.getValue()!
            }

            return ref.getValue()!.FindFirstChild(name) as CanvasGroup;
        }

        const getTickFrame = (name: string) => {
            if(!ref.getValue()!.FindFirstChild(name)) {
                const newFrame = new Instance("Frame")
                newFrame.Name = name
                newFrame.AnchorPoint = new Vector2(0.5, 0.5)
                newFrame.BackgroundColor3 = Color3.fromRGB(255, 255, 255)
                newFrame.BackgroundTransparency = 0
                newFrame.BorderSizePixel = 0
                newFrame.Position = UDim2.fromScale(0.5, 0)
                newFrame.Size = new UDim2(0, 1, 0.4, 0)
                newFrame.ZIndex = 0;
                newFrame.Parent = ref.getValue()!

                const label = new Instance("TextLabel")
                label.Name = "Label"
                label.AnchorPoint = new Vector2(0.5, 0)
                label.BackgroundTransparency = 1
                label.Position = new UDim2(0.5, 0, 1.25, 0)
                label.Text = tostring(tonumber(name)! + 180);
                label.TextColor3 = Color3.fromRGB(255, 255, 255)
                label.TextScaled = true
                label.Size = new UDim2(0, 50, 0.7, 0)

                label.FontFace = new Font(
                    "rbxasset://fonts/families/SourceSansPro.json",
                    Enum.FontWeight.Bold,
                    Enum.FontStyle.Normal
                )

                label.Parent = newFrame
            }

            return ref.getValue()!.FindFirstChild(name) as Frame;
        }

        // print("Degree: ", angle, frame)
        const northFrame = getFrame("N")
        northFrame.Position = new UDim2(northAngle, 0, 0.5, 0)
        northFrame.GroupTransparency = math.abs(northAngle - 0.5) * 2;;

        const southFrame = getFrame("S")
        southFrame.Position = new UDim2(southAngle, 0, 0.5, 0)
        southFrame.GroupTransparency = math.abs(southAngle - 0.5) * 2;

        const eastFrame = getFrame("E")
        eastFrame.Position = new UDim2(eastAngle, 0, 0.5, 0)
        eastFrame.GroupTransparency = math.abs(eastAngle - 0.5) * 2;

        const westFrame = getFrame("W")
        westFrame.Position = new UDim2(westAngle, 0, 0.5, 0)
        westFrame.GroupTransparency = math.abs(westAngle - 0.5) * 2;

        additionalAngles.forEach((angle) => {
            const tickFrame = getFrame(tostring(angle.text), true, angle);
            tickFrame.Position = new UDim2(angle.angle, 0, 0.5, 0)
            tickFrame.GroupTransparency = math.abs(angle.angle - 0.5) * 2;
        })

        for (let degree = -180; degree < 180; degree += 15) {
            if (math.abs(degree) % 90 === 0) continue;

            const lookVector = new CFrame().mul(CFrame.Angles(0, math.rad(degree), 0)).LookVector;
            const angle = rotationToFaceInDirection(camera, lookVector);

            const relativeDegree = (math.deg(angle) / fieldOfView) + 0.5

            const tickFrameName = tostring(degree);
            const tickFrame = getTickFrame(tickFrameName);

            tickFrame.Position = new UDim2(relativeDegree, 0, 0.4, 0);

            // Set the transparency of the frame based on how far from the center it is
            tickFrame.BackgroundTransparency = math.abs(relativeDegree - 0.5) * 2;
            const label = tickFrame.FindFirstChild("Label") as TextLabel;
            label.TextTransparency = math.abs(relativeDegree - 0.5) * 2; //(degree / 15) % 2 === 0 ? 1 : math.abs(relativeDegree - 0.5) * 2;
        }

    }, [ degree, ref ])

    return <CompassComponent ref={ref} Visible={!isHidden} />
}