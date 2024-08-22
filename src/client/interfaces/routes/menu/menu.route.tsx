import Object from "@rbxts/object-utils";
import { useKeyPress } from "@rbxts/pretty-roact-hooks";
import Roact, { createBinding } from "@rbxts/roact";
import { useEffect, useMutable, useState, withHooks } from "@rbxts/roact-hooked";
import { Lighting, TweenService } from "@rbxts/services";
import MenuBurgerComponent from "client/interfaces/components/menu/burger/burger.component";
import { MenuHolderComponent } from "client/interfaces/components/menu/holder.component";
import { MenuOverlayInformationComponent } from "client/interfaces/components/menu/information.component";
import MenuPaginationButton from "client/interfaces/components/menu/pagination/button.component";
import MenuPageHolderComponent from "client/interfaces/components/menu/pagination/holder.component";
import { MenuPaginationComponent } from "client/interfaces/components/menu/pagination/pagination.component";
import MenuHomePageRoute from "./routes/home.route";
import TransparencyGroup, { useTransparencyGroup } from "client/interfaces/components/utilities/transparency.group";
import MenuProgressionPageRoute from "./routes/progression.route";
import MenuProfilePageRoute from "./routes/profile.route";
import MenuOtherPageRoute from "./routes/other.route";

// Create a list of menu pages with information.
enum MenuPages {
    Home,
    Enchants,
    Profile,
    Other,
    Settings
}

const MenuPageIcons : { [key in MenuPages] : string } = {
    [MenuPages.Home]:       "rbxassetid://11433532654",
    [MenuPages.Enchants]:   "rbxassetid://12967618029",
    [MenuPages.Profile]:    "rbxassetid://11963361597",
    [MenuPages.Other]:    "rbxassetid://11419720347",
    [MenuPages.Settings]:   "rbxassetid://11293977610"
}

const MenuLayoutOrders : { [key in MenuPages] : number } = {
    [MenuPages.Home]:       1,
    [MenuPages.Enchants]:   2,
    [MenuPages.Profile]:    3,
    [MenuPages.Other]:    4,
    [MenuPages.Settings]:   5
}

const OverlayComponent = MenuOverlayInformationComponent;
const MenuHomePage = withHooks(MenuHomePageRoute);
const MenuProgressionPage = withHooks(MenuProgressionPageRoute);
const MenuProfilePage = withHooks(MenuProfilePageRoute)
const MenuOtherPage = withHooks(MenuOtherPageRoute)

export default function MenuRoute() : Roact.Element {
    const [ currentPage, setCurrentPage ] = useState<MenuPages>(MenuPages.Home);

    // A mutable instance of a BlurEffect
    const blur = useMutable(new Instance("BlurEffect"));

    // Our menu visibiltiy states
    const [ isMenuVisible, setMenuVisible ] = useState(false);
    const isTabKeyPressed = useKeyPress(["Tab"])

    // Our transparency group settings
    const [ transparency, settings ] = useTransparencyGroup({
        visible: isMenuVisible, tween: new TweenInfo(0.3), 
        delay: isMenuVisible ? undefined : 0.15
    });
    
    // If the tab key is pressed, we want to toggle the menu visibility.
    useEffect(() => {
        if (isTabKeyPressed) setMenuVisible(!isMenuVisible);
    }, [isTabKeyPressed])

    // If the menu is visible, we want to show the blur effect.
    useEffect(() => {
        // If the blur effect is not parented to the lighting service, we want to parent it.
        if(!blur.current.Parent) {
            blur.current.Parent = Lighting;
            blur.current.Size = 0;
        };
        
        // Tween the blur effect size based on the menu visibility.
        TweenService.Create(blur.current, new TweenInfo(0.5), { Size: isMenuVisible ? 30 : 0 }).Play()
    }, [ isMenuVisible ])

    return <>
        <MenuHolderComponent visible={transparency.map((value) => value !== 1)}>
            <TransparencyGroup visible={isMenuVisible} settings={settings}>
                {/** The overlay component for controlling the menu pages */}
                <OverlayComponent>
                    <MenuBurgerComponent />
                    <MenuPaginationComponent>
                        {Object.keys(MenuPages).map((page) => {
                            return <MenuPaginationButton 
                                icon={MenuPageIcons[MenuPages[page]]} 
                                clicked={() => setCurrentPage(MenuPages[page] as MenuPages)} 
                                layoutOrder={MenuLayoutOrders[MenuPages[page]]}
                            />
                        })}
                    </MenuPaginationComponent>
                </OverlayComponent>
            </TransparencyGroup>

            {/** The main menu content and pages */}
            <MenuPageHolderComponent>
                <MenuHomePage visible={currentPage === MenuPages.Home && isMenuVisible} />
                <MenuProgressionPage visible={currentPage === MenuPages.Enchants && isMenuVisible} />
                <MenuProfilePage visible={currentPage === MenuPages.Profile && isMenuVisible} />
                <MenuOtherPage visible={currentPage === MenuPages.Other && isMenuVisible} />
            </MenuPageHolderComponent>
        </MenuHolderComponent>
    </>
}