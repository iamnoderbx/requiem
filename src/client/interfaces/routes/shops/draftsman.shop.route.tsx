import Roact from "@rbxts/roact";
import { useMutable, useState, useEffect } from "@rbxts/roact-hooked";
import { Lighting, TweenService } from "@rbxts/services";
import States, { CURRENT_STORE_META, ClientStoreSubscription, ClientStoreTypes, StoreInventorySubscription } from "client/entities/player/ClientPlayerStates";
import { MenuHolderComponent } from "client/interfaces/components/menu/holder.component";
import { MenuOverlayInformationComponent } from "client/interfaces/components/menu/information.component";
import MenuPageHolderComponent from "client/interfaces/components/menu/pagination/holder.component";
import SubPageHeaderComponent, { SubPageCloseButton } from "client/interfaces/components/submenus/header.submenu.component";
import { StickySubPageTabComponent, StickyTabComponent } from "client/interfaces/components/submenus/tabs.submenu.component";
import ContainerFrameComponent, { BasicTransparencyGroup, SubPageFrameComponent, SubPageScrollComponent } from "client/interfaces/components/utilities/frame.component";
import ListHeaderComponent from "client/interfaces/components/utilities/list.header.component";
import TransparencyGroup, { useTransparencyGroup } from "client/interfaces/components/utilities/transparency.group";
import { useStateSelector } from "client/interfaces/management/InterfaceSelector";
import { StoreSharedSelectors } from "selectors/StoreSharedSelectors";
import { Memory } from "shared/utilities/memory.utilities";
import EntryComponent from "client/interfaces/components/entries/entry.component";
import { EntryLeftSingleLineComponent } from "client/interfaces/components/entries/entry.left.layout.component";
import EntryLabelComponent from "client/interfaces/components/entries/entry.label.component";
import EntryPillComponent from "client/interfaces/components/entries/entry.pill.component";
import EntryRightButtonsLayoutComponent from "client/interfaces/components/entries/entry.right.buttons.layout.component";
import EntryButtonComponent from "client/interfaces/components/entries/entry.button.component";
import EntrySoldOverlayComponent from "client/interfaces/components/entries/entry.sold.overlay.component";
import { Blueprint } from "shared/Blueprint";
import { Number } from "shared/utilities/number.utilities";
import { String } from "shared/utilities/string.utilities";
import ButtonHeaderSubmenuListComponent from "client/interfaces/components/submenus/button.header.submenu.component";
import EntryViewportComponent, { EntryViewportDataListComponent, EntryViewportFrame } from "client/interfaces/components/entries/entry.viewport.component";
import { BaseEntity } from "client/entities/BaseEntity";
import { PlayerActions, StoreActions } from "shared/utilities/network/Events";
import { Stores } from "shared/Stores";

enum SubmenuPages {
	Store,
	Preview,
}

