import Roact from "@rbxts/roact";

import { useMutable, useState, useEffect, withHooks } from "@rbxts/roact-hooked";
import { Lighting, TweenService } from "@rbxts/services";
import { CURRENT_STORE_META, ClientStoreSubscription, ClientStoreTypes, States, StoreInventorySubscription } from "client/entities/player/ClientPlayerStates";
import { MenuHolderComponent } from "client/interfaces/components/menu/holder.component";
import { MenuOverlayInformationComponent } from "client/interfaces/components/menu/information.component";
import MenuPageHolderComponent from "client/interfaces/components/menu/pagination/holder.component";
import SubPageHeaderComponent, { SubPageCloseButton } from "client/interfaces/components/submenus/header.submenu.component";
import ContainerFrameComponent, { BasicTransparencyGroup, SubPageFrameComponent, SubPageScrollComponent } from "client/interfaces/components/utilities/frame.component";
import TransparencyGroup, { useTransparencyGroup } from "client/interfaces/components/utilities/transparency.group";
import { useStateSelector } from "client/interfaces/management/InterfaceSelector";
import { StoreSharedSelectors } from "selectors/StoreSharedSelectors";
import { Memory } from "shared/utilities/memory.utilities";
import { LoadingSubscription } from "../loading.route";
import SubPageTabHolderComponent, { SubPageTabComponent } from "client/interfaces/components/submenus/tabs.submenu.component";
import HorsePurchaseListComponent from "client/interfaces/components/stable/horse.purchase.component";
import { BaseEntity } from "client/entities/BaseEntity";
import { PlayerActions, StableActions } from "shared/utilities/network/Events";
import { ClientStablemenInteractionData } from "client/interactions/types/animals/ClientStablemenInteraction";
import { HorseStallInformation } from "client/world/HorseStableWorldObject";
import { LoadingBubbleEffect } from "client/interfaces/components/utilities/bubble.effect";
import { Table } from "shared/utilities/table.utilities";
import HorseBreedableComponent, { HorseBreedingStallComponent } from "client/interfaces/components/stable/horse.breedable.component";
import { Animals } from "shared/Animals";
import ListHeaderComponent from "client/interfaces/components/utilities/list.header.component";

enum SubmenuPages {
    Store, Breed
}

