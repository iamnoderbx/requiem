import { useAsyncEffect } from "@rbxts/pretty-roact-hooks";
import { useEffect, useState, withHooks } from "@rbxts/roact-hooked";
import { Players } from "@rbxts/services";
import { BaseEntity } from "client/entities/BaseEntity";
import { ClientBranchMemberSubscription, ClientBranchSubscription } from "client/entities/player/ClientPlayerEntity";
import EntryButtonComponent from "client/interfaces/components/entries/entry.button.component";
import EntryComponent from "client/interfaces/components/entries/entry.component";
import EntryLabelComponent from "client/interfaces/components/entries/entry.label.component";
import EntryLeftLayoutComponent from "client/interfaces/components/entries/entry.left.layout.component";
import EntryPillComponent from "client/interfaces/components/entries/entry.pill.component";
import EntryRightButtonsLayoutComponent from "client/interfaces/components/entries/entry.right.buttons.layout.component";
import EntryStringComponent from "client/interfaces/components/entries/input/entry.string.component";
import EntrySliderBarComponent from "client/interfaces/components/entries/slider/entry.slider.bar.component";
import EntrySliderComponent from "client/interfaces/components/entries/slider/entry.slider.component";
import { ListLayoutConstraint, VerticalListLayout } from "client/interfaces/components/lists/list.container.component";
import BranchDetachmentListComponent from "client/interfaces/components/menu/other/branch/branch.detachment.list.component";
import BranchDropdownComponent from "client/interfaces/components/menu/other/branch/branch.dropdown.component";
import BranchHeaderComponent from "client/interfaces/components/menu/other/branch/branch.header.component";
import BranchManageMemberComponent from "client/interfaces/components/menu/other/branch/branch.manage.member.component";
import BranchMemberEditButtonComponent from "client/interfaces/components/menu/other/branch/branch.member.edit.component";
import BranchMemberPreviewComponent from "client/interfaces/components/menu/other/branch/branch.member.preview.component";
import BranchMembersComponent, { BranchManageMembersGridComponent, BranchMemberGridComponent, BranchMemberHeaderComponent, BranchMemberPaginationComponent, BranchMemberSearchBarComponent } from "client/interfaces/components/menu/other/branch/branch.members.component";
import BranchSelfComponent from "client/interfaces/components/menu/other/branch/branch.self.component";
import BranchShoutComponent from "client/interfaces/components/menu/other/branch/branch.shout.component";
import PopupComponent, { PopupListConstraints, PopupListLayout } from "client/interfaces/components/popups/popup.component";
import SlimPopupComponent, { SlimPopupButtonsComponent } from "client/interfaces/components/popups/slim.popup.component";
import SmallPopupComponent from "client/interfaces/components/popups/small.popup.component";
import ButtonListComponents, { ButtonItemComponent } from "client/interfaces/components/progress/buttons.component";
import ProgressBarComponent from "client/interfaces/components/progress/progress.bar.component";
import SubPageHeaderComponent, { SubPageCloseButton } from "client/interfaces/components/submenus/header.submenu.component";
import { StickySubPageTabComponent, StickyTabComponent } from "client/interfaces/components/submenus/tabs.submenu.component";
import DropSelectionComponent from "client/interfaces/components/utilities/drop.selection.component";
import ContainerFrameComponent, { BasicScalingComponent, SubPageFrameComponent, SubPageScrollComponent } from "client/interfaces/components/utilities/frame.component";
import { InputColorLabelComponent, InputTextboxLabelComponent } from "client/interfaces/components/utilities/input.component";
import { SimpleItemListButtonComponent } from "client/interfaces/components/utilities/item.list.component";
import TransparencyGroup, { useTransparencyGroup } from "client/interfaces/components/utilities/transparency.group";
import { useStateSelector } from "client/interfaces/management/InterfaceSelector";
import Roact from "client/interfaces/management/vendors/Roact";
import { Toasts } from "client/interfaces/routes/toasts.route";
import { BranchMemberData } from "selectors/BranchMemberSelector";
import { BranchData } from "selectors/BranchSharedSelectors";
import { Animals } from "shared/Animals";
import { Branches } from "shared/Branches";
import { Color } from "shared/utilities/color.utilities";
import { Memory } from "shared/utilities/memory.utilities";
import { BranchMemberActions, PlayerActions } from "shared/utilities/network/Events";
import { String } from "shared/utilities/string.utilities";

