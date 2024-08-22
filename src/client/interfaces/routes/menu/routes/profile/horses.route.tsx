import { useState, withHooks } from "@rbxts/roact-hooked";
import { BaseEntity } from "client/entities/BaseEntity";
import { ClientHorseSubscription } from "client/entities/player/ClientPlayerEntity";

import HorseListComponent from "client/interfaces/components/menu/profile/horse.components";
import PopupComponent, { PopupListConstraints } from "client/interfaces/components/popups/popup.component";
import SmallPopupComponent from "client/interfaces/components/popups/small.popup.component";
import ButtonListComponents, { ButtonItemComponent } from "client/interfaces/components/progress/buttons.component";
import ProgressBarComponent from "client/interfaces/components/progress/progress.bar.component";

import SubPageHeaderComponent, { SubPageCloseButton } from "client/interfaces/components/submenus/header.submenu.component";
import ContainerFrameComponent, { SubPageFrameComponent, SubPageScrollComponent } from "client/interfaces/components/utilities/frame.component";
import TransparencyGroup, { useTransparencyGroup } from "client/interfaces/components/utilities/transparency.group";
import { useStateSelector } from "client/interfaces/management/InterfaceSelector";
import Roact from "client/interfaces/management/vendors/Roact";
import { Toasts } from "client/interfaces/routes/toasts.route";
import { Animals } from "shared/Animals";
import { Enchantment } from "shared/types/EnchantmentTypes";
import { Memory } from "shared/utilities/memory.utilities";

let BUTTON_LAST_PRESSED = tick();

export const EnchantmentUiColors : {[K in Enchantment.Rarity] : [Color3, Color3, Color3]} = {
    // Glow, Gradient, Content
    [Enchantment.Rarity.Common]: [Color3.fromRGB(68, 68, 68), Color3.fromRGB(255, 255, 255), Color3.fromRGB(211, 211, 211)],
    [Enchantment.Rarity.Uncommon]: [Color3.fromRGB(45, 68, 45), Color3.fromRGB(126, 255, 124), Color3.fromRGB(123, 211, 122)],
    [Enchantment.Rarity.Rare]: [Color3.fromRGB(47, 52, 68), Color3.fromRGB(124, 165, 255), Color3.fromRGB(122, 143, 211)],
    [Enchantment.Rarity.Epic]: [Color3.fromRGB(62, 45, 68), Color3.fromRGB(244, 124, 255), Color3.fromRGB(211, 122, 211)],
    [Enchantment.Rarity.Legendary]: [Color3.fromRGB(129, 80, 25), Color3.fromRGB(255, 164, 53), Color3.fromRGB(211, 172, 118)],
    [Enchantment.Rarity.Mythic]: [Color3.fromRGB(129, 48, 48), Color3.fromRGB(255, 140, 140), Color3.fromRGB(211, 108, 108)],
};

const HorsesRoute = withHooks((props: { Visible: boolean, Closed: () => void }) => {
    const [ selected, setSelected ] = useState<Animals.Horse>();

    // useTransparencyGroup is a custom hook that returns a transparency binding and its settings.
    const [ transparency, settings ] = useTransparencyGroup({
        visible: props.Visible, tween: new TweenInfo(0.4),
        delay: props.Visible ? 0.1 : undefined
    });

    // A selector that returns the player's enchantments.
    const horses = useStateSelector(Memory.getSubscription<Animals.Horse[]>(ClientHorseSubscription), (state) => {
        return state.get();
    });

    return <ContainerFrameComponent>
        <PopupComponent Visible={selected ? true : false} Color={Color3.fromRGB(68, 68, 68)}>
            <SmallPopupComponent 
                Header={"Horse Settings"} 
                Body={"Your horse " + (selected?.name ?? "Unknown") + " and it's respective statistics."}
                Visible={selected ? true : false}
                Closed={() => setSelected(undefined)}
                Color={Color3.fromRGB(255, 255, 255)}
            >
                <PopupListConstraints Padding={-0.01} />
                <ProgressBarComponent Header="Horse Run Speed" Body={(selected?.statistics[Animals.Statistics.RunSpeed] ?? "50") +  "/100"} Value={(selected?.statistics[Animals.Statistics.RunSpeed] ?? 50) / 100} Animate={selected ? true : false} Color={Color3.fromRGB(211, 211, 211)}/>
                <ProgressBarComponent Header="Horse Turn Speed" Body={(selected?.statistics[Animals.Statistics.TurnSpeed] ?? "50") +  "/100"} Value={(selected?.statistics[Animals.Statistics.TurnSpeed] ?? 50) / 100} Animate={selected ? true : false} Color={Color3.fromRGB(211, 211, 211)}/>
                <ProgressBarComponent Header="Horse Jump Power" Body={(selected?.statistics[Animals.Statistics.JumpPower] ?? "50") +  "/100"} Value={(selected?.statistics[Animals.Statistics.JumpPower] ?? 50) / 100} Animate={selected ? true : false} Color={Color3.fromRGB(211, 211, 211)}/>
                <ProgressBarComponent Header="Horse Stamina" Body={(selected?.statistics[Animals.Statistics.Stamina] ?? "50") +  "/100"} Value={(selected?.statistics[Animals.Statistics.Stamina] ?? 50) / 100} Animate={selected ? true : false} Color={Color3.fromRGB(211, 211, 211)}/>
                <ProgressBarComponent Header="Horse Health" Body={(selected?.statistics[Animals.Statistics.Health] ?? "50") +  "/100"} Value={(selected?.statistics[Animals.Statistics.Health] ?? 50) / 100} Animate={selected ? true : false} Color={Color3.fromRGB(211, 211, 211)}/>
            
                <ButtonListComponents>
                    <ButtonItemComponent Text="Delete" Color={Color3.fromRGB(255, 85, 85)} Clicked={() => {}} />
                    <ButtonItemComponent Text="Rename" Color={Color3.fromRGB(255, 255, 255)} Clicked={() => {}} />
                    <ButtonItemComponent Text={selected?.equipped ? "Unequip" : "Equip"} Color={Color3.fromRGB(255, 255, 255)} Clicked={(label : TextButton) => {
                        if(tick() - BUTTON_LAST_PRESSED < 3) return Toasts.info("Easy there partner! You're clicking too fast.")
                        BUTTON_LAST_PRESSED = tick()

                        BaseEntity.resolveClientEntity().then((client) => {
                            client.getHorseService().equip(selected?.id ?? -1)
                            label.Text = selected?.equipped ? "Equip" : "Unequip"
                            selected!.equipped = !selected!.equipped
                        })
                    }} Inverse={true} Bold={true}/>
                </ButtonListComponents>
            </SmallPopupComponent>
        </PopupComponent>
        
        <TransparencyGroup visible={props.Visible} settings={settings}>
            <SubPageFrameComponent>
                <SubPageHeaderComponent title="Horses" description="Your loyal companions and their statistics." image="rbxassetid://11419717444">
                    <SubPageCloseButton Clicked={props.Closed}></SubPageCloseButton>
                </SubPageHeaderComponent>

                <SubPageScrollComponent>
                    {horses?.map((horse) => {
                       return <HorseListComponent horse={horse} Clicked={() => setSelected(horse)} />
                    })}
                </SubPageScrollComponent>
            </SubPageFrameComponent>
        </TransparencyGroup>
    </ContainerFrameComponent>
})

export default HorsesRoute;