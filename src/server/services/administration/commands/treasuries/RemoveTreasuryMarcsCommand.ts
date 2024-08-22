import Commands, { CommandInteraction, CommandResponse, Permission } from "shared/utilities/decorators/CommandDecorators";
import { PlayerCommandType } from "../../types/PlayerCommandType";
import { StringCommandType } from "../../types/StringCommandType";
import { BasePlayerEntity } from "server/entities/player/BasePlayerEntity";
import { NumberCommandType } from "../../types/NumberCommandType";
import PlayerTreasuryService from "server/entities/player/services/treasuries/PlayerTreasuryService";
import { BaseEntity } from "server/entities/BaseEntity";
import TreasuryAPIServiceRunner from "server/entities/player/services/treasuries/TreasuryAPIServiceRunner";

/**
 * ServerRemoveTreasuryMarcsCommand
 * Kill a specified player.
 * 
 * @export ServerRemoveTreasuryMarcsCommand
 * 
 * @author NodeSupport
 */
@Commands.Command({name : "removemarcs", description : "Remove marcs from the given treasury identifier."})
export class ServerRemoveTreasuryMarcsCommand {
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
        {name : "treasury", description : "The number identifier of the treasury.", type : NumberCommandType},
        {name : "amount", description : "The amount of marcs being removed from the treasury.", type : NumberCommandType}
    ])

    command(interaction: CommandInteraction, id : number | undefined, amount : number | undefined) : CommandResponse {
        if(!id) return interaction.error("Invalid treasury identifier.");
        if(!amount) return interaction.error("Invalid amount of marcs.");

        const sender = BaseEntity.resolveEntityFromInstance<BasePlayerEntity>(interaction.getSender())!

        const treasury = PlayerTreasuryService.getTreasuryFromCache(id)
        
        if(treasury) treasury.removeMarcsFromTreasuryByUser(amount, sender)
        else TreasuryAPIServiceRunner.removeTreasuryMarcs(id, amount, sender.getUserId())

        return interaction.reply(`Successfully removed ${amount} marcs from treasury ${id}.`)
    }
}
