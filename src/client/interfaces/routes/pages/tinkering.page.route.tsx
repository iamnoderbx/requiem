import Roact from "@rbxts/roact";
import { useMutable, useState, useEffect } from "@rbxts/roact-hooked";
import { Lighting, ReplicatedStorage, TweenService } from "@rbxts/services";
import { BaseEntity } from "client/entities/BaseEntity";
import States, { ClientMenuSubscription, ClientMenuTypes, ClientStoreSubscription, ClientStoreTypes, CURRENT_STORE_META, StoreInventorySubscription } from "client/entities/player/ClientPlayerStates";
import EntryButtonComponent from "client/interfaces/components/entries/entry.button.component";
import EntryComponent from "client/interfaces/components/entries/entry.component";
import EntryLabelComponent from "client/interfaces/components/entries/entry.label.component";
import { EntryLeftSingleLineComponent } from "client/interfaces/components/entries/entry.left.layout.component";
import EntryPillComponent from "client/interfaces/components/entries/entry.pill.component";
import EntryRightButtonsLayoutComponent from "client/interfaces/components/entries/entry.right.buttons.layout.component";
import EntrySoldOverlayComponent from "client/interfaces/components/entries/entry.sold.overlay.component";
import EntryViewportComponent, { EntryViewportFrame, EntryViewportDataListComponent } from "client/interfaces/components/entries/entry.viewport.component";
import { MenuHolderComponent } from "client/interfaces/components/menu/holder.component";
import { MenuOverlayInformationComponent } from "client/interfaces/components/menu/information.component";
import MenuPageHolderComponent from "client/interfaces/components/menu/pagination/holder.component";
import ButtonHeaderSubmenuListComponent from "client/interfaces/components/submenus/button.header.submenu.component";
import SubPageHeaderComponent, { SubPageCloseButton } from "client/interfaces/components/submenus/header.submenu.component";
import { StickySubPageTabComponent, StickyTabComponent } from "client/interfaces/components/submenus/tabs.submenu.component";
import ContainerFrameComponent, { SubPageFrameComponent, BasicTransparencyGroup } from "client/interfaces/components/utilities/frame.component";
import TransparencyGroup, { useTransparencyGroup } from "client/interfaces/components/utilities/transparency.group";
import { useStateSelector } from "client/interfaces/management/InterfaceSelector";

import { Memory } from "shared/utilities/memory.utilities";

enum SubmenuPages {
	Components,
	Tinkering,
}

export function TinkeringMenuPage(props: { Visible: boolean }): Roact.Element {
	const [selected, setSelected] = useState<SubmenuPages>(SubmenuPages.Components);

	// useTransparencyGroup is a custom hook that returns a transparency binding and its settings.
	const [transparency, settings] = useTransparencyGroup({
		visible: props.Visible, tween: new TweenInfo(0.2),
		delay: undefined
	});

	return <ContainerFrameComponent Visible={props.Visible} >
		<TransparencyGroup visible={props.Visible} settings={settings}>
			<SubPageFrameComponent Center={true}>
				<SubPageHeaderComponent title="Tinkering Station" description="Modify and replace your gear components and tinker settings." image="rbxassetid://11422924261" button="Close">
					<SubPageCloseButton Clicked={() => {
						Memory.getSubscription(ClientMenuSubscription).set(ClientStoreTypes.NONE);
					}} UseCloseButton={true}></SubPageCloseButton>
				</SubPageHeaderComponent>

				<StickySubPageTabComponent Count={2} Size={UDim2.fromScale(0.959, 0.053)} Ratio={27.085}>
					<StickyTabComponent Header="Modify Components" Clicked={() => setSelected(SubmenuPages.Components)} Selected={selected === SubmenuPages.Components} Visible={true} />
					<StickyTabComponent Header="Tinker Settings" Clicked={() => setSelected(SubmenuPages.Tinkering)} Selected={selected === SubmenuPages.Tinkering} Visible={true} />
				</StickySubPageTabComponent>

				<BasicTransparencyGroup Visible={selected === SubmenuPages.Components} Size={UDim2.fromScale(1, 0.984)} Position={UDim2.fromScale(0.5, 0.5)}>
					<EntryViewportComponent Position={UDim2.fromScale(0.25, 0.15)} Transparent={true}>
						<EntryViewportFrame Model={ReplicatedStorage.assets.gear["0"]} Scale={0.5} Spins={false}/>
						
					</EntryViewportComponent>
				</BasicTransparencyGroup>

				<BasicTransparencyGroup Visible={selected === SubmenuPages.Tinkering} Size={UDim2.fromScale(1, 0.984)} Position={UDim2.fromScale(0.5, 0.565)}>
					
				</BasicTransparencyGroup>
			</SubPageFrameComponent>
		</TransparencyGroup>
	</ContainerFrameComponent >
}

export default function TinkeringPageRoute(): Roact.Element {
	const isPlayerInTinkering = useStateSelector(Memory.getSubscription(ClientMenuSubscription), (state) => {
		return state.get() === ClientMenuTypes.GEAR;
	})

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
		setMenuVisible(isPlayerInTinkering);
	}, [isPlayerInTinkering])

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
				<TinkeringMenuPage Visible={isMenuVisible} />
			</MenuPageHolderComponent>
		</MenuHolderComponent>
	</>
}