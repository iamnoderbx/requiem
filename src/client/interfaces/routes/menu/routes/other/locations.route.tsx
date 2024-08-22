import Object from "@rbxts/object-utils";
import { useEffect, useState, withHooks } from "@rbxts/roact-hooked";
import { Players } from "@rbxts/services";
import { ClientLocationSubscription } from "client/entities/player/ClientPlayerEntity";
import EntryComponent, { EntryLargeComponent } from "client/interfaces/components/entries/entry.component";
import { EntryHeaderLabelComponent } from "client/interfaces/components/entries/entry.label.component";
import { EntryLeftHeaderLayoutPillsComponent, EntryLeftSingleLineComponent } from "client/interfaces/components/entries/entry.left.layout.component";
import EntryPillComponent from "client/interfaces/components/entries/entry.pill.component";
import EntryParagraphComponent from "client/interfaces/components/entries/paragraphs/entry.paragraph.component";
import { ProgressDescriptionComponent } from "client/interfaces/components/progress/progress.bar.component";
import ButtonHeaderSubmenuListComponent from "client/interfaces/components/submenus/button.header.submenu.component";
import SubPageHeaderComponent, { SubPageCloseButton } from "client/interfaces/components/submenus/header.submenu.component";
import BranchIconComponent from "client/interfaces/components/utilities/branch.icon";
import ContainerFrameComponent, { BasicScalingComponent, SubPageFrameComponent, SubPageScrollComponent } from "client/interfaces/components/utilities/frame.component";
import SubpageItemListComponent, { SubpageItemPillComponent } from "client/interfaces/components/utilities/subpage.list.item.component";
import TransparencyGroup, { useTransparencyGroup } from "client/interfaces/components/utilities/transparency.group";
import { useStateSelector } from "client/interfaces/management/InterfaceSelector";
import Roact from "client/interfaces/management/vendors/Roact";
import { LocationInformation } from "selectors/LocationSharedSelectors";
import { Location, Locations } from "shared/types/Locations";
import { Memory } from "shared/utilities/memory.utilities";
import { String } from "shared/utilities/string.utilities";

const LocationRoute = withHooks((props: { Visible: boolean, Closed: () => void, Location?: number }) => {
    // useTransparencyGroup is a custom hook that returns a transparency binding and its settings.
    const [ transparency, settings ] = useTransparencyGroup({
        visible: props.Visible, tween: new TweenInfo(0.4),
        delay: props.Visible ? 0.1 : undefined
    });

    const [ governor, setGovernor ] = useState("Lore Team");

    // A selector that returns the player's enchantments.
    const locations = useStateSelector(Memory.getSubscription<LocationInformation>(ClientLocationSubscription), (state) => {
        return state.get();
    });

    const location_name = props.Location ? Locations[props.Location] : undefined;
    const location = locations?.find((location) => location.location.name === location_name);

    const cleanLocationName = Location.cleanDistrictName(location?.location.name ?? "SHIGANSHINA");

    useEffect(() => {
        if(!location || !location.location) return;
        if(!props.Location) return;

        if(location.location.governor === 0) setGovernor("Lore Team");
        else setGovernor(Players.GetNameFromUserIdAsync(location.location.governor));
    }, [ location ]);

    return <TransparencyGroup visible={props.Visible} settings={settings}>
        <BasicScalingComponent Visible={props.Visible} />
        <SubPageScrollComponent Size={UDim2.fromScale(0.961, 1)}>
            <ButtonHeaderSubmenuListComponent Header="Return to Locations" Body="Click here to go back to the list of locations." HeaderPosition={UDim2.fromScale(0.0309, 0.281)} Clicked={() => {
                props.Closed();
            }} />

            <EntryLargeComponent>
                <EntryHeaderLabelComponent Text={Location.cleanDistrictName(location?.location.name ?? "SHIGANSHINA")} />
                <EntryLeftHeaderLayoutPillsComponent>
                    <EntryPillComponent Text={(tostring(location?.location.population) ?? "0") + " Citizens"} Color={Color3.fromRGB(255, 255, 255)} />
                    <EntryPillComponent Text={(tostring(location?.location.businesses) ?? "0") + " Businesses"} Color={Color3.fromRGB(255, 255, 255)} />
                    <EntryPillComponent Text={"Governed by " + governor} Color={Color3.fromRGB(255, 255, 255)} />
                </EntryLeftHeaderLayoutPillsComponent>
            </EntryLargeComponent>

            <EntryComponent Size={UDim2.fromScale(0.962, 0.08)} Ratio={17.906}>
                <EntryLeftSingleLineComponent>
                    <EntryHeaderLabelComponent Text="Economical Standings" Size={UDim2.fromScale(0.21, 1)}/>
                    <EntryPillComponent Text={"$" + (tostring(location?.location.average_income) ?? "0") + " Average Income"} Color={Color3.fromRGB(255, 255, 255)} />
                    <EntryPillComponent Text={(tostring(location?.location.civilian_tax) ?? "0") + "% Civilian Tax"} Color={Color3.fromRGB(255, 255, 255)} />
                    <EntryPillComponent Text={(tostring(location?.location.industrial_tax) ?? "0")+ "% Industrial Tax"} Color={Color3.fromRGB(255, 255, 255)} />
                </EntryLeftSingleLineComponent>
            </EntryComponent>

            <EntryParagraphComponent Header="Civilian Consensus" Body={string.format(Location.getOutlookString(location?.location.outlook ?? 50) ?? "Unknown", cleanLocationName ?? "")} />
            <EntryComponent Size={UDim2.fromScale(0.962, 0.142)} LayoutOrder={3} Ratio={10.106}>
                <ProgressDescriptionComponent Header="Civilian Happiness" Body={Location.getSimpleRatingString(location?.location.happiness ?? 50) ?? "None"} Animate={props.Visible} Description="The civilians happiness living in this area." Value={(location?.location.happiness ?? 50) / 100} Size={UDim2.fromScale(0.94, 0.6)} AnchorPoint={new Vector2(0.5, 0.5)} Position={UDim2.fromScale(0.5, 0.6)} Transparencies={{Header: 0.24, Body: 0.49, Description: 0.49}}/>
            </EntryComponent>

            {location?.reputation.map((reputation) => {
                return <EntryComponent Size={UDim2.fromScale(0.962, 0.142)} LayoutOrder={3} Ratio={10.106}>
                    <BranchIconComponent Branch={reputation.name} />
                    <ProgressDescriptionComponent Header={reputation.name} Body={Location.getSimpleRatingString(reputation.reputation ?? 50) ?? "None"} Animate={props.Visible} Description={string.format(Location.getReputationString(reputation.reputation), reputation.name)} Value={(reputation.reputation ?? 50) / 100} Size={UDim2.fromScale(0.873, 0.6)} AnchorPoint={new Vector2(0.5, 0.5)} Position={UDim2.fromScale(0.534, 0.6)} Transparencies={{Header: 0.24, Body: 0.49, Description: 0.49}}/>
                </EntryComponent>
            })}
        </SubPageScrollComponent>
    </TransparencyGroup>
})

