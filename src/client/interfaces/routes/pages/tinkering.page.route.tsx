import Roact from "@rbxts/roact";
import { useMutable, useState, useEffect } from "@rbxts/roact-hooked";
import { Lighting, TweenService } from "@rbxts/services";
import States, { ClientMenuSubscription, ClientMenuTypes, ClientStoreSubscription, ClientStoreTypes } from "client/entities/player/ClientPlayerStates";
import { MenuHolderComponent } from "client/interfaces/components/menu/holder.component";
import { MenuOverlayInformationComponent } from "client/interfaces/components/menu/information.component";
import MenuPageHolderComponent from "client/interfaces/components/menu/pagination/holder.component";
import TransparencyGroup, { useTransparencyGroup } from "client/interfaces/components/utilities/transparency.group";
import { useStateSelector } from "client/interfaces/management/InterfaceSelector";
import { Memory } from "shared/utilities/memory.utilities";

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
				
			</MenuPageHolderComponent>
		</MenuHolderComponent>
	</>
}