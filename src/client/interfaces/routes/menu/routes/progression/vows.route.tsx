import { useState, withHooks } from "@rbxts/roact-hooked";
import VowHolderComponent from "client/interfaces/components/menu/progression/components/vow.holder.component";
import ProgressBarComponent, { ProgressDescriptionComponent } from "client/interfaces/components/progress/progress.bar.component";
import ProgressChunksComponent, { ProgressChunkUpgradeLockedComponent } from "client/interfaces/components/progress/progress.chunks.component";
import SubPageHeaderComponent, { SubPageCloseButton } from "client/interfaces/components/submenus/header.submenu.component";
import ContainerFrameComponent, { SubPageFrameComponent, SubPageScrollComponent } from "client/interfaces/components/utilities/frame.component";
import ListHeaderComponent from "client/interfaces/components/utilities/list.header.component";
import TransparencyGroup, { useTransparencyGroup } from "client/interfaces/components/utilities/transparency.group";
import Roact from "client/interfaces/management/vendors/Roact";
import PopupHolderComponent, { PopupListConstraints } from "client/interfaces/components/popups/popup.component";
import SmallPopupComponent from "client/interfaces/components/popups/small.popup.component";
import DescriptionComponent from "client/interfaces/components/progress/description.component";
import { Enchantment } from "shared/types/EnchantmentTypes";

type VowPopupInformation = {
    Color: string,
    Header: string,
    Body?: string[][]
};

export const VowCategoryUiColors : {[key : string] : [Color3, Color3, Color3]} = {
    // Glow, Gradient, Content
    Green: [Color3.fromRGB(45, 68, 45), Color3.fromRGB(126, 255, 124), Color3.fromRGB(123, 211, 122)],
    Blue: [Color3.fromRGB(47, 52, 68), Color3.fromRGB(124, 165, 255), Color3.fromRGB(122, 143, 211)],
    Pink: [Color3.fromRGB(62, 45, 68), Color3.fromRGB(244, 124, 255), Color3.fromRGB(211, 122, 211)],
    Red: [Color3.fromRGB(129, 48, 48), Color3.fromRGB(255, 140, 140), Color3.fromRGB(211, 108, 108)],
};