const BRANCH_RANKS: string[] = [];
BRANCH_RANKS.push("Everyone");

const AUDIT_TYPES: string[] = [];
AUDIT_TYPES.push("No Filter");

// For loop from 1 to 12.
for (let i = 1; i <= 12; i++) {
    const rank = Branches.BranchRank[i];
    BRANCH_RANKS.push(String.CapitalizeAllFirstLetters(string.lower(rank)));
};

for (let i = 1; i <= 10; i++) {
    const audit = Branches.AuditTypes[i];
    AUDIT_TYPES.push(String.CapitalizeAllFirstLetters(string.lower(audit)));
}

const RANKS_WITHOUT_EVERYONE = [...BRANCH_RANKS];
RANKS_WITHOUT_EVERYONE.shift();

enum BranchPage {
    Overview,
    Detachments,
    Management,
}

enum BranchManagePage {
    Members,
    Acceptances,
    Audits,
    Detachments,
}

const ManageAcceptancesBranchRoute = withHooks((props: { Visible: boolean, Branch?: BranchData, Member?: BranchMemberData }) => {
    useEffect(() => {
        if (!props.Visible) return;

        BaseEntity.resolveClientEntity().then((client) => {
            client.network.action(PlayerActions.Branch, BranchMemberActions.Action, "Transfers")
        })
    }, [props.Visible])

    return <ContainerFrameComponent Size={UDim2.fromScale(0.955, 1)} Visible={props.Visible}>
        <VerticalListLayout />
        <EntrySliderComponent Header="Graduation Score" Body="The required score in the Trainee Corps to join the branch">
            <EntrySliderBarComponent Value={50} Maximum={100} Prefix="Required Score" Changed={(value) => {

            }} />
        </EntrySliderComponent>

        <EntryStringComponent Placeholder="Type a name to request a transfer to your branch." Description="Request a transfer of a member from a different branch." Changed={(username) => {
            const user_id = Players.GetUserIdFromNameAsync(username);
            if (!user_id) return Toasts.failed("The user " + username + " does not exist.")

            const real_username = Players.GetNameFromUserIdAsync(user_id);
            if (!real_username) return Toasts.failed("The user " + username + " does not exist.")

            Toasts.info("Sent a request to " + real_username + " to join your branch.")

            BaseEntity.resolveClientEntity().then((client) => {
                client.network.action(PlayerActions.Branch, BranchMemberActions.Action, "Request Transfer", user_id)
            })
        }} />

        {props.Branch?.transfers.map((transfer) => {
            return <EntryComponent>
                <EntryLeftLayoutComponent>
                    <EntryPillComponent Text={transfer.target_branch_id === props.Branch?.id ? "Outgoing Request" : "Incoming Request"} Color={Color3.fromRGB(255, 255, 255)} />
                    <EntryPillComponent Text={transfer.target_branch_id === props.Branch?.id ? Branches.cleanBranchFromId(transfer.current_branch_id) : Branches.cleanBranchFromId(transfer.target_branch_id)} Color={Color3.fromRGB(255, 255, 255)} />
                    <EntryLabelComponent
                        Text={
                            transfer.target_branch_id === props.Branch?.id ? Players.GetNameFromUserIdAsync(transfer.user_id) + ' <font transparency="0.5">is awaiting acceptance to be transferred from the ' + Branches.cleanBranchFromId(transfer.current_branch_id) + '.</font>' :
                                Players.GetNameFromUserIdAsync(transfer.user_id) + ' <font transparency="0.5">is being requested to transfer to the ' + Branches.cleanBranchFromId(transfer.target_branch_id) + '.</font>'
                        }
                    />
                </EntryLeftLayoutComponent>

                <EntryRightButtonsLayoutComponent>
                    {transfer.current_branch_id === props.Branch?.id && <EntryButtonComponent Text="Accept Transfer" Color={Color3.fromRGB(194, 222, 194)} Clicked={() => {
                        BaseEntity.resolveClientEntity().then((client) => {
                            Toasts.info("Sent a request to accept the transfer of " + Players.GetNameFromUserIdAsync(transfer.user_id) + ".")
                            client.network.action(PlayerActions.Branch, BranchMemberActions.Action, "Accept Transfer", transfer.user_id)
                        })
                    }} />}
                    <EntryButtonComponent Text={transfer.current_branch_id === props.Branch?.id ? "Reject Transfer" : "Withdraw Request"} Color={Color3.fromRGB(255, 85, 85)} Clicked={() => {
                        BaseEntity.resolveClientEntity().then((client) => {
                            Toasts.info("Sent a request to delete the transfer of " + Players.GetNameFromUserIdAsync(transfer.user_id) + ".")
                            client.network.action(PlayerActions.Branch, BranchMemberActions.Action, "Delete Transfer", transfer.user_id)
                        })
                    }} />
                </EntryRightButtonsLayoutComponent>
            </EntryComponent>
        })}
    </ContainerFrameComponent>
})