export function DraftsmanShopPage(props: { Visible: boolean }): Roact.Element {
	const [selected, setSelected] = useState<SubmenuPages>(SubmenuPages.Store);

	// useTransparencyGroup is a custom hook that returns a transparency binding and its settings.
	const [transparency, settings] = useTransparencyGroup({
		visible: props.Visible, tween: new TweenInfo(0.2),
		delay: undefined
	});

	const stores = useStateSelector(StoreInventorySubscription, StoreSharedSelectors.getWorldStoreInventories, true);
	const store = stores.find((store) => store.id === CURRENT_STORE_META.id);

	const [ previewing, setPreviewing ] = useState<Blueprint.Type>();

	return <ContainerFrameComponent Visible={props.Visible} >
		<TransparencyGroup visible={props.Visible} settings={settings}>
			<SubPageFrameComponent Center={true}>
				<SubPageHeaderComponent title="Draftsman" description="Purchase new blueprints and schematics." image="rbxassetid://11422924261" button="Close">
					<SubPageCloseButton Clicked={() => {
						Memory.getSubscription(ClientStoreSubscription).set(ClientStoreTypes.NONE);
						States.set("shopping", false);

					}} UseCloseButton={true}></SubPageCloseButton>
				</SubPageHeaderComponent>

				<BasicTransparencyGroup Visible={selected === SubmenuPages.Store} Size={UDim2.fromScale(1, 0.984)} Position={UDim2.fromScale(0.5, 0.565)}>
					<SubPageScrollComponent Centered={true} Size={UDim2.fromScale(0.959, 1)} Position={UDim2.fromScale(0.5, 0.5)} AnchorPoint={new Vector2(0.5, 0.5)}>
						{props.Visible && store === undefined || store?.items.size() === 0 ? <ListHeaderComponent Text="This store is currently out of stock! Come back later." /> : undefined}
						{props.Visible && store?.items.map((item, index) => {
							const blueprint_id = item.meta[1] as number;
							const blueprint = Blueprint.getBlueprintFromLookupEnum(blueprint_id);

							// Pull the number from the item name
							const number = string.match(item.name, "%d+")[0];
							const strNumber = number && Number.Wordify(tonumber(number)!);

							// Remove the number from the item name
							const [name] = string.gsub(item.name, "%d+", "");
							

							return <EntryComponent>
								<EntrySoldOverlayComponent Visible={!item.available} />

								<EntryLeftSingleLineComponent >
									<EntryPillComponent Text={"$" + tostring(item.price)} Color={Color3.fromRGB(135, 184, 122)} />
									<EntryLabelComponent Text={name + "Blueprint"} Bold={true} />

									<EntryPillComponent Text={blueprint![Blueprint.Key.DESCRIPTION]} Color={Color3.fromRGB(130, 130, 130)} LayoutOrder={2} />
									{number && strNumber ? <EntryPillComponent Text={"Variant " + String.CapitalizeAllFirstLetters(strNumber)} Color={Color3.fromRGB(130, 130, 130)} LayoutOrder={3} /> : undefined}
								</EntryLeftSingleLineComponent>

								<EntryRightButtonsLayoutComponent>
									<EntryButtonComponent Text="PURCHASE" Color={Color3.fromRGB(35, 49, 35)} Filled={true} Clicked={() => {
										// Purchase the blueprint
										BaseEntity.resolveClientEntity().then((entity) => {
											entity.network.action(PlayerActions.Stores, StoreActions.PURCHASE, CURRENT_STORE_META.id, item.meta[0] as number, Stores.Types.Draftsman)
										})
									}} LayoutOrder={2} />

									<EntryButtonComponent Text="PREVIEW" Color={Color3.fromRGB(31, 43, 64)} Filled={true} Clicked={() => {
										setSelected(SubmenuPages.Preview);
										setPreviewing(blueprint!);
									}}/>
								</EntryRightButtonsLayoutComponent>
							</EntryComponent>
						})}
					</SubPageScrollComponent>

					<uilistlayout
						Padding={new UDim(0, 5)} HorizontalAlignment={Enum.HorizontalAlignment.Center}
						VerticalAlignment={Enum.VerticalAlignment.Top} SortOrder={Enum.SortOrder.LayoutOrder}
					/>
				</BasicTransparencyGroup>

				<BasicTransparencyGroup Visible={selected === SubmenuPages.Preview} Size={UDim2.fromScale(1, 0.984)} Position={UDim2.fromScale(0.5, 0.565)}>
					<SubPageScrollComponent Size={UDim2.fromScale(1, 1)} Position={UDim2.fromScale(0.5, 0)} Centered={true}>
						<ButtonHeaderSubmenuListComponent Header="Return to Store" Body="Click here to go back to the store." HeaderPosition={UDim2.fromScale(0.0309, 0.281)} Clicked={() => {
							setSelected(SubmenuPages.Store);
						}} />

						<EntryViewportComponent>
							<EntryViewportFrame Model={previewing && previewing[Blueprint.Key.MODEL]}/>
							<EntryViewportDataListComponent>
								<EntryPillComponent Text={previewing ? Blueprint.getBlueprintDimensions(previewing[Blueprint.Key.MODEL]).X + " Studs Length" : "Unknown"} Color={Color3.fromRGB(255, 255, 255)} />
								<EntryPillComponent Text={previewing ? Blueprint.getBlueprintDimensions(previewing[Blueprint.Key.MODEL]).Z + " Studs Width" : "Unknown"} Color={Color3.fromRGB(255, 255, 255)} />
								<EntryPillComponent Text={previewing ? Blueprint.getBlueprintDimensions(previewing[Blueprint.Key.MODEL]).Y + " Studs Height" : "Unknown"} Color={Color3.fromRGB(255, 255, 255)} />
							</EntryViewportDataListComponent>
						</EntryViewportComponent>

						<EntryComponent LayoutOrder={2} Size={UDim2.fromScale(0.962, 0.07)}>
							<EntryLeftSingleLineComponent >
								<EntryPillComponent Text={"$" + tostring(previewing ? previewing[Blueprint.Key.PRICE] : 0)} Color={Color3.fromRGB(135, 184, 122)} />
								<EntryLabelComponent Text={"Blueprint Materials"} Bold={true} />

								{previewing && previewing[Blueprint.Key.MATERIALS].map((material) => {
									const material_name = String.CapitalizeAllFirstLetters(string.lower(Blueprint.Materials[material[0]]));
									const count = material[1];
									return <EntryPillComponent Text={tostring(count) + " " + material_name} Color={Color3.fromRGB(255, 255, 255)} LayoutOrder={2}/>
								})}
							</EntryLeftSingleLineComponent>
						</EntryComponent>
					</SubPageScrollComponent>
				</BasicTransparencyGroup>
			</SubPageFrameComponent>
		</TransparencyGroup>
	</ContainerFrameComponent >
}

export default function DraftsmanShopRoute(): Roact.Element {
	// A selector that returns the player's enchantments.
	const isPlayerShopping = useStateSelector(States.subscription("shopping"), (state) => {
		return state.get();
	});

	const isPlayerInStable = useStateSelector(Memory.getSubscription(ClientStoreSubscription), (state) => {
		return state.get() === ClientStoreTypes.DRAFTSMAN;
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
				<DraftsmanShopPage Visible={isMenuVisible} />
			</MenuPageHolderComponent>
		</MenuHolderComponent>
	</>
}