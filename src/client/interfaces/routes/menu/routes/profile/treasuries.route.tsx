import { useEffect, useState, withHooks } from "@rbxts/roact-hooked";
import { Players } from "@rbxts/services";
import { BaseEntity } from "client/entities/BaseEntity";
import { ClientTreasurySubscription } from "client/entities/player/ClientPlayerEntity";
import TreasuryAuditComponent from "client/interfaces/components/menu/profile/treasury/treasury.audit.component";
import TreasuryContentComponent from "client/interfaces/components/menu/profile/treasury/treasury.content.component";
import TreasuryGeneralSettingsComponent from "client/interfaces/components/menu/profile/treasury/treasury.general.settings.component";
import TreasuryHeaderComponent, { TreasurySubpageHeaderComponent } from "client/interfaces/components/menu/profile/treasury/treasury.header.component";
import TreasuryIncomeComponent from "client/interfaces/components/menu/profile/treasury/treasury.income.component";
import TreasuryLabelButtonComponent from "client/interfaces/components/menu/profile/treasury/treasury.label.button.component";
import TreasuryMarcsComponent from "client/interfaces/components/menu/profile/treasury/treasury.marcs.component";
import TreasuryNewUserComponent from "client/interfaces/components/menu/profile/treasury/treasury.newuser.component";
import TreasuryPermissionComponent from "client/interfaces/components/menu/profile/treasury/treasury.permission.component";
import TreasuryPermissionHolderComponent from "client/interfaces/components/menu/profile/treasury/treasury.permission.holder.component";
import PopupComponent, { PopupListConstraints, PopupListLayout } from "client/interfaces/components/popups/popup.component";
import SlimPopupComponent, { SlimPopupButtonsComponent } from "client/interfaces/components/popups/slim.popup.component";
import SmallPopupComponent from "client/interfaces/components/popups/small.popup.component";
import { ButtonItemComponent } from "client/interfaces/components/progress/buttons.component";
import SubPageHeaderComponent, { SubPageCloseButton } from "client/interfaces/components/submenus/header.submenu.component";
import { LoadingBubbleEffect } from "client/interfaces/components/utilities/bubble.effect";
import ContainerFrameComponent, { BasicScalingComponent, SubPageFrameComponent, SubPageScrollComponent } from "client/interfaces/components/utilities/frame.component";
import { InputTextboxLabelComponent } from "client/interfaces/components/utilities/input.component";
import TransparencyGroup, { useTransparencyGroup } from "client/interfaces/components/utilities/transparency.group";
import { useStateSelector } from "client/interfaces/management/InterfaceSelector";
import Roact from "client/interfaces/management/vendors/Roact";
import { Toasts } from "client/interfaces/routes/toasts.route";
import { TreasuryData } from "selectors/TreasurySharedSelectors";
import { Treasuries } from "shared/Treasuries";
import { Locations } from "shared/types/Locations";
import { Memory } from "shared/utilities/memory.utilities";
import { PlayerActions, TreasuryActions } from "shared/utilities/network/Events";
import { String } from "shared/utilities/string.utilities";

enum SubmenuPages {
    Overview,
    Audits,
    Settings,
    Notices,
}

enum OverviewPages {
    Deposit,
    Withdraw,
}