const LocationListRoute = withHooks((props: { Visible: boolean, setLocation : (location : number) => void }) => {
    // useTransparencyGroup is a custom hook that returns a transparency binding and its settings.
    const [transparency, settings] = useTransparencyGroup({
        visible: props.Visible, tween: new TweenInfo(0.4),
        delay: props.Visible ? 0.1 : undefined
    });

    return <TransparencyGroup visible={props.Visible} settings={settings}>
        <BasicScalingComponent Visible={props.Visible} />
        <SubPageScrollComponent>
            {Object.keys(Locations).map((location) => {
                const index = Locations[location as keyof typeof Locations];
                const proper = String.CapitalizeAllFirstLetters(string.lower(String.ReplaceUnderscoresWithSpaces(location)));
                const wall = Location.getWallLocation(index) ?? "Unknown";
                const proper_wall = String.CapitalizeAllFirstLetters(string.lower(Location.Wall[wall as keyof typeof Location.Wall] as unknown as string));
                const isDistrict = Location.isDistrict(index);

                return <SubpageItemListComponent Header={proper + (isDistrict ? " District" : "")} Body={"View location information"} LayoutOrder={index} Arrow={true}
                    Clicked={() => {
                        props.setLocation(index)
                    }}
                >
                    <SubpageItemPillComponent Text={"Wall " + proper_wall} Color={Color3.fromRGB(140, 140, 140)} />
                    <SubpageItemPillComponent Text="Overall Liked" Color={Color3.fromRGB(140, 140, 140)} />
                </SubpageItemListComponent>
            })}
        </SubPageScrollComponent>
    </TransparencyGroup>
})

const LocationsRoute = withHooks((props: { Visible: boolean, Closed: () => void }) => {
    // useTransparencyGroup is a custom hook that returns a transparency binding and its settings.
    const [transparency, settings] = useTransparencyGroup({
        visible: props.Visible, tween: new TweenInfo(0.4),
        delay: props.Visible ? 0.1 : undefined
    });

    const [location, setLocation] = useState<number | undefined>(undefined);

    return <ContainerFrameComponent>
        <TransparencyGroup visible={props.Visible} settings={settings}>
            <SubPageFrameComponent>
                <SubPageHeaderComponent title="Locations" description="View locations around Eldia, and their standings." image="rbxassetid://11419707157">
                    <SubPageCloseButton Clicked={props.Closed}></SubPageCloseButton>
                </SubPageHeaderComponent>

                <LocationRoute Visible={location !== undefined} Closed={() => setLocation(undefined)} Location={location} />
                <LocationListRoute Visible={location === undefined} setLocation={setLocation} />
            </SubPageFrameComponent>
        </TransparencyGroup>
    </ContainerFrameComponent>
})

export default LocationsRoute;