const ViewAuditLogsBranchRoute = withHooks((props: { Visible: boolean, Branch?: BranchData, Member?: BranchMemberData }) => {
    useEffect(() => {
        if (!props.Visible) return;

        BaseEntity.resolveClientEntity().then((client) => {
            client.network.action(PlayerActions.Branch, BranchMemberActions.Audits)
        })

    }, [props.Visible])

    const audits = props.Member?.audits.page ?? []

    return <ContainerFrameComponent Size={UDim2.fromScale(0.955, 1)} Visible={props.Visible} Position={UDim2.fromOffset(0, 5)}>
        <VerticalListLayout Padding={4} HorizontalAlignment={Enum.HorizontalAlignment.Right} />
        <BranchMemberHeaderComponent Alignment={Enum.HorizontalAlignment.Right}>
            <BranchMemberPaginationComponent
                Page={props.Member?.audits.current ?? 0}
                OnPageChanged={(frame, page, change) => {
                    if ((!props.Member?.audits.hasNext) && change === 1) return;
                    if (page === -1) return;

                    BaseEntity.resolveClientEntity().then((client) => {
                        client.network.action(PlayerActions.Branch, BranchMemberActions.AuditsPagination, page)
                    })
                }}
            />
            {/** The dropdown for selecting branch members */}
            <BranchDropdownComponent
                OnSelected={(selection) => {
                    BaseEntity.resolveClientEntity().then((client) => {
                        client.network.action(PlayerActions.Branch, BranchMemberActions.AuditsFilter, Branches.getAuditFromCleanString(selection) ?? 0)
                    })
                }}
                Default={"No Filter"}
                Selections={AUDIT_TYPES}
                Visible={true}
            />
        </BranchMemberHeaderComponent>

        {audits.map((audit) => {
            return <EntryComponent>

                <EntryLeftLayoutComponent>
                    <EntryPillComponent Text={Players.GetNameFromUserIdAsync(audit.user_id)} Color={Color3.fromRGB(255, 255, 255)} />
                    <EntryPillComponent Text={String.CapitalizeAllFirstLetters(string.lower(Branches.AuditTypes[audit.log_id]))} Color={Color3.fromRGB(255, 255, 255)} />
                    <EntryPillComponent Text={String.ConvertSQLTimestamp(audit.log_timestamp)} Color={Color3.fromRGB(255, 255, 255)} />
                    <EntryLabelComponent Text={audit.log_reason} Transparency={0.6} />
                </EntryLeftLayoutComponent>

            </EntryComponent>
        })}
    </ContainerFrameComponent>
});

const ManageDetachmentsBranchRoute = withHooks((props: { Visible: boolean, Branch?: BranchData, Member?: BranchMemberData, OnCreateDetachment: () => void }) => {
    return <ContainerFrameComponent Size={UDim2.fromScale(0.955, 1)} Visible={props.Visible}>
        <VerticalListLayout />
        <SimpleItemListButtonComponent Header="Branch Detachments" Body="Click here to create a new detachment." Visible={props.Visible} Clicked={() => {
            props.OnCreateDetachment()
        }} />

        {props.Branch?.detachments.map((detachment) => {
            return <BranchDetachmentListComponent Detachment={detachment}
                Deleted={() => {
                    BaseEntity.resolveClientEntity().then((client) => {
                        client.network.action(PlayerActions.Branch, BranchMemberActions.Action, "Delete Detachment", detachment.detachment_id)
                    })
                }}
            />
        })}
    </ContainerFrameComponent>
});