const TreasuriesOverviewPage = withHooks((props: { Treasury: TreasuryData, Visible: boolean, OnButtonClicked: (page: OverviewPages | undefined) => void, OnPageChangeClicked: (page: SubmenuPages) => void, OnTreasuryChanged: (id: number) => void, Treasuries: TreasuryData[] }) => {
    // useTransparencyGroup is a custom hook that returns a transparency binding and its settings.
    const [transparency, settings] = useTransparencyGroup({
        visible: props.Visible, tween: new TweenInfo(0.4),
        delay: props.Visible ? 0.1 : undefined
    });

    LoadingBubbleEffect.CleanupLoadingBubbles();
    const [isDropdownVisible, setDropdownVisible] = useState(false);

    let locationString = String.CapitalizeAllFirstLetters(string.lower(Locations[props.Treasury.location]));
    if(locationString === "Royal Palace") locationString = "the " + locationString

    return <ContainerFrameComponent>
        <TransparencyGroup visible={props.Visible} settings={settings}>
            <BasicScalingComponent Visible={props.Visible} />
            <SubPageScrollComponent Size={UDim2.fromScale(0.961, 0.9)}>
                <TreasuryHeaderComponent Location={locationString} Name={props.Treasury.name} Owner={Players.GetNameFromUserIdAsync(props.Treasury.owner)} IsDropdownVisible={isDropdownVisible} Treasuries={
                    props.Treasuries.map((treasury) => {
                        return { Name: treasury.name, Id: treasury.id }
                    })
                } DropdownClicked={() => setDropdownVisible(!isDropdownVisible)} DropdownEntryClicked={(treasury) => {
                    setDropdownVisible(false);
                    props.OnTreasuryChanged(treasury.Id);
                }} />

                <TreasuryMarcsComponent Marcs={props.Treasury.marcs} OnDepositClicked={() => props.OnButtonClicked(OverviewPages.Deposit)} OnWithdrawClicked={() => props.OnButtonClicked(OverviewPages.Withdraw)} />
                <TreasuryLabelButtonComponent Header="Treasury Audits" Body="View your treasury transactions details and past withdraws." Clicked={() => props.OnPageChangeClicked(SubmenuPages.Audits)} Visible={true} />
                <TreasuryLabelButtonComponent Header="Treasury Notices" Body="View your treasury notices, such as payslips and mail." Clicked={() => props.OnPageChangeClicked(SubmenuPages.Notices)} Visible={true} />
                <TreasuryLabelButtonComponent Header="Manage Treasury" Body="Manage your treasury and it's settings, such as permissions." Clicked={() => props.OnPageChangeClicked(SubmenuPages.Settings)} Visible={props.Treasury.owner === Players.LocalPlayer.UserId} />

                <TreasuryContentComponent MaxWeight={100} Weight={0} Items={[]} />
            </SubPageScrollComponent>
        </TransparencyGroup>
    </ContainerFrameComponent>
})

const TreasuriesAuditsPage = withHooks((props: { Treasury: TreasuryData, Visible: boolean, OnPageChangeClicked: (page: SubmenuPages) => void }) => {
    // useTransparencyGroup is a custom hook that returns a transparency binding and its settings.
    const [transparency, settings] = useTransparencyGroup({
        visible: props.Visible, tween: new TweenInfo(0.4),
        delay: props.Visible ? 0.1 : undefined
    });

    LoadingBubbleEffect.CleanupLoadingBubbles();

    useEffect(() => {
        if (props.Visible) {
            // Fetch the treasury audits by sending a request to the server.
            BaseEntity.resolveClientEntity().then((entity) => {
                entity.network.action(PlayerActions.Treasury, TreasuryActions.Audits, props.Treasury.id);
            })
        }
    }, [ props.Visible ])

    return <TransparencyGroup visible={props.Visible} settings={settings}>
        <BasicScalingComponent Visible={props.Visible} />
        <SubPageScrollComponent Size={UDim2.fromScale(0.961, 0.9)}>
            <TreasurySubpageHeaderComponent Header="Treasury Audits" Body="Return back to your treasury homepage." Clicked={() => props.OnPageChangeClicked(SubmenuPages.Overview)} />

            {props.Treasury.audits.map((audit, index) => {
                return <TreasuryAuditComponent TreasuryID={props.Treasury.id} Audit={audit} />
            })}
        </SubPageScrollComponent>
    </TransparencyGroup>
})

const TreasuriesNoticePage = withHooks((props: { Treasury: TreasuryData, Visible: boolean, OnPageChangeClicked: (page: SubmenuPages) => void }) => {
    // useTransparencyGroup is a custom hook that returns a transparency binding and its settings.
    const [transparency, settings] = useTransparencyGroup({
        visible: props.Visible, tween: new TweenInfo(0.4),
        delay: props.Visible ? 0.1 : undefined
    });

    LoadingBubbleEffect.CleanupLoadingBubbles();

    useEffect(() => {
        if (props.Visible) {
            BaseEntity.resolveClientEntity().then((entity) => {
                entity.network.action(PlayerActions.Treasury, TreasuryActions.Notices, props.Treasury.id);
            })
        }
    }, [props.Visible])

    return <TransparencyGroup visible={props.Visible} settings={settings}>
        <BasicScalingComponent Visible={props.Visible} />
        <SubPageScrollComponent Size={UDim2.fromScale(0.961, 0.9)}>
            <TreasurySubpageHeaderComponent Header="Treasury Notices" Body="Return back to your treasury homepage." Clicked={() => props.OnPageChangeClicked(SubmenuPages.Overview)} />

            {props.Treasury.income.map((income, index) => {
                return <TreasuryIncomeComponent Income={income} Clicked={(frame) => {
                    if (LoadingBubbleEffect.HandleLoadingBubbles(frame)) return;

                    BaseEntity.resolveClientEntity().then((entity) => {
                        entity.network.action(PlayerActions.Treasury, TreasuryActions.ClaimIncome, props.Treasury.id, income.UniqueID);
                    })
                }}/>
            })}
        </SubPageScrollComponent>
    </TransparencyGroup>
})

