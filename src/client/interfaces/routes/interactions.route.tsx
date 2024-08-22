import Roact from "@rbxts/roact";
import { useEffect, useRef } from "@rbxts/roact-hooked";
import { GuiService, RunService, TweenService, Workspace } from "@rbxts/services";
import { Requiem } from "shared/Requiem";
import { Assets } from "shared/types/Assets";
import { InteractionStructure } from "shared/utilities/decorators/InteractionDecorators";
import { getTransparencyProperty } from "../components/utilities/transparency.group";

export const InteractionEvent = new Instance("BindableEvent");

export default function InteractionsRoute(): Roact.Element {
    const ref = useRef<Frame>()

    useEffect(() => {
        if(!ref.getValue()) return;

        const holder = Requiem.Assets.other.interaction_holder.Clone()
        holder.Parent = ref.getValue()
        holder.Visible = false

        const frames : Map<BasePart, Assets["other"]["interaction_frame"]> = new Map()

        let updater : RBXScriptConnection | undefined = undefined;
        let tweening : boolean = false

        let cache : Map<Instance, number> = new Map()

        const hide = () => {
            if(holder.Visible === false || tweening) return

            const tween = TweenService.Create(holder.UIScale, new TweenInfo(0.15), { Scale: 0.7 })
            tweening = true

            holder.GetDescendants().forEach((descendant) => {
                const properties = getTransparencyProperty(descendant);
                if(!properties) return;

                properties.forEach(([property, value]) => {
                    const casted = descendant as unknown as Record<string, number>
                    if(!cache.has(descendant)) cache.set(descendant, casted[property])
                    TweenService.Create(descendant, new TweenInfo(0.15), { [property]: 1 }).Play()
                })
            })

            tween.Completed.Connect(() => {
                if(updater) {
                    updater.Disconnect()
                    updater = undefined
                }

                tweening = false

                for(const [, frame] of frames) {
                    frame.Destroy()
                }
    
                frames.clear()
                holder.Visible = false
            })

            tween.Play()
        }

        const show = (part : BasePart, interaction : InteractionStructure, keycode: Enum.KeyCode = Enum.KeyCode.E) => {
            const updateHolderPosition = () => {
                const position = part.Position;
                const camera = Workspace.CurrentCamera!;
                
                const [ inset ] = GuiService.GetGuiInset()
                const [ screenPosition ] = camera.WorldToScreenPoint(position);
                holder.Position = UDim2.fromOffset(screenPosition.X + inset.X, screenPosition.Y + inset.Y)
            }

            if(holder.Visible === false) {
                tweening = false

                holder.Visible = true
                holder.UIScale.Scale = 0.7

                const tween = TweenService.Create(holder.UIScale, new TweenInfo(0.15), { Scale: 1 })
                tween.Play()
            }
            
            if(!frames.has(part)) {
                const frame = Requiem.Assets.other.interaction_frame.Clone()
                frame.label.header.Text = interaction.name
                frame.label.body.Text = string.format(interaction.description ?? "Unknown", keycode.Name)
                frame.keybind.button.Text = keycode.Name
                frame.Parent = holder

                holder.GetDescendants().forEach((descendant) => {
                    const properties = getTransparencyProperty(descendant);
                    if(!properties) return;
    
                    properties.forEach(([property]) => {
                        const casted = descendant as unknown as Record<string, number>
                        if(!cache.has(descendant)) cache.set(descendant, casted[property])

                        const value = casted[property]
                        casted[property] = 1
                        TweenService.Create(descendant, new TweenInfo(0.15), { [property]: value }).Play()
                    })
                })
    

                frames.set(part, frame)
            }

            updateHolderPosition()
            if(updater) updater.Disconnect()

            updater = RunService.RenderStepped.Connect(() => {
                updateHolderPosition()
            })
        }

        const connection = InteractionEvent.Event.Connect((part? : BasePart, interaction? : InteractionStructure, keycode?: Enum.KeyCode) => {
            if(!part || !interaction) return hide()
            return show(part, interaction, keycode)
        })

        return () => {
            connection.Disconnect()
            holder.Destroy()
        }
    }, [ ref ]);

    return (
        <frame
            AnchorPoint={new Vector2(0.5, 0.5)}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.5, 0.5)}
            Size={UDim2.fromScale(1, 1)}
            Key={"interactions"}
            Ref={ref}
        >
            
        </frame>
    )
}