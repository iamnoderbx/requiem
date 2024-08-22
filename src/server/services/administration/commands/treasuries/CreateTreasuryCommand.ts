import Commands, { CommandInteraction, CommandResponse, Permission } from "shared/utilities/decorators/CommandDecorators";
import { BasePlayerEntity } from "server/entities/player/BasePlayerEntity";
import { NumberCommandType } from "../../types/NumberCommandType";
import PlayerTreasuryService from "server/entities/player/services/treasuries/PlayerTreasuryService";
import { BaseEntity } from "server/entities/BaseEntity";
import TreasuryAPIServiceRunner from "server/entities/player/services/treasuries/TreasuryAPIServiceRunner";
import { PlayerCommandType } from "../../types/PlayerCommandType";
import { LocationCommandType } from "../../types/LocationCommandType";
import { Locations } from "shared/types/Locations";
import { StringCommandType } from "../../types/StringCommandType";
import { Treasury } from "shared/types/Treasury";
import { Memory } from "shared/utilities/memory.utilities";
import { TreasuryCommandType } from "../../types/TreasuryCommandType";

/**
 * ServerCreateTreasuryCommand
 * Create a treasury.
 * 
 * @export ServerRemoveTreasuryMarcsCommand
 * 
 * @author NodeSupport
 */
@Commands.Command({name : "createtreasury", description : "Create a new treasury with provided information."})
export class ServerCreateTreasuryCommand {
    constructor() {}
    /**
     * The root executor for the command. No groups are needed.
     * 
     * @param interaction The command interaction.
     * @param player The player to kill.
     * 
     * @author NodeSupport
     */

    @Commands.Guard([Permission.Owner])
    @Commands.Arguments([
        {name : "name", description : "The name of the treasury. @notice<For spaces wrap in quotations.>", type : StringCommandType},
        {name : "owner", description : "The owner of the treasury.", type : PlayerCommandType},
        {name : "location", description : "The location to create the treasury.", type : LocationCommandType},
        {name : "type", description : "The type of treasury to create.", type : TreasuryCommandType},
    ])

    command(interaction: CommandInteraction, name : string | undefined, owners: BasePlayerEntity[] | undefined, location : Locations[] | undefined, typeIs: Treasury.Type[] | undefined) : CommandResponse {
        if(!name) return interaction.error("You must provide a name for the treasury.")
        if(!owners || owners.size() === 0) return interaction.error("You must provide an owner for the treasury.")
        if(location === undefined || location.size() === 0) return interaction.error("You must provide a location for the treasury.")
        if(typeIs === undefined || typeIs.size() === 0) return interaction.error("You must provide a type for the treasury.")

        const location_int = Locations[string.upper(tostring(location[0]!)!)! as keyof typeof Locations];
        const type_int = Treasury.Type[string.upper(tostring(typeIs[0]!)!)! as keyof typeof Treasury.Type];

        const owner = owners![0];

        TreasuryAPIServiceRunner.createTreasury(
            owner.getUserId(), type_int ?? Treasury.Type.PERSONAL, name, location_int ?? Locations.SHIGANSHINA,
        ).then((treasury) => {
            Memory.store(PlayerTreasuryService.memory, treasury.treasuryID, treasury);
        })

        owner.getTreasuryService().updatePlayerTreauries();
        return interaction.reply(`Successfully created treasury ${name} for ${owner.getName()}.`)
    }
}
