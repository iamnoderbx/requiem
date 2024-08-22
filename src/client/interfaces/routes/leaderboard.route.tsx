import Roact from "@rbxts/roact";

import { LeaderboardHolderComponent } from "../components/leaderboard/holder.component";
import { LeaderboardInformationComponent } from "../components/leaderboard/information.component";
import { Players } from "@rbxts/services";
import { useStateSelector } from "../management/InterfaceSelector";
import { Memory } from "shared/utilities/memory.utilities";
import { LeaderboardSharedSelectors } from "selectors/LeaderboardSharedSelectors";
import { TeamUtilities, Teams } from "shared/types/Teams";

import LeaderboardListComponent from "../components/leaderboard/list.component";
import LeaderboardPlayerComponent from "../components/leaderboard/player.component";
import LeaderboardTeamComponent from "../components/leaderboard/team.component";
import { States } from "client/entities/player/ClientPlayerStates";

export const leaderboard = Memory.createEmptySubscription("leaderboard");

export default function LeaderboardRoute() : Roact.Element {
    const username = Players.LocalPlayer.Name;
    
    // Array [userid, team]
    const users = useStateSelector(leaderboard, LeaderboardSharedSelectors.getLeaderboardPlayerList, true);
    const client = users.find(([userid]) => userid === Players.LocalPlayer.UserId);

    if(!client) return <></>

    let isScoutsDrawn = false;
    let isStationaryDrawn = false;
    let isPoliceDrawn = false;
    let isCivilianDrawn = false;

    // Check if the leaderboard interface is hidden.
    const isHidden = useStateSelector(States.States.subscription("hide_leaderboard"), (state) => {
        return state.get();
    })

    return <LeaderboardHolderComponent Visible={!isHidden ?? false}>
        <LeaderboardInformationComponent 
            health={100} maxhealth={100}
            icon={TeamUtilities.getTeamIcon(client[1])}
            username = {username}
        />

        <LeaderboardListComponent>
            {users.map(([userid, team], index) => {
                if(!isScoutsDrawn && team === Teams.SCOUTING_LEGION) isScoutsDrawn = true;
                if(!isStationaryDrawn && team === Teams.STATIONARY_GUARD) isStationaryDrawn = true
                if(!isPoliceDrawn && team === Teams.MILITARY_POLICE) isPoliceDrawn = true;
                if(!isCivilianDrawn && team === Teams.CIVILIAN) isCivilianDrawn = true;
                //if(!isStaffDrawn && team === Teams.STAFF) isStaffDrawn = true;

                return <LeaderboardPlayerComponent 
                    team={team}
                    index={index}
                    username={Players.GetPlayerByUserId(userid)?.Name || "Unknown"}
                />
            })}

            <LeaderboardTeamComponent team={Teams.STATIONARY_GUARD} visible={isStationaryDrawn} />
            <LeaderboardTeamComponent team={Teams.SCOUTING_LEGION} visible={isScoutsDrawn} />
            <LeaderboardTeamComponent team={Teams.MILITARY_POLICE} visible={isPoliceDrawn} />
            <LeaderboardTeamComponent team={Teams.CIVILIAN} visible={isCivilianDrawn} />
        </LeaderboardListComponent>
    </LeaderboardHolderComponent>
}