import Roact from "@rbxts/roact";
import { Players, StarterGui } from "@rbxts/services";
import { withHookDetection, withHooks } from "@rbxts/roact-hooked";
import RoactHooked from "./management/vendors/RoactHooked";
import LeaderboardRoute from "./routes/leaderboard.route";
import ChatRoute from "./routes/chat.route";
import CompassRoute from "./routes/compass.route";
import MenuRoute from "./routes/menu/menu.route";
import ToastRoute from "./routes/toasts.route";
import TooltipsRoute from "./routes/tooltips.route";
import AdminBarRoute from "./routes/admin.route";
import DeathRoute from "./routes/death.route";
import InteractionsRoute from "./routes/interactions.route";
import StableShopRoute from "./routes/shops/stable.shop.route";
import LoadingSpinnerComponent from "./routes/loading.route";
import LandShopRoute from "./routes/shops/land.shop.route";
import WorldEditorRoute from "./routes/editor/editor.route";
import DraftsmanShopRoute from "./routes/shops/draftsman.shop.route";
import TinkeringPageRoute from "./routes/pages/tinkering.page.route";

export const ROOT_SCREEN_GUI = new Instance("ScreenGui");

export namespace InterfaceRoactProvider {
    

    export const Routes = [
        LeaderboardRoute,
        ChatRoute,
        CompassRoute,
        MenuRoute,
        ToastRoute,
        TooltipsRoute,
        AdminBarRoute,
        DeathRoute,
        InteractionsRoute,
        LoadingSpinnerComponent,

        // Shops
        StableShopRoute,
        LandShopRoute,
        DraftsmanShopRoute,

        // Alternate Pages
        TinkeringPageRoute,

        // World Editor
        WorldEditorRoute,
    ]

    function RootInterfaceComponent(props: {}) : Roact.Element {
        return <frame Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1}>
            {Routes.map((Route) => {
                const Element = Route;
                return <Element />
            })}
        </frame>
    }

    function Application() {
        const Hooked = RoactHooked.withHooks(RootInterfaceComponent);
        return < Hooked/>
    }

    export function Render() {
        ROOT_SCREEN_GUI.Parent = Players.LocalPlayer!.WaitForChild("PlayerGui");
        ROOT_SCREEN_GUI.IgnoreGuiInset = true;
        ROOT_SCREEN_GUI.ZIndexBehavior = Enum.ZIndexBehavior.Sibling;
        ROOT_SCREEN_GUI.ResetOnSpawn = false;

        StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.All, false);

        withHookDetection(Roact)
        Roact.mount(Application(), ROOT_SCREEN_GUI);
    }
}

InterfaceRoactProvider.Render();
