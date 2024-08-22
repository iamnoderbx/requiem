import Roact from "@rbxts/roact";
import { SkillTreeHolderComponent, SkillTreeNodeComponent } from "client/interfaces/components/utilities/skill.tree.component";

export default function TearsSkillComponents(props: {tab : number, popup : number}): Roact.Element {
    const tearsTab = props.tab;
    const popup = props.popup;

    return (<></>)
    // return (<>
    //     <SkillTreeHolderComponent visible={tearsTab === 0} animate={tearsTab === 0 && popup === 3}>
    //         <SkillTreeNodeComponent position={UDim2.fromScale(0.496, 0.864)} id={0} unlocks={[1]} info={["Maria's Cries I", "Begin your journey in Maria, and unlock the ability to use Rare Enchantments from Wall Maria."]}/>
    //         <SkillTreeNodeComponent position={UDim2.fromScale(0.496, 0.594)} id={1} unlocks={[2, 5]} info={["Maria's Cries II", "Continue your journey in Maria, and unlock the ability to use Legendary Enchantments from Wall Maria."]}/>
    //         <SkillTreeNodeComponent position={UDim2.fromScale(0.496, 0.336)} id={2} unlocks={[3]} info={["Maria's Cries III", "Continue your journey in Maria, and unlock the ability to use Mythic Enchantments from Wall Maria."]}/>

    //         <SkillTreeNodeComponent position={UDim2.fromScale(0.3, 0.336)} id={5} unlocks={[]} info={["???", "An unknown perk."]}/>

    //         <SkillTreeNodeComponent position={UDim2.fromScale(0.496, 0.093)} id={3} info={["Mastery of Maria", "Finalize your journey in Maria, and unlock all Maria based prerequisites."]}/>
    //     </SkillTreeHolderComponent>

    //     <SkillTreeHolderComponent visible={tearsTab === 1} animate={tearsTab === 1 && popup === 3}>
    //         <SkillTreeNodeComponent position={UDim2.fromScale(0.496, 0.864)} id={0} unlocks={[1]} info={["Rose's Cries I", "Begin your journey in Rose, and unlock the ability to use Rare Enchantments from Wall Rose."]}/>
    //         <SkillTreeNodeComponent position={UDim2.fromScale(0.496, 0.594)} id={1} unlocks={[2, 5, 6]} info={["Rose's Cries II", "Continue your journey in Rose, and unlock the ability to use Legendary Enchantments from Wall Rose."]}/>
    //         <SkillTreeNodeComponent position={UDim2.fromScale(0.496, 0.336)} id={2} unlocks={[3]} info={["Rose's Cries III", "Continue your journey in Rose, and unlock the ability to use Mythic Enchantments from Wall Rose."]}/>

    //         <SkillTreeNodeComponent position={UDim2.fromScale(0.692, 0.336)} id={5} unlocks={[]} info={["???", "An unknown perk."]}/>
    //         <SkillTreeNodeComponent position={UDim2.fromScale(0.3, 0.336)} id={6} unlocks={[]} info={["???", "An unknown perk."]}/>

    //         <SkillTreeNodeComponent position={UDim2.fromScale(0.496, 0.093)} id={3} info={["Mastery of Rose", "Finalize your journey in Rose, and unlock all Rose based prerequisites."]}/>
    //     </SkillTreeHolderComponent>

    //     <SkillTreeHolderComponent visible={tearsTab === 2} animate={tearsTab === 2 && popup === 3}>
    //     <SkillTreeNodeComponent position={UDim2.fromScale(0.496, 0.864)} id={0} unlocks={[1]} info={["Sina's Cries I", "Begin your journey in Sina, and unlock the ability to use Rare Enchantments from Wall Sina."]}/>
    //         <SkillTreeNodeComponent position={UDim2.fromScale(0.496, 0.594)} id={1} unlocks={[2, 5, 6]} info={["Sina's Cries II", "Continue your journey in Sina, and unlock the ability to use Legendary Enchantments from Wall Sina."]}/>
    //         <SkillTreeNodeComponent position={UDim2.fromScale(0.496, 0.336)} id={2} unlocks={[3]} info={["Sina's Cries III", "Continue your journey in Sina, and unlock the ability to use Mythic Enchantments from Wall Sina."]}/>

    //         <SkillTreeNodeComponent position={UDim2.fromScale(0.692, 0.336)} id={5} unlocks={[7, 8]} info={["???", "An unknown perk."]}/>
    //         <SkillTreeNodeComponent position={UDim2.fromScale(0.888, 0.336 - 0.15)} id={7} unlocks={[]} info={["???", "An unknown perk."]}/>
    //         <SkillTreeNodeComponent position={UDim2.fromScale(0.888, 0.336 + 0.15)} id={8} unlocks={[]} info={["???", "An unknown perk."]}/>

    //         <SkillTreeNodeComponent position={UDim2.fromScale(0.3, 0.336)} id={6} unlocks={[]} info={["???", "An unknown perk."]}/>

    //         <SkillTreeNodeComponent position={UDim2.fromScale(0.496, 0.093)} id={3} info={["Mastery of Sina", "Finalize your journey in Sina, and unlock all Sina based prerequisites."]}/>
    //     </SkillTreeHolderComponent>

    //     <SkillTreeHolderComponent visible={tearsTab === 3} animate={tearsTab === 3 && popup === 3}>
    //         <SkillTreeNodeComponent position={UDim2.fromScale(0.496, 0.864)} id={0} unlocks={[1]}/>
    //         <SkillTreeNodeComponent position={UDim2.fromScale(0.496, 0.594)} id={1} unlocks={[2, 5, 6]}/>
    //         <SkillTreeNodeComponent position={UDim2.fromScale(0.496, 0.336)} id={2} unlocks={[3]}/>

    //         <SkillTreeNodeComponent position={UDim2.fromScale(0.692, 0.336)} id={5} unlocks={[7, 8, 9]}/>
    //         <SkillTreeNodeComponent position={UDim2.fromScale(0.888, 0.336 - 0.25)} id={7} unlocks={[]}/>
    //         <SkillTreeNodeComponent position={UDim2.fromScale(0.888, 0.336)} id={9} unlocks={[]}/>
    //         <SkillTreeNodeComponent position={UDim2.fromScale(0.888, 0.336 + 0.25)} id={8} unlocks={[10]}/>
    //         <SkillTreeNodeComponent position={UDim2.fromScale(0.888 - 0.15, 0.336 + 0.35)} id={10} unlocks={[]}/>

    //         <SkillTreeNodeComponent position={UDim2.fromScale(0.3, 0.336)} id={6} unlocks={[11]}/>
    //         <SkillTreeNodeComponent position={UDim2.fromScale(0.3 - 0.196, 0.336)} id={11} unlocks={[]}/>

    //         <SkillTreeNodeComponent position={UDim2.fromScale(0.496, 0.093)} id={3}/>
    //     </SkillTreeHolderComponent>
    // </>)
}