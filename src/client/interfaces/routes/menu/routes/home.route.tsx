import Roact from "@rbxts/roact";

import { useEffect, useMutable, useRef, useState } from "@rbxts/roact-hooked";
import { Players } from "@rbxts/services";
import { setInterval } from "@rbxts/set-timeout";
import PopupItemListComponent from "client/interfaces/components/lists/list.container.component";
import { BottomListProgressComponent, MiddleListProgressComponent, TopListProgressComponent } from "client/interfaces/components/lists/progress.list.component";
import { BottomListTextComponent, MiddleListTextComponent, SingleListTextComponent, TopListTextComponent } from "client/interfaces/components/lists/text.list.component";

import HomeMenuAttributes from "client/interfaces/components/menu/home/components/attributes.component";
import { HealthBarMenuComponent } from "client/interfaces/components/menu/home/components/health.component";
import { HealthPopupViewportComponent, HealthValueComponent, getGradientColor } from "client/interfaces/components/menu/home/components/healthinspector.component";
import InventoryMenuComponent from "client/interfaces/components/menu/home/components/inventory.component";
import { LoreMenuComponent } from "client/interfaces/components/menu/home/components/lore.component";
import { NourishmentMenuComponent } from "client/interfaces/components/menu/home/components/nourishment.component";
import HomeViewportPageComponent from "client/interfaces/components/menu/home/components/viewport.component";
import MenuHomePageComponent from "client/interfaces/components/menu/home/home.component";
import { PopupCloseButton, PopupComponent, PopupGroupContainer, PopupHeaderComponent, PopupSizeTypes } from "client/interfaces/components/utilities/popup.component";
import TransparencyGroup, { useTransparencyGroup } from "client/interfaces/components/utilities/transparency.group";

export const TemperatureColorization = [
    new Color3(0.82, 0.51, 0.51),
    new Color3(0.7, 0.58, 0.88),
    new Color3(0.51, 0.61, 0.82),
]

enum PopupTypes {
    None,
    Profile,
    Nourishment,
    Health,
}

