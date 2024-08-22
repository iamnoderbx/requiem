import { useState, withHooks } from "@rbxts/roact-hooked";
import { ClientEnchantmentSubscription } from "client/entities/player/ClientPlayerEntity";
import { ImageListItemComponent } from "client/interfaces/components/lists/list.container.component";
import PopupHolderComponent, { PopupListConstraints } from "client/interfaces/components/popups/popup.component";
import SmallPopupComponent from "client/interfaces/components/popups/small.popup.component";
import DescriptionComponent from "client/interfaces/components/progress/description.component";
import ProgressBarComponent from "client/interfaces/components/progress/progress.bar.component";
import ProgressChunksComponent from "client/interfaces/components/progress/progress.chunks.component";
import SubPageHeaderComponent, { SubPageCloseButton } from "client/interfaces/components/submenus/header.submenu.component";
import ContainerFrameComponent, { SubPageFrameComponent, SubPageScrollComponent } from "client/interfaces/components/utilities/frame.component";
import TransparencyGroup, { useTransparencyGroup } from "client/interfaces/components/utilities/transparency.group";
import { useStateSelector } from "client/interfaces/management/InterfaceSelector";
import Roact from "client/interfaces/management/vendors/Roact";
import { EnchantmentNames, EnchantmentUtilities } from "shared/Enchantments";
import { Icons } from "shared/Icons";
import { Enchantment } from "shared/types/EnchantmentTypes";
import { Memory } from "shared/utilities/memory.utilities";

export const EnchantmentUiColors : {[K in Enchantment.Rarity] : [Color3, Color3, Color3]} = {
    // Glow, Gradient, Content
    [Enchantment.Rarity.Common]: [Color3.fromRGB(68, 68, 68), Color3.fromRGB(255, 255, 255), Color3.fromRGB(211, 211, 211)],
    [Enchantment.Rarity.Uncommon]: [Color3.fromRGB(45, 68, 45), Color3.fromRGB(126, 255, 124), Color3.fromRGB(123, 211, 122)],
    [Enchantment.Rarity.Rare]: [Color3.fromRGB(47, 52, 68), Color3.fromRGB(124, 165, 255), Color3.fromRGB(122, 143, 211)],
    [Enchantment.Rarity.Epic]: [Color3.fromRGB(62, 45, 68), Color3.fromRGB(244, 124, 255), Color3.fromRGB(211, 122, 211)],
    [Enchantment.Rarity.Legendary]: [Color3.fromRGB(129, 80, 25), Color3.fromRGB(255, 164, 53), Color3.fromRGB(211, 172, 118)],
    [Enchantment.Rarity.Mythic]: [Color3.fromRGB(129, 48, 48), Color3.fromRGB(255, 140, 140), Color3.fromRGB(211, 108, 108)],
};

const EnchantmentsRoute = withHooks((props: { Visible: boolean, Closed: () => void }) => {
    const [ selected, setSelected ] = useState<Enchantment.Type>();

    // useTransparencyGroup is a custom hook that returns a transparency binding and its settings.
    const [ transparency, settings ] = useTransparencyGroup({
        visible: props.Visible, tween: new TweenInfo(0.4),
        delay: props.Visible ? 0.1 : undefined
    });

    // A selector that returns the player's enchantments.
    const enchantments = useStateSelector(Memory.getSubscription<Enchantment.Type[]>(ClientEnchantmentSubscription), (state) => {
        return state;
    });

    const selectedEnchantmentRarity = string.lower((selected ? EnchantmentUtilities.getEnchantmentRarity(selected[Enchantment.Key.Rarity]) : "Unknown")!);
    const selectedEnchantmentWall = (selected ? EnchantmentUtilities.getEnchantmentWall(selected[Enchantment.Key.Wall]) : "Unknown");
    
    const selectedGlowColor = EnchantmentUiColors[selected ? selected[Enchantment.Key.Rarity] : Enchantment.Rarity.Common][0];
    const selectedGradientColor = EnchantmentUiColors[selected ? selected[Enchantment.Key.Rarity] : Enchantment.Rarity.Common][1];
    const selectedContentColor = EnchantmentUiColors[selected ? selected[Enchantment.Key.Rarity] : Enchantment.Rarity.Common][2];

    return <ContainerFrameComponent>
        <PopupHolderComponent Visible={selected ? true : false} Color={selectedGlowColor}>
            <SmallPopupComponent 
                Header={(selected ? selected[Enchantment.Key.Name] : "Unknown") + " Enchantment"} 
                Body={"A " + selectedEnchantmentRarity + " enchantment from Wall " + selectedEnchantmentWall}
                Visible={selected ? true : false}
                Closed={() => setSelected(undefined)}
                Color={selectedGradientColor}
            >
                <PopupListConstraints />
                <ProgressBarComponent Header="Enchantment Mastery" Body={"60/100"} Value={60 / 100} Animate={selected ? true : false} Color={selectedContentColor}/>
                <ProgressChunksComponent Header="Enchantment Tier" Value={1} Chunks={3} Animate={selected ? true : false} Color={selectedContentColor} />
                <DescriptionComponent Header="Enchantment Details" Body={selected ? selected[Enchantment.Key.Description] : "Unavailable."} />
            </SmallPopupComponent>
        </PopupHolderComponent>

        <TransparencyGroup visible={props.Visible} settings={settings}>
            <SubPageFrameComponent>
                <SubPageHeaderComponent title="Enchantments" description="Your enchantments alongside their information." image="rbxassetid://12967618029">
                    <SubPageCloseButton Clicked={props.Closed}></SubPageCloseButton>
                </SubPageHeaderComponent>

                <SubPageScrollComponent>
                    {enchantments.get()?.map((enchantment) => {
                        return <ImageListItemComponent Text={enchantment[Enchantment.Key.Name]} Description={
                            EnchantmentUtilities.getEnchantmentRarity(enchantment[Enchantment.Key.Rarity]) + " Enchantment" ?? "Unknown Rarity"
                        } Image={(Icons.Enchantments[enchantment[Enchantment.Key.Name] as EnchantmentNames]) ?? "rbxassetid://11432859220"} Clicked={() => setSelected(enchantment)} />
                    })}
                </SubPageScrollComponent>
            </SubPageFrameComponent>
        </TransparencyGroup>
    </ContainerFrameComponent>
})

export default EnchantmentsRoute;