const ManageMembersBranchRoute = withHooks((props: { Visible: boolean, Branch?: BranchData, Member?: BranchMemberData }) => {
    const memberPagination = props.Member?.pagination.page ?? [];

    const [rankFilterSelection, setRankFilterSelection] = useState<string>();

    const [target, setTarget] = useState<number>();
    const [editOpen, setEditOpen] = useState(false);

    const [detachmentTarget, setDetachmentTarget] = useState<number>();
    const [updateDetachmentOpen, setUpdateDetachmentOpen] = useState(false);

    const [detachmentNames, setDetachmentNames] = useState<string[]>([]);

    useEffect(() => {
        if (!props.Visible || !props.Branch || !props.Member) return;

        BaseEntity.resolveClientEntity().then((client) => {
            client.network.action(PlayerActions.Branch, BranchMemberActions.Limit, 9)
        })
    }, [props.Visible]);

    useEffect(() => {
        const detachmentNames = ["None"]

        props.Branch?.detachments.forEach((detachment) => {
            detachmentNames.push(detachment.detachment_name);
        });

        setDetachmentNames(detachmentNames);
    }, [props.Branch?.detachments]);

    // Filter the RANKS_WITHOUT_EVERYONE to remove any indexes
    // that are higher then the members rank
    const memberRank = props.Member?.rank_id ?? 0;
    const results = RANKS_WITHOUT_EVERYONE.filter((_, index) => index < (memberRank - 1));

    return <>
        <BranchMembersComponent Visible={props.Visible && memberPagination.size() <= 9} Size={UDim2.fromScale(0.962, 0.824)}>
            <BranchMemberHeaderComponent>
                {/** The pagination and page swapping for branch members */}
                <BranchMemberPaginationComponent
                    Page={props.Member?.pagination.current ?? 0}
                    OnPageChanged={(frame, page, change) => {
                        if ((!props.Member?.pagination.hasNext) && change === 1) return;
                        if (page === -1) return;

                        BaseEntity.resolveClientEntity().then((client) => {
                            client.network.action(PlayerActions.Branch, BranchMemberActions.Pagination, page)
                        })
                    }}
                />
                {/** The search bar for branch members */}
                <BranchMemberSearchBarComponent
                    OnSearchRequest={(name) => {
                        BaseEntity.resolveClientEntity().then((client) => {
                            client.network.action(PlayerActions.Branch, BranchMemberActions.Search, name)
                        })
                    }}
                />
                {/** The dropdown for selecting branch members */}
                <BranchDropdownComponent
                    OnSelected={(selection) => {
                        BaseEntity.resolveClientEntity().then((client) => {
                            client.network.action(PlayerActions.Branch, BranchMemberActions.Filter, selection)
                        })
                    }}
                    Default={"Everyone"}
                    Selections={BRANCH_RANKS}
                    Visible={true}
                />
            </BranchMemberHeaderComponent>

            <BranchManageMembersGridComponent>
                {props.Visible && memberPagination.map((member) => {
                    return <BranchManageMemberComponent Rank={member.rank_id} Username={member.username} UserId={member.user_id} Detachment={member.detachment} Visible={props.Visible}
                        DetachmentClicked={(button) => {
                            if (member.user_id === (Players.LocalPlayer.UserId ?? 0)) return;
                            if (member.rank_id >= (props.Member?.rank_id ?? 0)) return;

                            (button.Parent! as Frame).ZIndex = !updateDetachmentOpen ? 5 : 1

                            setDetachmentTarget(member.user_id)
                            setUpdateDetachmentOpen(!updateDetachmentOpen);
                        }}
                    >
                        <BranchDropdownComponent
                            OnSelected={(selection) => {
                                if (selection === "Everyone") setRankFilterSelection(undefined);
                                else setRankFilterSelection(selection);

                                BaseEntity.resolveClientEntity().then((client) => {
                                    Toasts.info("Sent a rank change request to " + member.username + " to " + selection + ".")
                                    client.network.action(PlayerActions.Branch, BranchMemberActions.Rank, selection, member.user_id)
                                })
                            }}

                            Default={Branches.getRankFromId(member.rank_id)}
                            Override={Branches.getRankFromId(member.rank_id)}

                            Selections={results} // Remove the first element.

                            Position={UDim2.fromScale(0.497, 0.779)}
                            Size={UDim2.fromScale(0.953, 0.247)}
                            Visible={member.rank_id < (props.Member?.rank_id ?? 0)}
                        />

                        <DropSelectionComponent Options={["Exile User", "Warn User"]} Position={UDim2.fromScale(0.605, 0.315)} Visible={editOpen && target === member.user_id} Width={0.395} Color={Color3.fromRGB(50, 62, 95)}
                            Selected={(button, selection) => {
                                setEditOpen(false);
                                (button.Parent!.Parent!.Parent as Frame).ZIndex = 1

                                BaseEntity.resolveClientEntity().then((client) => {
                                    Toasts.info("Sent a request to " + string.lower(selection) + ".")
                                    client.network.action(PlayerActions.Branch, BranchMemberActions.Action, selection, member.user_id)
                                })
                            }}
                        />

                        <DropSelectionComponent Options={detachmentNames} Position={UDim2.fromScale(-0.1, 0.57)} Visible={updateDetachmentOpen && detachmentTarget === member.user_id} Width={0.55} Color={Color3.fromRGB(50, 62, 95)}
                            Selected={(button, selection) => {
                                setUpdateDetachmentOpen(false);

                                const frame = button.Parent!.Parent!.Parent as Frame
                                frame.ZIndex = 1;

                                const detachment = props.Branch?.detachments.find((detachment) => detachment.detachment_name === selection);

                                const pill = frame.FindFirstChild("detachment_pill") as TextLabel
                                pill.Text = selection;
                                pill.BackgroundColor3 = (!detachment || detachment?.detachment_id === -1) ? Color3.fromRGB(69, 69, 69) : new Color3(detachment.r, detachment.g, detachment.b)

                                BaseEntity.resolveClientEntity().then((client) => {
                                    Toasts.info("Sent a request to set user to " + selection + ".")
                                    client.network.action(PlayerActions.Branch, BranchMemberActions.Action, "Set User Detachment", member.user_id, selection)
                                })
                            }}
                        />

                        <BranchMemberEditButtonComponent Visible={member.rank_id < (props.Member?.rank_id ?? 0)}
                            Clicked={(button) => {
                                if (target === member.user_id && editOpen) return setEditOpen(false);
                                setTarget(member.user_id); setEditOpen(true);
                                (button.Parent!.Parent! as Frame).ZIndex = 5
                            }}
                        />
                    </BranchManageMemberComponent>
                })}
            </BranchManageMembersGridComponent>
        </BranchMembersComponent>
    </>
});