export default function MenuHomePageRoute(props: { visible: boolean } & Roact.PropsWithChildren): Roact.Element {
    // useRef is used to create a mutable reference object. The returned object will persist for the full lifetime of the component.
    // Here, viewportFrame is a reference to a ViewportFrame instance.
    const viewportFrame = useRef<ViewportFrame>();

    // useMutable is a custom hook that creates a mutable reference object. The returned object will persist for the full lifetime of the component.
    // Here, worldModel is a reference to a WorldModel instance. It's initially set to a new Instance of "WorldModel".
    const worldModel = useMutable<WorldModel>(new Instance("WorldModel"));

    // useMutable is used again to create a mutable reference to a Model instance. It's initially set to undefined.
    const character = useMutable<Model>();

    // useState is a Hook that lets you add React state to function components.
    // Here, popup is a state variable, and setPopup is a function to update that state. The initial state is set to PopupTypes.None.
    const [popup, setPopup] = useState(PopupTypes.None);

    // useTransparencyGroup is a custom hook that returns a transparency binding and its settings.
    const [transparency, settings] = useTransparencyGroup({
        visible: props.visible, tween: new TweenInfo(0.4),
        delay: props.visible ? 0.1 : undefined
    });

    // useEffect hook is used to perform side effects in function components.
    // It takes a function and an array of dependencies as arguments.
    // The function is called after the component is rendered.
    // If the array of dependencies is provided, the function is only called when the values of the dependencies change.
    useEffect(() => {
        // If viewportFrame's value is falsy, exit the function.
        if (!viewportFrame.getValue()) return;
        // If worldModel's current value is falsy, exit the function.
        if (!worldModel.current) return;

        // Store the current value of worldModel in a constant.
        const worldModelInstance = worldModel.current;
        // Set the Parent of worldModelInstance to the value of viewportFrame.
        worldModelInstance.Parent = viewportFrame.getValue();

        // If character's current value is falsy, spawn a new task.
        if (!character.current) task.spawn(() => {
            // If the LocalPlayer's Character is falsy, wait until the CharacterAdded event is fired.
            if (!Players.LocalPlayer.Character) Players.LocalPlayer.CharacterAdded.Wait();
            // Store the LocalPlayer's Character in a variable.
            let characterModel = Players.LocalPlayer.Character;
            // If characterModel is falsy, exit the function.
            if (!characterModel) return;

            // Set the Archivable property of characterModel to true.
            characterModel!.Archivable = true;
            // Clone characterModel and store the clone in the same variable.
            characterModel = characterModel.Clone();
            characterModel.RemoveTag("entity")
            characterModel.SetAttribute("id", undefined)

            // Set the Parent of characterModel to worldModelInstance.
            characterModel.Parent = worldModelInstance;
            // Set the CFrame of the PrimaryPart of characterModel to a new CFrame.
            characterModel.SetPrimaryPartCFrame(new CFrame(0, -0.400000006, -5, 0.98480773, 0, 0.173648193, 0, 1, 0, -0.173648193, 0, 0.98480773))

            // Set the current value of character to characterModel.
            character.current = characterModel;
        })
        // The function passed to useEffect is called when viewportFrame's value changes.
    }, [viewportFrame])

    // Return a TransparencyGroup component. This component is likely responsible for handling transparency animations.
    // It takes two props: visible and settings. The visible prop is passed from the parent component's props.
    // The settings prop is defined earlier in the component.
    return <TransparencyGroup visible={props.visible} settings={settings}>
        {/* PopupGroupContainer provides styling and layout for its children components. */}
        <PopupGroupContainer>
            {/* Profile Information Quick Popup */}
            {/* PopupComponent is a generic component for popups. It takes two props: Size and visible. */}
            {/* The visible prop is true when the popup state is equal to PopupTypes.Profile. */}
            <PopupComponent Size={PopupSizeTypes.Small} visible={popup === PopupTypes.Profile}>
                {/* PopupCloseButton is a button that closes the popup when clicked. */}
                <PopupCloseButton onClick={() => setPopup(PopupTypes.None)} />
                {/* PopupHeaderComponent displays the title of the popup. */}
                <PopupHeaderComponent title="Your Profile" />

                {/* SingleListTextComponent displays a header and a body text. */}
                <SingleListTextComponent
                    position={UDim2.fromScale(0.0859, 0.169)}
                    header={Players.LocalPlayer.Name}
                    body="iAmNode"
                />

                {/* PopupItemListComponent is a list of items in the popup. */}
                <PopupItemListComponent position={UDim2.fromScale(0.499, 0.525)} size={UDim2.fromScale(0.824, 0.375)}>
                    {/* TopListTextComponent, MiddleListTextComponent, and BottomListTextComponent display a header and a body text. */}
                    <TopListTextComponent header="Playtime" body="1 hour, 5 minutes, 30 seconds." />
                    <MiddleListTextComponent header="Events Attended" body="3" />
                    <BottomListTextComponent header="Total Deaths" body="1" />
                </PopupItemListComponent>
            </PopupComponent>

            {/* Nourishment Information Quick Popup */}
            {/* This popup is similar to the previous one, but it displays information about the player's nourishment. */}
            <PopupComponent Size={PopupSizeTypes.Small} visible={popup === PopupTypes.Nourishment}>
                <PopupCloseButton onClick={() => setPopup(PopupTypes.None)} />
                <PopupHeaderComponent title="Your Nourishment" />

                <PopupItemListComponent position={UDim2.fromScale(0.499, 0.4)} size={UDim2.fromScale(0.824, 0.375)}>
                    {/* TopListSliderComponent, MiddleListSliderComponent, and BottomListSliderComponent display a header, a body text, and a slider. */}
                    <TopListProgressComponent header="Hunger" body="You feel slightly hungry." value={0.7} animate={popup === PopupTypes.Nourishment} color={Color3.fromRGB(107, 153, 107)}/>
                    <MiddleListProgressComponent header="Thirst" body="You are fully quenched." value={1} animate={popup === PopupTypes.Nourishment} color={Color3.fromRGB(105, 125, 148)}/>
                    <BottomListProgressComponent header="Temperature" body="You have a slight chill." value={0.35} animate={popup === PopupTypes.Nourishment} color={getGradientColor(0.35, TemperatureColorization)}/>
                </PopupItemListComponent>
            </PopupComponent>

            {/* Health Information Quick Popup */}
            {/* This popup is similar to the previous ones, but it displays information about the player's health. */}
            <PopupComponent Size={PopupSizeTypes.Medium} visible={popup === PopupTypes.Health}>
                <PopupCloseButton onClick={() => setPopup(PopupTypes.None)} />
                <PopupHeaderComponent title="Your Health" />

                <HealthPopupViewportComponent>
                    <HealthValueComponent position={UDim2.fromScale(0.0945, 0.397)} text="Left Arm" value={1} animate={popup === PopupTypes.Health}/>
                    <HealthValueComponent position={UDim2.fromScale(0.702, 0.404)} text="Right Arm" value={0.6} animate={popup === PopupTypes.Health}/>
                    <HealthValueComponent position={UDim2.fromScale(0.187, 0.673)} text="Left Leg" value={0.4} animate={popup === PopupTypes.Health}/>
                    <HealthValueComponent position={UDim2.fromScale(0.627, 0.642)} text="Right Leg" value={0.2} animate={popup === PopupTypes.Health}/>
                    <HealthValueComponent position={UDim2.fromScale(0.581, 0.228)} text="Head" value={0.1} animate={popup === PopupTypes.Health}/>
                </HealthPopupViewportComponent>
            </PopupComponent>

        </PopupGroupContainer>

        {/* MenuHomePageComponent provides the layout for the home page menu. */}
        <MenuHomePageComponent visible={transparency.map((value) => value !== 1)} selected={props.visible}>
            {/* HomeViewportPageComponent displays the viewport. */}
            <HomeViewportPageComponent ref={viewportFrame} />

            {/* HomeMenuAttributes provides the layout for the menu attributes. */}
            <HomeMenuAttributes>
                {/* LoreMenuComponent, HealthBarMenuComponent, and NourishmentMenuComponent are menu items. */}
                <LoreMenuComponent clicked={() => setPopup(PopupTypes.Profile)} />
                <HealthBarMenuComponent clicked={() => setPopup(PopupTypes.Health)} />
                <NourishmentMenuComponent clicked={() => setPopup(PopupTypes.Nourishment)} />
            </HomeMenuAttributes>

            {/* InventoryMenuComponent is another menu item. */}
            <InventoryMenuComponent />
        </MenuHomePageComponent>
    </TransparencyGroup>
}