import Roact from "@rbxts/roact";
import { useEffect, useState } from "@rbxts/roact-hooked";

import ProgressionListComponent from "client/interfaces/components/menu/progression/components/list.component";
import { MenuProgressionPageComponent } from "client/interfaces/components/menu/progression/progression.component";
import ContainerFrameComponent from "client/interfaces/components/utilities/frame.component";
import ItemListComponent from "client/interfaces/components/utilities/item.list.component";
import TransparencyGroup, { useTransparencyGroup } from "client/interfaces/components/utilities/transparency.group";
import HorsesRoute from "./profile/horses.route";
import TreasuriesRoute from "./profile/treasuries.route";

enum SubmenuPages {
    None,
    Horses,
    Treasuries,
}

export default function MenuProfilePageRoute(props: { visible: boolean } & Roact.PropsWithChildren): Roact.Element {
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
        <HorsesRoute Visible={subMenu === SubmenuPages.Horses} Closed={() => setSubmenu(SubmenuPages.None)} />
        <TreasuriesRoute Visible={subMenu === SubmenuPages.Treasuries} Closed={() => setSubmenu(SubmenuPages.None)} />

        {/* Primary component for holding the main page. */}
        <TransparencyGroup visible={props.visible && subMenu === SubmenuPages.None} settings={settings}>
            {/* PopupGroupContainer provides styling and layout for its children components. */}
            <MenuProgressionPageComponent visible={transparency.map((value) => value !== 1)} selected={props.visible && subMenu === SubmenuPages.None}>
            <ProgressionListComponent>
                <ItemListComponent header="Profile" body="View your profile, and your lore character information." icon="rbxassetid://11295273292" clicked={() => { }} top={subMenu === SubmenuPages.None}/>
                <ItemListComponent header="Bloodline" body="View your lineage, and all relevant information to your family." icon="rbxassetid://11422144827" clicked={() => {}} top={subMenu === SubmenuPages.None}/>
                <ItemListComponent header="Treasuries" body="View your treasuries, and all financial audits." icon="rbxassetid://11963361341" clicked={() => setSubmenu(SubmenuPages.Treasuries)} top={subMenu === SubmenuPages.None}/>
                <ItemListComponent header="Horses" body="View your horses, and a respective horse statistic." icon="rbxassetid://11419717444" clicked={() => setSubmenu(SubmenuPages.Horses)} top={subMenu === SubmenuPages.None}/>
            </ProgressionListComponent>
            </MenuProgressionPageComponent>
        </TransparencyGroup>
    </ContainerFrameComponent>)
}