const ManageBranchRoute = withHooks((props: { Visible: boolean, Branch?: BranchData, Member?: BranchMemberData, OnCreateDetachment: () => void }) => {
    // useTransparencyGroup is a custom hook that returns a transparency binding and its settings.
    const [transparency, settings] = useTransparencyGroup({
        visible: props.Visible, tween: new TweenInfo(0.4),
        delay: props.Visible ? 0.1 : undefined
    });

    const [page, setPage] = useState<BranchManagePage>(BranchManagePage.Members);

    let totalTabsVisible = 0;
    if ((props.Member?.rank_id ?? 0) >= Branches.BranchRank.LIEUTENANT) totalTabsVisible = totalTabsVisible + 2
    if ((props.Member?.rank_id ?? 0) >= Branches.BranchRank.ASSISTANT_COMMANDER) totalTabsVisible = totalTabsVisible + 2

    return <TransparencyGroup visible={props.Visible} settings={settings}>
        <BasicScalingComponent Visible={props.Visible} />

        <SubPageScrollComponent Size={UDim2.fromScale(0.961, 0.797)} Position={UDim2.fromScale(0.5, 0.167)} Centered={true}>
            <StickySubPageTabComponent Count={totalTabsVisible} Size={UDim2.fromScale(0.959, 0.053)} Ratio={27.085}>
                <StickyTabComponent Header="Manage Members" Clicked={() => setPage(BranchManagePage.Members)} Selected={page === BranchManagePage.Members} Visible={(props.Member?.rank_id ?? 0) >= Branches.BranchRank.LIEUTENANT} />
                <StickyTabComponent Header="Manage Detachments" Clicked={() => setPage(BranchManagePage.Detachments)} Selected={page === BranchManagePage.Detachments} Visible={(props.Member?.rank_id ?? 0) >= Branches.BranchRank.ASSISTANT_COMMANDER} />
                <StickyTabComponent Header="Manage Acceptances" Clicked={() => setPage(BranchManagePage.Acceptances)} Selected={page === BranchManagePage.Acceptances} Visible={(props.Member?.rank_id ?? 0) >= Branches.BranchRank.ASSISTANT_COMMANDER} />
                <StickyTabComponent Header="View Audits" Clicked={() => setPage(BranchManagePage.Audits)} Selected={page === BranchManagePage.Audits} Visible={(props.Member?.rank_id ?? 0) >= Branches.BranchRank.LIEUTENANT} />
            </StickySubPageTabComponent>

            <ManageMembersBranchRoute Visible={page === BranchManagePage.Members && props.Visible} Branch={props.Branch} Member={props.Member} />
            <ManageDetachmentsBranchRoute Visible={page === BranchManagePage.Detachments && props.Visible} Branch={props.Branch} Member={props.Member} OnCreateDetachment={props.OnCreateDetachment} />
            <ManageAcceptancesBranchRoute Visible={page === BranchManagePage.Acceptances && props.Visible} Branch={props.Branch} Member={props.Member} />
            <ViewAuditLogsBranchRoute Visible={page === BranchManagePage.Audits && props.Visible} Branch={props.Branch} Member={props.Member} />
        </SubPageScrollComponent>
    </TransparencyGroup>
});