const TreasuriesSettingsPage = withHooks((props: { Treasury: TreasuryData, Visible: boolean, OnPageChangeClicked: (page: SubmenuPages) => void }) => {
    // useTransparencyGroup is a custom hook that returns a transparency binding and its settings.
    const [transparency, settings] = useTransparencyGroup({
        visible: props.Visible, tween: new TweenInfo(0.4),
        delay: props.Visible ? 0.1 : undefined
    });

    const [addingUser, setAddingUser] = useState(false);

    useEffect(() => {
        LoadingBubbleEffect.CleanupLoadingBubbles();
    }, [props.Treasury])

    useEffect(() => {
        if (props.Visible) {
            // Fetch the treasury audits by sending a request to the server.
            BaseEntity.resolveClientEntity().then((entity) => {
                entity.network.action(PlayerActions.Treasury, TreasuryActions.Permissions, props.Treasury.id);
            })
        }
    }, [props.Visible])

    return <TransparencyGroup visible={props.Visible} settings={settings}>
        <BasicScalingComponent Visible={props.Visible} />
        <SubPageScrollComponent Size={UDim2.fromScale(0.961, 0.9)}>
            <TreasurySubpageHeaderComponent Header="Treasury Management" Body="Return back to your treasury homepage." Clicked={() => props.OnPageChangeClicked(SubmenuPages.Overview)} />

            <TreasuryGeneralSettingsComponent Name={props.Treasury.name} Identifier={props.Treasury.id} OnNameChanged={(name, frame) => {
                const isReservedName = Treasuries.isTreasuryReservedName(name);
                if (isReservedName) {
                    return Toasts.failed("You cannot rename a treasury to a reserved name.");
                }

                if (LoadingBubbleEffect.HandleLoadingBubbles(frame)) return;

                BaseEntity.resolveClientEntity().then((entity) => {
                    entity.network.action(PlayerActions.Treasury, TreasuryActions.Rename, props.Treasury.id, name);
                })
            }} />

            <TreasuryPermissionHolderComponent Locked={false} OnAddPermission={() => setAddingUser(true)}>
                <TreasuryPermissionComponent User={props.Treasury.owner} Owner={true} />

                {props.Treasury.permissions.map((permission) => {
                    return <TreasuryPermissionComponent User={permission.user} Owner={false} Deleted={(frame) => {
                        if (LoadingBubbleEffect.HandleLoadingBubbles(frame)) return;

                        const realUsername = Players.GetNameFromUserIdAsync(permission.user) as unknown as string;
                        Toasts.info("Attempting to remove " + realUsername + " from the treasury.");

                        BaseEntity.resolveClientEntity().then((entity) => {
                            entity.network.action(PlayerActions.Treasury, TreasuryActions.RemoveUserPermission, props.Treasury.id, permission.user);
                        })
                    }} />
                })}

                {addingUser && <TreasuryNewUserComponent FocusLost={(username, frame) => {
                    if (LoadingBubbleEffect.HandleLoadingBubbles(frame)) return;
                    setAddingUser(false);

                    if (username === "") return Toasts.failed("You must enter a username to add a new user to the treasury.");

                    // Check if the username is valid.
                    const [success, player] = pcall(() => Players.GetUserIdFromNameAsync(username)) as LuaTuple<[boolean, number | undefined]>;
                    if (!player || !success) return Toasts.failed("The player you entered does not exist.");

                    const realUsername = Players.GetNameFromUserIdAsync(player) as unknown as string;
                    Toasts.info("Attempting to add " + realUsername + " to the treasury.");

                    BaseEntity.resolveClientEntity().then((entity) => {
                        entity.network.action(PlayerActions.Treasury, TreasuryActions.AddUserPermission, props.Treasury.id, player);
                    })
                }} />}
            </TreasuryPermissionHolderComponent>
        </SubPageScrollComponent>
    </TransparencyGroup>
})