const VowsOfEldiaRoute = withHooks((props: { Visible: boolean, Closed: () => void }) => {
    // useTransparencyGroup is a custom hook that returns a transparency binding and its settings.
    const [transparency, settings] = useTransparencyGroup({
        visible: props.Visible, tween: new TweenInfo(0.4),
        delay: props.Visible ? 0.1 : undefined
    });

    const [ selected, setSelected ] = useState<VowPopupInformation>();
    const selectedGlowColor = selected ? VowCategoryUiColors[selected.Color][0] : Color3.fromRGB(68, 68, 68);
    const selectedGradientColor = selected ? VowCategoryUiColors[selected.Color][1] : Color3.fromRGB(255, 255, 255);

    return <ContainerFrameComponent>
        <PopupHolderComponent Visible={selected ? true : false} Color={selectedGlowColor}>
            <SmallPopupComponent 
                Header={selected ? selected.Header : "Unknown Vow"} 
                Body={"Information about the " + (selected ? selected.Header : "Unknown")}
                Visible={selected ? true : false}
                Closed={() => setSelected(undefined)}
                Color={selectedGradientColor}
            >
                <PopupListConstraints />

                {selected?.Body?.map((value, index) => {
                    return <DescriptionComponent Header={value[0]} Body={value[1]} />
                })}
            </SmallPopupComponent>
        </PopupHolderComponent>

        <TransparencyGroup visible={props.Visible} settings={settings}>
            <SubPageFrameComponent>
                <SubPageHeaderComponent title="Vows of Eldia" description="Your passive vow progression and information." image="rbxassetid://11963358738">
                    <SubPageCloseButton Clicked={props.Closed}></SubPageCloseButton>
                </SubPageHeaderComponent>

                <SubPageScrollComponent>
                    <ListHeaderComponent Text="Upon reaching level five of any vow, you unlock the subset of vows. As you upgrade a subset vow, the opposing vow will become more limited." />

                    <VowHolderComponent>
                        <ProgressDescriptionComponent
                            Header="Vow of Fortitude"
                            Description="You have not yet unlocked the Vow of Fortitude. Participate in combat in order to level up your fortitude."
                            Transparencies={{ Header: 0.24, Body: 0.49, Description: 0.49 }}
                            Value={0.3} Size={UDim2.fromScale(0.96, 0.219)}
                            Body="Level 3" Animate={props.Visible}
                            Color={Color3.fromRGB(196, 105, 105)}
                        />

                        <ProgressChunkUpgradeLockedComponent
                            Header="Vow of the Penitent"
                            Description="Increase your overall non-projectile damage by a percentage for every progression made."
                            Animate={props.Visible}
                            Chunks={5} Value={0}
                            Color={Color3.fromRGB(196, 105, 105)}
                            Locked={true}
                        />

                        <ProgressChunkUpgradeLockedComponent
                            Header="Vow of the Noble"
                            Description="Increases your overall health by a percentage for every progression made."
                            Animate={props.Visible}
                            Chunks={5} Value={0}
                            Color={Color3.fromRGB(196, 105, 105)}
                            Locked={true}
                        />
                    </VowHolderComponent>

                    <VowHolderComponent>
                        <ProgressDescriptionComponent
                            Header="Vow of Perseverance"
                            Description="You have unlocked the Vow of Perseverance. Continue to participate in straineous tasks in order to level up your perseverance."
                            Transparencies={{ Header: 0.24, Body: 0.49, Description: 0.49 }}
                            Value={0.7} Size={UDim2.fromScale(0.96, 0.219)}
                            Body="Level 6" Animate={props.Visible}
                            Color={Color3.fromRGB(128, 191, 230)}
                        />

                        <ProgressChunkUpgradeLockedComponent
                            Header="Vow of the Unyielding"
                            Description="Increase your resistance to environmental and fatigue damage by a percentage for every progression made."
                            Animate={props.Visible}
                            Chunks={7} Value={3}
                            Color={Color3.fromRGB(128, 191, 230)}
                            Locked={false}
                            Hover="Click here for more information."
                            Clicked={() => setSelected({
                                Color: "Blue", Header: "Vow of the Unyielding", Body: [
                                    ["Vow Description", "The harshness of battle and the weight of survival in a world filled with titans forge the most resilient of souls. By embracing the Path of the Unyielding, a soldier vows to endure through the toughest of times, embodying the essence of perseverance. Increase your resistance to environmental and fatigue damage by a percentage for every progression made, such as weathers, temperatures, food, thirst, and more."],
                                    ["Vow Advantages", "\t• Increases Temperature Reduction Percentage \n\t• Increases Fatigue Reduction Percentage"],
                                ]
                            })}
                        />

                        <ProgressChunkUpgradeLockedComponent
                            Header="Vow of the Marathoner"
                            Description="Increase your overall stamina, movement percentages, gear swiftness, and more for every progression made."
                            Animate={props.Visible}
                            Chunks={4} Value={3}
                            Color={Color3.fromRGB(128, 191, 230)}
                            Locked={false}
                            Hover="Click here for more information."
                            Clicked={() => setSelected({
                                Color: "Blue", Header: "Vow of the Marathoner", Body: [
                                    ["Vow Description", "This path recognizes the enduring spirit of those who confront the long and arduous journey against adversity. It is for the soldiers who believe in sustained effort over quick victory, understanding that the fight against the enemy is a marathon, not a sprint. Increase your overall stamina, movement percentages, gear swiftness, and more for every progression made."],
                                    ["Vow Advantages", "\t• Increases Gear Speed Percentage \n\t• Increases Run Speed Percentage"],
                                ]
                            })}
                        />
                    </VowHolderComponent>

                    <VowHolderComponent>
                        <ProgressDescriptionComponent
                            Header="Vow of Insight"
                            Description="You have not yet unlocked the Vow of Insight. Participate in research and lore in order to level up your insight."
                            Transparencies={{ Header: 0.24, Body: 0.49, Description: 0.49 }}
                            Value={0.2} Size={UDim2.fromScale(0.96, 0.219)}
                            Body="Level 1" Animate={props.Visible}
                            Color={Color3.fromRGB(153, 105, 196)}
                        />

                        <ProgressChunkUpgradeLockedComponent
                            Header="Vow of the Artificer"
                            Description="Increase your overall capabilities in craftsmanship, allowing for an overall percentage of success increase."
                            Animate={props.Visible}
                            Chunks={5} Value={0}
                            Color={Color3.fromRGB(153, 105, 196)}
                            Locked={true}
                        />

                        <ProgressChunkUpgradeLockedComponent
                            Header="Vow of the Illuminator"
                            Description="Increase your overall intelligence, and capability to learn new aspects, such as designing blueprints, learning languages, etc..."
                            Animate={props.Visible}
                            Chunks={5} Value={0}
                            Color={Color3.fromRGB(153, 105, 196)}
                            Locked={true}
                        />
                    </VowHolderComponent>

                    <VowHolderComponent>
                        <ProgressDescriptionComponent
                            Header="Vow of Restoration"
                            Description="You have not yet unlocked the Vow of Restoration. Participate in medical in order to level up your restoration."
                            Transparencies={{ Header: 0.24, Body: 0.49, Description: 0.49 }}
                            Value={0.8} Size={UDim2.fromScale(0.96, 0.219)}
                            Body="Level 2" Animate={props.Visible}
                            Color={Color3.fromRGB(112, 196, 105)}
                        />

                        <ProgressChunkUpgradeLockedComponent
                            Header="Vow of the Caregiver"
                            Description="Increase your in-lore medical procedure knowledge, and medical equipment efficiency and results."
                            Animate={props.Visible}
                            Chunks={5} Value={0}
                            Color={Color3.fromRGB(112, 196, 105)}
                            Locked={true}
                        />

                        <ProgressChunkUpgradeLockedComponent
                            Header="Vow of the Noble"
                            Description="Increase your personal chance of procedure success, when another player heals you, heal more from a self-bandage."
                            Animate={props.Visible}
                            Chunks={5} Value={0}
                            Color={Color3.fromRGB(112, 196, 105)}
                            Locked={true}
                        />
                    </VowHolderComponent>
                </SubPageScrollComponent>
            </SubPageFrameComponent>
        </TransparencyGroup>
    </ContainerFrameComponent>
})

export default VowsOfEldiaRoute;