const GeneralOverviewRoute = withHooks((props: { Visible: boolean, Branch?: BranchData, Member?: BranchMemberData }) => {
    // useTransparencyGroup is a custom hook that returns a transparency binding and its settings.
    const [transparency, settings] = useTransparencyGroup({
        visible: props.Visible, tween: new TweenInfo(0.4),
        delay: props.Visible ? 0.1 : undefined
    });

    const [commander, setCommander] = useState<string>("");

    useAsyncEffect(async () => {
        if (!props.Branch) return;

        if (props.Branch.commander === 0) {
            setCommander("Vacant Commander");
        } else {
            const username = Players.GetNameFromUserIdAsync(props.Branch.commander)
            setCommander("Commanded by " + username);
        }
    }, [props.Branch?.commander]);

    useEffect(() => {
        if (!props.Visible) return;

        BaseEntity.resolveClientEntity().then((client) => {
            client.network.action(PlayerActions.Branch, BranchMemberActions.Limit, 20)
        })
    }, [props.Visible]);

    const personnel = props.Branch?.member_count;
    const memberPagination = props.Member?.pagination.page;

    return <TransparencyGroup visible={props.Visible} settings={settings}>
        <BasicScalingComponent Visible={props.Visible} />

        <SubPageScrollComponent Size={UDim2.fromScale(0.961, 0.797)} Position={UDim2.fromScale(0.5, 0.167)} Centered={true}>
            <BranchHeaderComponent Icon={props.Branch?.icon ?? ""} Name={props.Branch?.name ?? "None"} Commander={commander} Personnel={personnel ?? 0} />
            <BranchSelfComponent Rank={props.Member?.rank ?? "Unranked"} Detachment={props.Member?.detachment.detachment_name ?? "None"} />
            <BranchShoutComponent Shout={props.Branch?.shout ?? "None"} />

            <BranchMembersComponent>
                <BranchMemberHeaderComponent>
                    {/** The pagination and page swapping for branch members */}
                    <BranchMemberPaginationComponent
                        Page={props.Member?.pagination.current ?? 0}
                        OnPageChanged={(frame, page, change) => {
                            if ((!props.Member?.pagination.hasNext) && change === 1) return;
                            if (page === -1) return;

                            BaseEntity.resolveClientEntity().then((client) => {
                                client.network.action(PlayerActions.Branch, BranchMemberActions.Pagination, page)
                            })
                        }}
                    />
                    {/** The search bar for branch members */}
                    <BranchMemberSearchBarComponent
                        OnSearchRequest={(name) => {
                            BaseEntity.resolveClientEntity().then((client) => {
                                client.network.action(PlayerActions.Branch, BranchMemberActions.Search, name)
                            })
                        }}
                    />
                    {/** The dropdown for selecting branch members */}
                    <BranchDropdownComponent
                        OnSelected={(selection) => {
                            BaseEntity.resolveClientEntity().then((client) => {
                                client.network.action(PlayerActions.Branch, BranchMemberActions.Filter, selection)
                            })
                        }}
                        Default="Everyone"
                        Selections={BRANCH_RANKS}
                        Visible={true}
                    />
                </BranchMemberHeaderComponent>
                <BranchMemberGridComponent>
                    {memberPagination?.map((member) => {
                        return <BranchMemberPreviewComponent Username={member.username} UserId={member.user_id} Detachment={member.detachment} Visible={props.Visible} />
                    })}
                </BranchMemberGridComponent>
            </BranchMembersComponent>
        </SubPageScrollComponent>
    </TransparencyGroup>
});

