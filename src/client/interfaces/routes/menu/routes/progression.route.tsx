import Roact from "@rbxts/roact";
import { useEffect, useState } from "@rbxts/roact-hooked";
import ProgressionListComponent from "client/interfaces/components/menu/progression/components/list.component";
import { MenuProgressionPageComponent } from "client/interfaces/components/menu/progression/progression.component";
import ItemListComponent from "client/interfaces/components/utilities/item.list.component";
import TransparencyGroup, { useTransparencyGroup } from "client/interfaces/components/utilities/transparency.group";
import EnchantmentsRoute from "./progression/enchantments.route";
import ContainerFrameComponent from "client/interfaces/components/utilities/frame.component";
import PathBlessingRoute from "./progression/paths.route";
import VowsOfEldiaRoute from "./progression/vows.route";
import { Toasts } from "../../toasts.route";

enum SubmenuPages {
    None,
    Enchantments,
    Blessings,
    Vows,
    Tears,
}

export default function MenuProgressionPageRoute(props: { visible: boolean } & Roact.PropsWithChildren): Roact.Element {
    // useState is a Hook that lets you add React state to function components.
    // Here, popup is a state variable, and setPopup is a function to update that state. The initial state is set to PopupTypes.None.
    const [subMenu, setSubmenu] = useState(SubmenuPages.None);

    // useTransparencyGroup is a custom hook that returns a transparency binding and its settings.
    const [ transparency, settings ] = useTransparencyGroup({
        visible: props.visible && subMenu === SubmenuPages.None, tween: new TweenInfo(0.4),
        delay: props.visible && subMenu === SubmenuPages.None ? 0.1 : undefined
    });

    useEffect(() => {
        if (!props.visible) setSubmenu(SubmenuPages.None);
    }, [subMenu, props.visible])

    return (<ContainerFrameComponent>
        {/* Submenu components for each page. */}
        <EnchantmentsRoute Visible={subMenu === SubmenuPages.Enchantments} Closed={() => setSubmenu(SubmenuPages.None)} />
        <PathBlessingRoute Visible={subMenu === SubmenuPages.Blessings} Closed={() => setSubmenu(SubmenuPages.None)} />
        <VowsOfEldiaRoute Visible={subMenu === SubmenuPages.Vows} Closed={() => setSubmenu(SubmenuPages.None)} />

        {/* Primary component for holding the main page. */}
        <TransparencyGroup visible={props.visible && subMenu === SubmenuPages.None} settings={settings}>
            {/* PopupGroupContainer provides styling and layout for its children components. */}
            <MenuProgressionPageComponent visible={transparency.map((value) => value !== 1)} selected={props.visible && subMenu === SubmenuPages.None}>
                <ProgressionListComponent>
                    <ItemListComponent header="Enchantments" body="View your soul bounded enchantments." icon="rbxassetid://11433533177" clicked={() => setSubmenu(SubmenuPages.Enchantments)} top={subMenu === SubmenuPages.None} />
                    <ItemListComponent header="Paths and Blessings" body="View your Paths and Blessing progression." icon="rbxassetid://12974249788" clicked={() => setSubmenu(SubmenuPages.Blessings)} top={subMenu === SubmenuPages.None} />
                    <ItemListComponent header="Vows of Eldia" body="View your vows and passive progression experience." icon="rbxassetid://11963358738" clicked={() => setSubmenu(SubmenuPages.Vows)} top={subMenu === SubmenuPages.None} />
                    <ItemListComponent header="Tears of Ymir" body="View your Tears of Ymir and their respective progressions." icon="rbxassetid://11432852305" clicked={() => {
                        Toasts.failed("You must complete the Paths and Blessings progression to unlock this feature.");
                    }} top={subMenu === SubmenuPages.None} />
                </ProgressionListComponent>
            </MenuProgressionPageComponent>
        </TransparencyGroup>
    </ContainerFrameComponent>)
}