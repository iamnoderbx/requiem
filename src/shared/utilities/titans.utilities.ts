import { ReplicatedStorage } from "@rbxts/services";
import { Requiem } from "shared/Requiem";

export namespace Titans {
    export enum Types {
        DEFAULT,
    }

    const scales : Record<Types, NumberRange> = {
        [Types.DEFAULT] : new NumberRange(8, 17)
    }

    const assets = Requiem.Assets;
    
    export function Model(titanType : Types) {
        let range = scales[titanType];

        const scale = math.random(range.Min * 100, range.Max * 100) / 100;

        const selectables = assets.titans.GetChildren();
        let model = selectables[math.random(1, selectables.size()) - 1].Clone() as Model;
        model = model.Clone() 

        model.ScaleTo(scale)

        return { model, scale }
    }
}