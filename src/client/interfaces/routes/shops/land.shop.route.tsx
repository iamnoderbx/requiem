import Roact from "@rbxts/roact";
import { useMutable, useState, useEffect } from "@rbxts/roact-hooked";
import { Lighting, TweenService } from "@rbxts/services";
import { BaseEntity } from "client/entities/BaseEntity";
import States, { CURRENT_STORE_META, ClientStoreSubscription, ClientStoreTypes, StoreInventorySubscription } from "client/entities/player/ClientPlayerStates";
import { MenuHolderComponent } from "client/interfaces/components/menu/holder.component";
import { MenuOverlayInformationComponent } from "client/interfaces/components/menu/information.component";
import MenuPageHolderComponent from "client/interfaces/components/menu/pagination/holder.component";
import SubPageHeaderComponent, { SubPageCloseButton } from "client/interfaces/components/submenus/header.submenu.component";
import SubPageTabHolderComponent, { StickySubPageTabComponent, StickyTabComponent, SubPageTabComponent } from "client/interfaces/components/submenus/tabs.submenu.component";
import { LoadingBubbleEffect } from "client/interfaces/components/utilities/bubble.effect";
import ContainerFrameComponent, { BasicTransparencyGroup, SubPageFrameComponent, SubPageScrollComponent } from "client/interfaces/components/utilities/frame.component";
import ListHeaderComponent from "client/interfaces/components/utilities/list.header.component";
import TransparencyGroup, { useTransparencyGroup } from "client/interfaces/components/utilities/transparency.group";
import { useStateSelector } from "client/interfaces/management/InterfaceSelector";
import { StoreSharedSelectors } from "selectors/StoreSharedSelectors";
import { Memory } from "shared/utilities/memory.utilities";
import { LoadingSubscription } from "../loading.route";
import EntryComponent from "client/interfaces/components/entries/entry.component";
import { EntryLeftSingleLineComponent } from "client/interfaces/components/entries/entry.left.layout.component";
import EntryLabelComponent from "client/interfaces/components/entries/entry.label.component";
import EntryPillComponent from "client/interfaces/components/entries/entry.pill.component";
import EntryRightButtonsLayoutComponent from "client/interfaces/components/entries/entry.right.buttons.layout.component";
import EntryButtonComponent from "client/interfaces/components/entries/entry.button.component";
import EntryBackdropImageComponent from "client/interfaces/components/entries/entry.backdrop.image.component";
import { Plots } from "shared/Plots";
import EntrySoldOverlayComponent from "client/interfaces/components/entries/entry.sold.overlay.component";
import { PlayerActions, PlotActions } from "shared/utilities/network/Events";

enum SubmenuPages {
	Store, Expand
}

export function LandlordShopPage(props: { Visible: boolean }): Roact.Element {
	const [selected, setSelected] = useState<SubmenuPages>(SubmenuPages.Store);

	// useTransparencyGroup is a custom hook that returns a transparency binding and its settings.
	const [transparency, settings] = useTransparencyGroup({
		visible: props.Visible, tween: new TweenInfo(0.2),
		delay: undefined
	});

	const stores = useStateSelector(StoreInventorySubscription, StoreSharedSelectors.getWorldStoreInventories, true);
	const store = stores.find((store) => store.id === CURRENT_STORE_META.id);
	return <ContainerFrameComponent Visible={props.Visible} >
		<TransparencyGroup visible={props.Visible} settings={settings}>
			<SubPageFrameComponent Center={true}>
				<SubPageHeaderComponent title="Land Proprietor" description="Purchase new land, or expand your current land." image="rbxassetid://11422924261" button="Close">
					<SubPageCloseButton Clicked={() => {
						Memory.getSubscription(ClientStoreSubscription).set(ClientStoreTypes.NONE);
						States.set("shopping", false);

					}} UseCloseButton={true}></SubPageCloseButton>
				</SubPageHeaderComponent>

				<StickySubPageTabComponent Count={2} Size={UDim2.fromScale(0.959, 0.053)} Ratio={27.085}>
					<StickyTabComponent Header="Purchase Land" Clicked={() => setSelected(SubmenuPages.Store)} Selected={selected === SubmenuPages.Store} Visible={true} />
					<StickyTabComponent Header="Expand Land" Clicked={() => setSelected(SubmenuPages.Expand)} Selected={selected === SubmenuPages.Expand} Visible={true} />
				</StickySubPageTabComponent>

				<BasicTransparencyGroup Visible={selected === SubmenuPages.Store} Size={UDim2.fromScale(1, 0.984)}>
					<SubPageScrollComponent Centered={true} Size={UDim2.fromScale(0.959, 1)} Position={UDim2.fromScale(0.5, 0.5)} AnchorPoint={new Vector2(0.5, 0.5)}>
						{props.Visible && store === undefined || store?.items.size() === 0 ? <ListHeaderComponent Text="This store is currently out of stock! Come back later." /> : undefined}
						{props.Visible && store?.items.map((item, index) => {
							return <EntryComponent>
								<EntryBackdropImageComponent Image={item.meta[4]! as string} />
								<EntrySoldOverlayComponent Visible={!item.available} />

								<EntryLeftSingleLineComponent >
									<EntryPillComponent Text={"$" + tostring(item.price)} Color={Color3.fromRGB(135, 184, 122)} />
									<EntryLabelComponent Text={item.name} Bold={true}/>
									{(item.meta[3] as string[]).map((description) => {
										return <EntryPillComponent Text={description} Color={Color3.fromRGB(130, 130, 130)} LayoutOrder={2} />
									})}
								</EntryLeftSingleLineComponent>

								<EntryRightButtonsLayoutComponent>
									<EntryButtonComponent Text="PURCHASE" Color={Color3.fromRGB(35, 49, 35)} Filled={true} Clicked={() => {
										// Purchase the land
										BaseEntity.resolveClientEntity().then((client) => {
											client.network.action(PlayerActions.Plot, PlotActions.PURCHASE, CURRENT_STORE_META.id, index)
										})

									}} LayoutOrder={2}/>
									<EntryButtonComponent Text="PREVIEW" Color={Color3.fromRGB(31, 43, 64)} Filled={true} Clicked={() => {}}/>
								</EntryRightButtonsLayoutComponent>
							</EntryComponent>
						})}
					</SubPageScrollComponent>
				</BasicTransparencyGroup>

				<uilistlayout
					Padding={new UDim(0, 5)} HorizontalAlignment={Enum.HorizontalAlignment.Center}
					VerticalAlignment={Enum.VerticalAlignment.Top} SortOrder={Enum.SortOrder.LayoutOrder}
				/>
			</SubPageFrameComponent>
		</TransparencyGroup>
	</ContainerFrameComponent >
}

export default function LandShopRoute(): Roact.Element {
	// A selector that returns the player's enchantments.
	const isPlayerShopping = useStateSelector(States.subscription("shopping"), (state) => {
		return state.get();
	});

	const isPlayerInStable = useStateSelector(Memory.getSubscription(ClientStoreSubscription), (state) => {
		return state.get() === ClientStoreTypes.LAND_PROPRIETOR;
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
				<LandlordShopPage Visible={isMenuVisible} />
			</MenuPageHolderComponent>
		</MenuHolderComponent>
	</>
}