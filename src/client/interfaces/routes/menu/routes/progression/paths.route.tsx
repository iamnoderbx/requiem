import { useState, withHooks } from "@rbxts/roact-hooked";
import { ProgressDescriptionComponent } from "client/interfaces/components/progress/progress.bar.component";
import SubPageHeaderComponent, { SubPageCloseButton } from "client/interfaces/components/submenus/header.submenu.component";
import SubPageTabHolderComponent, { SubPageTabComponent } from "client/interfaces/components/submenus/tabs.submenu.component";
import ContainerFrameComponent, { SubPageFrameComponent, SubPageScrollComponent } from "client/interfaces/components/utilities/frame.component";
import { SkillTreeHolderComponent, SkillTreeNodeComponent } from "client/interfaces/components/utilities/skill.tree.component";
import TransparencyGroup, { useTransparencyGroup } from "client/interfaces/components/utilities/transparency.group";
import Roact from "client/interfaces/management/vendors/Roact";
import { Enchantment } from "shared/types/EnchantmentTypes";

enum SubmenuPages {
    Maria,
    Rose,
    Sina
}

const PathBlessingRoute = withHooks((props: { Visible: boolean, Closed: () => void }) => {
    const [selected, setSelected] = useState<SubmenuPages>(SubmenuPages.Maria);

    // useTransparencyGroup is a custom hook that returns a transparency binding and its settings.
    const [transparency, settings] = useTransparencyGroup({
        visible: props.Visible, tween: new TweenInfo(0.4),
        delay: props.Visible ? 0.1 : undefined
    });

    return <ContainerFrameComponent>
        <TransparencyGroup visible={props.Visible} settings={settings}>
            <SubPageFrameComponent>
                <SubPageHeaderComponent title="Paths and Blessings" description="Your path and blessing skill trees and information." image="rbxassetid://12974249788">
                    <SubPageCloseButton Clicked={props.Closed}></SubPageCloseButton>
                </SubPageHeaderComponent>

                <SubPageTabHolderComponent>
                    <SubPageTabComponent Header="Blessings of Maria" Clicked={() => setSelected(SubmenuPages.Maria)} />
                    <SubPageTabComponent Header="Blessings of Rose" Clicked={() => setSelected(SubmenuPages.Rose)} />
                    <SubPageTabComponent Header="Blessings of Sina" Clicked={() => setSelected(SubmenuPages.Sina)} />
                </SubPageTabHolderComponent>

                <ProgressDescriptionComponent
                    Body={"70/100"}
                    Description="You have 3 available Blessings of Maria available."
                    Header="Path of Maria Progression"
                    Value={0.7}
                    Visible={props.Visible && selected === SubmenuPages.Maria}
                    Animate={props.Visible && selected === SubmenuPages.Maria}
                />

                <ProgressDescriptionComponent
                    Body={"30/100"}
                    Description="You have 2 available Blessings of Rose available."
                    Header="Path of Rose Progression"
                    Value={0.3}
                    Visible={props.Visible && selected === SubmenuPages.Rose}
                    Animate={props.Visible && selected === SubmenuPages.Rose}
                />

                <ProgressDescriptionComponent
                    Body={"40/100"}
                    Description="You have 5 available Blessings of Sina available."
                    Header="Path of Sina Progression"
                    Value={0.4}
                    Visible={props.Visible && selected === SubmenuPages.Sina}
                    Animate={props.Visible && selected === SubmenuPages.Sina}
                />

                <SkillTreeHolderComponent visible={props.Visible && selected === SubmenuPages.Maria} animate={props.Visible && selected === SubmenuPages.Maria}>
                    <SkillTreeNodeComponent Display="M" Position={UDim2.fromScale(0.5, 1.05)} Id={0} Unlocks={[1, 2, 3]} Info={["Maria's Blessing", "Begin your journey in Maria, unlock progression towards your physical capabilities."]} />

                    <SkillTreeNodeComponent Display="I" Position={UDim2.fromScale(0.3, 0.9)} Id={1} Unlocks={[4]} Info={["Maria's Strength I", "Increases your non-projectile damage amount, your weight limit, and inventory space."]} />
                    <SkillTreeNodeComponent Display="I" Position={UDim2.fromScale(0.7, 0.9)} Id={2} Unlocks={[8]} Info={["Maria's Agility", "Begin your journey in Maria, and unlock the ability to use Rare Enchantments from Wall Maria."]} />
                    <SkillTreeNodeComponent Display="I" Position={UDim2.fromScale(0.5, 0.9)} Id={3} Unlocks={[12]} Info={["Maria's Endurance", "Begin your journey in Maria, and unlock the ability to use Rare Enchantments from Wall Maria."]} />

                    <SkillTreeNodeComponent Display="II" Position={UDim2.fromScale(0.3, 0.75)} Id={4} Unlocks={[5]} Info={["Maria's Strength II", "Increases your non-projectile damage amount, your weight limit, and inventory space."]} />
                    <SkillTreeNodeComponent Display="III" Position={UDim2.fromScale(0.3, 0.6)} Id={5} Unlocks={[6]} Info={["Maria's Strength III", "Increases your non-projectile damage amount, your weight limit, and inventory space."]} />
                    <SkillTreeNodeComponent Display="IV" Position={UDim2.fromScale(0.3, 0.45)} Id={6} Unlocks={[7]} Info={["Maria's Strength IV", "Increases your non-projectile damage amount, your weight limit, and inventory space."]} />
                    <SkillTreeNodeComponent Display="V" Position={UDim2.fromScale(0.3, 0.3)} Id={7} Unlocks={[16]} Info={["Maria's Strength V", "Increases your non-projectile damage amount, your weight limit, and inventory space."]} />

                    <SkillTreeNodeComponent Display="II" Position={UDim2.fromScale(0.7, 0.75)} Id={8} Unlocks={[9]} Info={["Maria's Blessing", "Begin your journey in Maria, and unlock the ability to use Rare Enchantments from Wall Maria."]} />
                    <SkillTreeNodeComponent Display="III" Position={UDim2.fromScale(0.7, 0.6)} Id={9} Unlocks={[10]} Info={["Maria's Blessing", "Begin your journey in Maria, and unlock the ability to use Rare Enchantments from Wall Maria."]} />
                    <SkillTreeNodeComponent Display="IV" Position={UDim2.fromScale(0.7, 0.45)} Id={10} Unlocks={[11]} Info={["Maria's Blessing", "Begin your journey in Maria, and unlock the ability to use Rare Enchantments from Wall Maria."]} />
                    <SkillTreeNodeComponent Display="V" Position={UDim2.fromScale(0.7, 0.3)} Id={11} Unlocks={[16]} Info={["Maria's Blessing", "Begin your journey in Maria, and unlock the ability to use Rare Enchantments from Wall Maria."]} />

                    <SkillTreeNodeComponent Display="II" Position={UDim2.fromScale(0.5, 0.75)} Id={12} Unlocks={[13]} Info={["Maria's Blessing", "Begin your journey in Maria, and unlock the ability to use Rare Enchantments from Wall Maria."]} />
                    <SkillTreeNodeComponent Display="III" Position={UDim2.fromScale(0.5, 0.6)} Id={13} Unlocks={[14]} Info={["Maria's Blessing", "Begin your journey in Maria, and unlock the ability to use Rare Enchantments from Wall Maria."]} />
                    <SkillTreeNodeComponent Display="IV" Position={UDim2.fromScale(0.5, 0.45)} Id={14} Unlocks={[15]} Info={["Maria's Blessing", "Begin your journey in Maria, and unlock the ability to use Rare Enchantments from Wall Maria."]} />
                    <SkillTreeNodeComponent Display="V" Position={UDim2.fromScale(0.5, 0.3)} Id={15} Unlocks={[16]} Info={["Maria's Blessing", "Begin your journey in Maria, and unlock the ability to use Rare Enchantments from Wall Maria."]} />


                    <SkillTreeNodeComponent Display="?" Position={UDim2.fromScale(0.5, 0.15)} Id={16} Unlocks={[17]} Info={["Maria's Blessing", "Begin your journey in Maria, and unlock the ability to use Rare Enchantments from Wall Maria."]} />
                    <SkillTreeNodeComponent Display="?" Position={UDim2.fromScale(0.7, 0.15)} Id={17} Unlocks={[18]} Info={["Maria's Blessing", "Begin your journey in Maria, and unlock the ability to use Rare Enchantments from Wall Maria."]} />
                    <SkillTreeNodeComponent Display="?" Position={UDim2.fromScale(0.9, 0.15)} Id={18} Unlocks={[]} Info={["Maria's Blessing", "Begin your journey in Maria, and unlock the ability to use Rare Enchantments from Wall Maria."]} />
                </SkillTreeHolderComponent>

                <SkillTreeHolderComponent visible={props.Visible && selected === SubmenuPages.Rose} animate={props.Visible && selected === SubmenuPages.Rose}>
                    <SkillTreeNodeComponent Display="R" Position={UDim2.fromScale(0.5, 0.95)} Id={0} Unlocks={[1, 2]} Info={["Maria's Blessing", "Begin your journey in Maria, and unlock the ability to use Rare Enchantments from Wall Maria."]} />

                    <SkillTreeNodeComponent Display="I" Position={UDim2.fromScale(0.35, 0.8)} Id={1} Unlocks={[3]} Info={["Maria's Blessing", "Begin your journey in Maria, and unlock the ability to use Rare Enchantments from Wall Maria."]} />
                    <SkillTreeNodeComponent Display="I" Position={UDim2.fromScale(0.65, 0.8)} Id={2} Unlocks={[7]} Info={["Maria's Blessing", "Begin your journey in Maria, and unlock the ability to use Rare Enchantments from Wall Maria."]} />

                    <SkillTreeNodeComponent Display="II" Position={UDim2.fromScale(0.35, 0.65)} Id={3} Unlocks={[4]} Info={["Maria's Blessing", "Begin your journey in Maria, and unlock the ability to use Rare Enchantments from Wall Maria."]} />
                    <SkillTreeNodeComponent Display="III" Position={UDim2.fromScale(0.25, 0.5)} Id={4} Unlocks={[5]} Info={["Maria's Blessing", "Begin your journey in Maria, and unlock the ability to use Rare Enchantments from Wall Maria."]} />
                    <SkillTreeNodeComponent Display="IV" Position={UDim2.fromScale(0.25, 0.35)} Id={5} Unlocks={[6]} Info={["Maria's Blessing", "Begin your journey in Maria, and unlock the ability to use Rare Enchantments from Wall Maria."]} />
                    <SkillTreeNodeComponent Display="V" Position={UDim2.fromScale(0.35, 0.2)} Id={6} Unlocks={[11]} Info={["Maria's Blessing", "Begin your journey in Maria, and unlock the ability to use Rare Enchantments from Wall Maria."]} />

                    <SkillTreeNodeComponent Display="II" Position={UDim2.fromScale(0.65, 0.65)} Id={7} Unlocks={[8]} Info={["Maria's Blessing", "Begin your journey in Maria, and unlock the ability to use Rare Enchantments from Wall Maria."]} />
                    <SkillTreeNodeComponent Display="III" Position={UDim2.fromScale(0.75, 0.5)} Id={8} Unlocks={[9]} Info={["Maria's Blessing", "Begin your journey in Maria, and unlock the ability to use Rare Enchantments from Wall Maria."]} />
                    <SkillTreeNodeComponent Display="IV" Position={UDim2.fromScale(0.75, 0.35)} Id={9} Unlocks={[10]} Info={["Maria's Blessing", "Begin your journey in Maria, and unlock the ability to use Rare Enchantments from Wall Maria."]} />
                    <SkillTreeNodeComponent Display="V" Position={UDim2.fromScale(0.65, 0.2)} Id={10} Unlocks={[11]} Info={["Maria's Blessing", "Begin your journey in Maria, and unlock the ability to use Rare Enchantments from Wall Maria."]} />

                    <SkillTreeNodeComponent Display="?" Position={UDim2.fromScale(0.5, 0.35)} Id={11} Unlocks={[12]} Info={["Maria's Blessing", "Begin your journey in Maria, and unlock the ability to use Rare Enchantments from Wall Maria."]} />
                    <SkillTreeNodeComponent Display="?" Position={UDim2.fromScale(0.5, 0.5)} Id={12} Unlocks={[13]} Info={["Maria's Blessing", "Begin your journey in Maria, and unlock the ability to use Rare Enchantments from Wall Maria."]} />
                    <SkillTreeNodeComponent Display="?" Position={UDim2.fromScale(0.5, 0.65)} Id={13} Unlocks={[]} Info={["Maria's Blessing", "Begin your journey in Maria, and unlock the ability to use Rare Enchantments from Wall Maria."]} />
                </SkillTreeHolderComponent>

                <SkillTreeHolderComponent visible={props.Visible && selected === SubmenuPages.Sina} animate={props.Visible && selected === SubmenuPages.Sina}>
                    <SkillTreeNodeComponent Display="I" Position={UDim2.fromScale(0.496, 0.864)} Id={0} Unlocks={[1]} Info={["Sina's Cries I", "Begin your journey in Sina, and unlock the ability to use Rare Enchantments from Wall Sina."]} />
                    <SkillTreeNodeComponent Display="II" Position={UDim2.fromScale(0.496, 0.594)} Id={1} Unlocks={[2, 5, 6]} Info={["Sina's Cries II", "Continue your journey in Sina, and unlock the ability to use Legendary Enchantments from Wall Sina."]} />
                    <SkillTreeNodeComponent Display="III" Position={UDim2.fromScale(0.496, 0.336)} Id={2} Unlocks={[3]} Info={["Sina's Cries III", "Continue your journey in Sina, and unlock the ability to use Mythic Enchantments from Wall Sina."]} />

                    <SkillTreeNodeComponent Display="?" Position={UDim2.fromScale(0.692, 0.336)} Id={5} Unlocks={[7, 8]} Info={["???", "An unknown perk."]} />
                    <SkillTreeNodeComponent Display="?" Position={UDim2.fromScale(0.888, 0.336 - 0.15)} Id={7} Unlocks={[]} Info={["???", "An unknown perk."]} />
                    <SkillTreeNodeComponent Display="?" Position={UDim2.fromScale(0.888, 0.336 + 0.15)} Id={8} Unlocks={[]} Info={["???", "An unknown perk."]} />

                    <SkillTreeNodeComponent Display="?" Position={UDim2.fromScale(0.3, 0.336)} Id={6} Unlocks={[]} Info={["???", "An unknown perk."]} />

                    <SkillTreeNodeComponent Display="IV" Position={UDim2.fromScale(0.496, 0.093)} Id={3} Info={["Mastery of Sina", "Finalize your journey in Sina, and unlock all Sina based prerequisites."]} />
                </SkillTreeHolderComponent>
            </SubPageFrameComponent>
        </TransparencyGroup>
    </ContainerFrameComponent>
})

export default PathBlessingRoute;