const BranchRoute = withHooks((props: { Visible: boolean, Closed: () => void }) => {
    // useTransparencyGroup is a custom hook that returns a transparency binding and its settings.
    const [transparency, settings] = useTransparencyGroup({
        visible: props.Visible, tween: new TweenInfo(0.4),
        delay: props.Visible ? 0.1 : undefined
    });

    const [page, setPage] = useState<BranchPage>(BranchPage.Overview);

    // A selector that returns the player's enchantments.
    const branch = useStateSelector(Memory.getSubscription<BranchData>(ClientBranchSubscription), (state) => {
        return state.get();
    });

    const member = useStateSelector(Memory.getSubscription<BranchMemberData>(ClientBranchMemberSubscription), (state) => {
        return state.get();
    });

    const [createDetachment, setCreateDetachment] = useState(false);

    const [createDetachmentName, setCreateDetachmentName] = useState<string>();
    const [createDetachmentAbbreviation, setCreateDetachmentAbbreviation] = useState<string>();
    const [createDetachmentColor, setCreateDetachmentColor] = useState(Color.random());

    return <ContainerFrameComponent>
        <PopupComponent Visible={createDetachment} Color={Color3.fromRGB(94, 94, 94)}>
            <SlimPopupComponent
                Header={"Create Detachment"}
                Body={"Specify your new detachment details."}
                Visible={createDetachment}
                Closed={() => setCreateDetachment(false)}
                Color={Color3.fromRGB(255, 255, 255)}
                Offset={-0.125}
            >
                <PopupListLayout Padding={0.18} />
                <InputTextboxLabelComponent Label="Detachment Name" Changed={(name) => setCreateDetachmentName(name)} Color={Color3.fromRGB(255, 255, 255)} />
                <InputTextboxLabelComponent Label="Abbreviation" Changed={(abbreviation) => setCreateDetachmentAbbreviation(abbreviation)} Color={Color3.fromRGB(255, 255, 255)} />
                <InputColorLabelComponent Changed={(color) => setCreateDetachmentColor(color)} Color={Color3.fromRGB(255, 255, 255)} Default={createDetachmentColor} />
                <SlimPopupButtonsComponent>
                    <ButtonItemComponent Text="Submit" Color={Color3.fromRGB(255, 255, 255)} Clicked={() => {
                        setCreateDetachment(false);

                        BaseEntity.resolveClientEntity().then((client) => {
                            client.network.action(
                                PlayerActions.Branch, BranchMemberActions.Action,
                                "Create Detachment", 0,
                                createDetachmentName, createDetachmentAbbreviation, createDetachmentColor
                            )

                            setCreateDetachmentName(undefined);
                            setCreateDetachmentAbbreviation(undefined);
                            setCreateDetachmentColor(Color.random());
                        })
                    }} />
                </SlimPopupButtonsComponent>
            </SlimPopupComponent>
        </PopupComponent>

        <TransparencyGroup visible={props.Visible} settings={settings}>
            <SubPageFrameComponent>
                <SubPageHeaderComponent title="Military Branch" description="Your military branch and information about it." image="rbxassetid://11432832657">
                    <SubPageCloseButton Clicked={props.Closed}></SubPageCloseButton>
                </SubPageHeaderComponent>

                <StickySubPageTabComponent Count={(member?.rank_id ?? 0) >= Branches.BranchRank.LIEUTENANT ? 2 : 1}>
                    <StickyTabComponent Header="General Overview" Clicked={() => setPage(BranchPage.Overview)} Selected={page === BranchPage.Overview} />
                    {/* <StickyTabComponent Header="Branch Detachments" Clicked={() => setPage(BranchPage.Detachments)} Selected={page === BranchPage.Detachments} /> */}
                    <StickyTabComponent Header="Branch Management" Clicked={() => setPage(BranchPage.Management)} Selected={page === BranchPage.Management} Visible={(member?.rank_id ?? 0) >= Branches.BranchRank.LIEUTENANT} />
                </StickySubPageTabComponent>

                <GeneralOverviewRoute Visible={page === BranchPage.Overview && props.Visible} Branch={branch} Member={member} />
                <ManageBranchRoute Visible={page === BranchPage.Management && props.Visible} Branch={branch} Member={member}
                    OnCreateDetachment={() => setCreateDetachment(true)}
                />
            </SubPageFrameComponent>
        </TransparencyGroup>
    </ContainerFrameComponent>
})

export default BranchRoute;