const TreasuriesRoute = withHooks((props: { Visible: boolean, Closed: () => void }) => {
    // useState is a Hook that lets you add React state to function components.
    // Here, popup is a state variable, and setPopup is a function to update that state. The initial state is set to PopupTypes.None.
    const [subMenu, setSubmenu] = useState(SubmenuPages.Overview);

    const [selectedTreasury, setSelectedTreasury] = useState<TreasuryData>();

    // useTransparencyGroup is a custom hook that returns a transparency binding and its settings.
    const [transparency, settings] = useTransparencyGroup({
        visible: props.Visible, tween: new TweenInfo(0.4),
        delay: props.Visible ? 0.1 : undefined
    });

    const [isPopupOpen, setPopupOpen] = useState<OverviewPages>();

    // A selector that returns the player's enchantments.
    const treasuries = useStateSelector(Memory.getSubscription<TreasuryData[]>(ClientTreasurySubscription), (state) => {
        return state.get();
    });

    useEffect(() => {
        if (!treasuries) return;

        if (!selectedTreasury) setSelectedTreasury(treasuries[0])
        if (!selectedTreasury) return;

        // Set the selected treasury to the current treasury id.
        setSelectedTreasury(treasuries.find((treasury) => treasury.id === selectedTreasury?.id));
    }, [treasuries, selectedTreasury])

    LoadingBubbleEffect.CleanupLoadingBubbles();

    if (!treasuries) return <></>
    if (!selectedTreasury) return <></>

    return <ContainerFrameComponent>
        <PopupComponent Visible={isPopupOpen === OverviewPages.Deposit} Color={Color3.fromRGB(56, 97, 56)}>
            <SlimPopupComponent
                Header={"Deposit Marcs"}
                Body={"Deposit marcs in to your treasury."}
                Visible={isPopupOpen === OverviewPages.Deposit}
                Closed={() => setPopupOpen(undefined)}
                Color={Color3.fromRGB(148, 240, 156)}
            >
                <PopupListLayout Padding={0.1} />
                <InputTextboxLabelComponent Label="Deposit Amount" Changed={() => { }} Color={Color3.fromRGB(148, 240, 156)} />
                <SlimPopupButtonsComponent>
                    <ButtonItemComponent Text="Submit" Color={Color3.fromRGB(255, 255, 255)} Clicked={() => { }} />
                </SlimPopupButtonsComponent>
            </SlimPopupComponent>
        </PopupComponent>

        <PopupComponent Visible={isPopupOpen === OverviewPages.Withdraw} Color={Color3.fromRGB(97, 56, 56)}>
            <SlimPopupComponent
                Header={"Withdraw Marcs"}
                Body={"Withdraw marcs in to your treasury."}
                Visible={isPopupOpen === OverviewPages.Withdraw}
                Closed={() => setPopupOpen(undefined)}
                Color={Color3.fromRGB(240, 148, 148)}
            >
                <PopupListLayout Padding={0.125} />
                <InputTextboxLabelComponent Label="Withdraw Amount" Changed={() => { }} Color={Color3.fromRGB(240, 148, 148)} />
                <InputTextboxLabelComponent Label="Withdraw Reason" Changed={() => { }} Color={Color3.fromRGB(240, 148, 148)} />
                <SlimPopupButtonsComponent>
                    <ButtonItemComponent Text="Submit" Color={Color3.fromRGB(255, 255, 255)} Clicked={() => { }} />
                </SlimPopupButtonsComponent>
            </SlimPopupComponent>
        </PopupComponent>

        <TransparencyGroup visible={props.Visible} settings={settings}>
            <SubPageFrameComponent>
                <SubPageHeaderComponent title="Treasuries" description="Your treasuries and their respective financial audits." image="rbxassetid://11963361341">
                    <SubPageCloseButton Clicked={props.Closed}></SubPageCloseButton>
                </SubPageHeaderComponent>

                <TreasuriesOverviewPage Treasury={selectedTreasury ?? treasuries[0]} Visible={subMenu === SubmenuPages.Overview} OnPageChangeClicked={(page) => setSubmenu(page)}
                    Treasuries={treasuries}
                    OnTreasuryChanged={(id) => {
                        setSelectedTreasury(treasuries.find((treasury) => treasury.id === id));
                    }}
                    OnButtonClicked={(page) => setPopupOpen(page)}
                />

                <TreasuriesAuditsPage Treasury={selectedTreasury ?? treasuries[0]} Visible={subMenu === SubmenuPages.Audits} OnPageChangeClicked={(page) => setSubmenu(page)} />
                <TreasuriesSettingsPage Treasury={selectedTreasury ?? treasuries[0]} Visible={subMenu === SubmenuPages.Settings} OnPageChangeClicked={(page) => setSubmenu(page)} />
                <TreasuriesNoticePage Treasury={selectedTreasury ?? treasuries[0]} Visible={subMenu === SubmenuPages.Notices} OnPageChangeClicked={(page) => setSubmenu(page)} />
            </SubPageFrameComponent>
        </TransparencyGroup>
    </ContainerFrameComponent>
})

export default TreasuriesRoute;