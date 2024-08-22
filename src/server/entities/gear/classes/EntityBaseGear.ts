import { BaseHumanoidEntity } from "server/entities/humanoid/BaseHumanoidEntity";
import { Data } from "shared/types/Data";

export abstract class EntityBaseGear {
    public abstract humanoid : BaseHumanoidEntity;
    public abstract add(variant : Data.GearVariations) : void;
}