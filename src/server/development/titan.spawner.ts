import { Players, Workspace } from "@rbxts/services";
import { BaseTitanEntity } from "server/entities/titan/BaseTitanEntity";
import { Controller } from "shared/utilities/decorators/ServiceControllers";

@Controller()
export default class TitanSpawner {
    private debounces : Map<Player, boolean> = new Map()

    public initialize() {
        const part = new Instance("Part")
        part.Size = new Vector3(2, 2, 2)
        part.Color = new Color3(1, 0, 0)
        part.Anchored = true
        part.Position = new Vector3(0, 3, 10)
        part.Parent = Workspace

        part.Touched.Connect((touchingPart) => {
            const player = Players.GetPlayerFromCharacter(touchingPart.Parent)
            if(!player) return

            if(this.debounces.has(player)) return

            this.debounces.set(player, true)

            const titan = new BaseTitanEntity()
            titan.isInitialized.then(() => {
                titan.spawn(new CFrame(0, 0, -200).mul(CFrame.Angles(0, math.rad(180), 0)))
            })

            task.wait(2)

            this.debounces.delete(player)
        })
    }
} 