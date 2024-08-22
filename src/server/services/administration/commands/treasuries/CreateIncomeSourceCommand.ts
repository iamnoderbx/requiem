import Commands, { CommandInteraction, CommandResponse, Permission } from "shared/utilities/decorators/CommandDecorators";

import { BasePlayerEntity } from "server/entities/player/BasePlayerEntity";
import { NumberCommandType } from "../../types/NumberCommandType";
import PlayerTreasuryService from "server/entities/player/services/treasuries/PlayerTreasuryService";
import { BaseEntity } from "server/entities/BaseEntity";
import TreasuryAPIServiceRunner from "server/entities/player/services/treasuries/TreasuryAPIServiceRunner";
import { IncomeSourceCommandType } from "../../types/IncomeSourceCommandType";
import { Treasuries } from "shared/Treasuries";
import { Treasury } from "shared/types/Treasury";

/**
 * ServerCreateIncomeSourceCommand
 * Kill a specified player.
 * 
 * @export ServerKillCommand
 * 
 * @author NodeSupport
 */
@Commands.Command({name : "createincome", description : "Add an income source to a given treasury."})
export class ServerCreateIncomeSourceCommand {
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
        {name : "type", description : "The type of income source to add.", type : IncomeSourceCommandType},
        {name : "level", description : "The level of the income source.", type : NumberCommandType}
    ])

    command(interaction: CommandInteraction, id : number | undefined, incomeSourceType : Treasury.IncomeSourceTypes[] | undefined, level : number | undefined) : CommandResponse {
        if(!id) return interaction.error("You must provide a treasury identifier.");
        if(!incomeSourceType || incomeSourceType.size() === 0) return interaction.error("You must provide an income source type.");
        if(!level) return interaction.error("You must provide an income source level.");
        
        const type_int = Treasury.IncomeSourceTypes[string.upper(tostring(incomeSourceType[0])) as keyof typeof Treasury.IncomeSourceTypes];
        if(!type_int) return interaction.error("Invalid income source type.");

        TreasuryAPIServiceRunner.addTreasuryIncomeSource(id, type_int, level, interaction.getSender().UserId)
        return interaction.reply(`Successfully added income source to treasury ${id}.`)
    }
}