export const StableCaretakerPage = withHooks((props: { Visible: boolean }) => {
    const [ selected, setSelected ] = useState<SubmenuPages>(SubmenuPages.Store);
    const [ stalls, setStalls ] = useState<HorseStallInformation[]>([]);
    
    const [ forceUpdateNumber, setForceUpdateNumber ] = useState(0);
    const muteable = useMutable<number>(9);

    // useTransparencyGroup is a custom hook that returns a transparency binding and its settings.
    const [ transparency, settings ] = useTransparencyGroup({
        visible: props.Visible, tween: new TweenInfo(0.2),
        delay: undefined
    });

    const stores = useStateSelector(StoreInventorySubscription, StoreSharedSelectors.getWorldStoreInventories, true);
    const store = stores.find((store) => store.id === CURRENT_STORE_META.id);

    useEffect(() => {
        if (!store && props.Visible) LoadingSubscription.set(true);
        else if (LoadingSubscription.get() && props.Visible) LoadingSubscription.set(false);

        muteable.current = muteable.current + 1;

        const stable = ClientStablemenInteractionData.stable;
        if(!stable || !props.Visible || !store) return;

        const thread_id = muteable.current;
        
        const updateHorseStalls = () => {
            // Get all horse stall information.
            const response = stable.getHorseStalls()
            response.forEach((stall) => {
                const female = stall.female
                if(female) {
                    female.isAdult = Animals.isHorseAdult(female.data)
                    female.isOnCooldown = Animals.isHorseOnbreedCooldown(female.data)
                }

                const male = stall.male
                if(male) {
                    male.isAdult = Animals.isHorseAdult(male.data)
                    male.isOnCooldown = Animals.isHorseOnbreedCooldown(male.data)
                }
            })

            const isIdentical = Table.isIdentical(stalls, response);
            if(isIdentical) return;

            LoadingBubbleEffect.CleanupLoadingBubbles();
            setStalls(response);
        }

        const thread = coroutine.create(() => {
            while(props.Visible && muteable.current === thread_id) {
                task.wait(0.2);
                updateHorseStalls();
            }
        })

        coroutine.resume(thread);
    }, [ store, props.Visible, ClientStablemenInteractionData.stable, forceUpdateNumber ])
    LoadingBubbleEffect.CleanupLoadingBubbles();

    return <ContainerFrameComponent Visible={props.Visible}>
        <TransparencyGroup visible={props.Visible} settings={settings}>
            <SubPageFrameComponent Center={true}>
                <SubPageHeaderComponent title="Stablemen" description="Purchase new horses, or breed horses within the stable." image="rbxassetid://12966848044" button="Close">
                    <SubPageCloseButton Clicked={() => {
                        Memory.getSubscription(ClientStoreSubscription).set(ClientStoreTypes.NONE);
                        States.States.set("shopping", false);

                    }} UseCloseButton={true}></SubPageCloseButton>
                </SubPageHeaderComponent>

                <SubPageTabHolderComponent>
                    <SubPageTabComponent Header="Purchase Horses" Clicked={() => setSelected(SubmenuPages.Store)} Size={UDim2.fromScale(0.475, 1)} Shadow={UDim2.fromScale(1.116, 2.074)} />
                    <SubPageTabComponent Header="Breed Horses" Clicked={() => setSelected(SubmenuPages.Breed)} Size={UDim2.fromScale(0.475, 1)} Shadow={UDim2.fromScale(1.116, 2.074)} />
                </SubPageTabHolderComponent>
                
                <BasicTransparencyGroup Visible={selected === SubmenuPages.Store} Size={UDim2.fromScale(1, 0.984)}>
                    <SubPageScrollComponent Centered={true} Size={UDim2.fromScale(1, 1)} Position={UDim2.fromScale(0.5, 0.5)} AnchorPoint={new Vector2(0.5, 0.5)}>
                        {props.Visible && store === undefined || store?.items.size() === 0 ? <ListHeaderComponent Text="This store is currently out of stock! Come back later." /> : undefined}
                        {props.Visible && store?.items.map((item, index) => {
                            return <HorsePurchaseListComponent Visible={item.available} Purchased={(frame) => {
                                if (LoadingBubbleEffect.HandleLoadingBubbles(frame)) return;

                                BaseEntity.resolveClientEntity().then((client) => {
                                    client.network.action(PlayerActions.Stable, StableActions.PURCHASE, CURRENT_STORE_META.id, item.meta[0] as number)
                                })

                                task.delay(2, () => setForceUpdateNumber(forceUpdateNumber + 1))
                            }} Horse={item} />
                        })}
                    </SubPageScrollComponent>
                </BasicTransparencyGroup>
                
                <BasicTransparencyGroup Visible={selected === SubmenuPages.Breed} Size={UDim2.fromScale(1, 0.871)}>
                    <SubPageScrollComponent Centered={true} Size={UDim2.fromScale(1, 0.984)} Position={UDim2.fromScale(0.5, 0.5)} AnchorPoint={new Vector2(0.5, 0.5)}>
                        {props.Visible && stalls.map((stall, index) => {
                            return <HorseBreedingStallComponent Index={index} Breedable={stall.female !== undefined && stall.male !== undefined && stall.male.isAdult && stall.female.isAdult && !stall.male.isOnCooldown && !stall.female.isOnCooldown} 
                                Breeded={(frame) => {
                                    if (LoadingBubbleEffect.HandleLoadingBubbles(frame)) return;
                                    BaseEntity.resolveClientEntity().then((client) => {
                                        client.network.action(PlayerActions.Stable, StableActions.BREED, stall.male?.data.id, stall.female?.data.id)
                                    })
                                }}
                            >
                                <HorseBreedableComponent Horse={stall.male?.data} IsMaleExpected={true} IsAdult={stall.male?.isAdult} IsOnCooldown={stall.male?.isOnCooldown}/>
                                <HorseBreedableComponent Horse={stall.female?.data} IsAdult={stall.female?.isAdult} IsOnCooldown={stall.female?.isOnCooldown}/>
                            </HorseBreedingStallComponent>
                        })}
                    </SubPageScrollComponent>
                </BasicTransparencyGroup>

                <uilistlayout
                    Padding={new UDim(0, 5)} HorizontalAlignment={Enum.HorizontalAlignment.Center}
                    VerticalAlignment={Enum.VerticalAlignment.Top} SortOrder={Enum.SortOrder.LayoutOrder}
                />
            </SubPageFrameComponent>
        </TransparencyGroup>
    </ContainerFrameComponent>
})

export default function StableShopRoute(): Roact.Element {
    // A selector that returns the player's enchantments.
    const isPlayerShopping = useStateSelector(States.States.subscription("shopping"), (state) => {
        return state.get();
    });

    const isPlayerInStable = useStateSelector(Memory.getSubscription(ClientStoreSubscription), (state) => {
        return state.get() === ClientStoreTypes.STABLE;
    })

    const isPlayerInShop = (isPlayerShopping && isPlayerInStable) ?? false;

    // A mutable instance of a BlurEffect
    const blur = useMutable(new Instance("BlurEffect"));

    // Our menu visibiltiy states
    const [isMenuVisible, setMenuVisible] = useState(false);

    // Our transparency group settings
    const [transparency, settings] = useTransparencyGroup({
        visible: isMenuVisible, tween: new TweenInfo(0.3),
        delay: isMenuVisible ? undefined : 0.15
    });

    // If the tab key is pressed, we want to toggle the menu visibility.
    useEffect(() => {
        setMenuVisible(isPlayerInShop);
    }, [isPlayerInShop])

    // If the menu is visible, we want to show the blur effect.
    useEffect(() => {
        // If the blur effect is not parented to the lighting service, we want to parent it.
        if (!blur.current.Parent) {
            blur.current.Parent = Lighting;
            blur.current.Size = 0;
        };

        // Tween the blur effect size based on the menu visibility.
        TweenService.Create(blur.current, new TweenInfo(0.5), { Size: isMenuVisible ? 30 : 0 }).Play()
    }, [isMenuVisible])

    return <>
        <MenuHolderComponent visible={transparency.map((value) => value !== 1)}>
            <TransparencyGroup visible={isMenuVisible} settings={settings}>
                {/** The overlay component for controlling the menu pages */}
                <MenuOverlayInformationComponent Credits={false} />
            </TransparencyGroup>

            {/** The main menu content and pages */}
            <MenuPageHolderComponent>
                <StableCaretakerPage Visible={isMenuVisible} />
            </MenuPageHolderComponent>
        </MenuHolderComponent>
    </>
}