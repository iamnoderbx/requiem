import Roact from "@rbxts/roact";
import { useEffect, useState } from "@rbxts/roact-hooked";
import ProgressionListComponent from "client/interfaces/components/menu/progression/components/list.component";
import { MenuProgressionPageComponent } from "client/interfaces/components/menu/progression/progression.component";
import ContainerFrameComponent from "client/interfaces/components/utilities/frame.component";
import ItemListComponent from "client/interfaces/components/utilities/item.list.component";
import TransparencyGroup, { useTransparencyGroup } from "client/interfaces/components/utilities/transparency.group";
import LocationsRoute from "./other/locations.route";
import BranchRoute from "./other/branch.route";

enum SubmenuPages {
    None,
    Branch,
    Locations,
}

export default function MenuOtherPageRoute(props: { visible: boolean } & Roact.PropsWithChildren): Roact.Element {
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
        <BranchRoute Visible={subMenu === SubmenuPages.Branch} Closed={() => setSubmenu(SubmenuPages.None)} />
        <LocationsRoute Visible={subMenu === SubmenuPages.Locations} Closed={() => setSubmenu(SubmenuPages.None)} />

        {/* Primary component for holding the main page. */}
        <TransparencyGroup visible={props.visible && subMenu === SubmenuPages.None} settings={settings}>
            {/* PopupGroupContainer provides styling and layout for its children components. */}
            <MenuProgressionPageComponent visible={transparency.map((value) => value !== 1)} selected={props.visible && subMenu === SubmenuPages.None}>
                <ProgressionListComponent>
                    <ItemListComponent header="Military Branch" body="View your military branch and information about it." icon="rbxassetid://11432832657" clicked={() => setSubmenu(SubmenuPages.Branch)} top={subMenu === SubmenuPages.None}/>
                    <ItemListComponent header="Locations" body="View locations around Eldia, and their standings." icon="rbxassetid://11419707157" clicked={() => setSubmenu(SubmenuPages.Locations)} top={subMenu === SubmenuPages.None}/>
                </ProgressionListComponent>
            </MenuProgressionPageComponent>
        </TransparencyGroup>
    </ContainerFrameComponent>)
}