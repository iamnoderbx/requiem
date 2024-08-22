import Commands, { CommandInteraction, CommandResponse, Permission } from "shared/utilities/decorators/CommandDecorators";
import { PlayerCommandType } from "../../types/PlayerCommandType";
import { StringCommandType } from "../../types/StringCommandType";
import { BasePlayerEntity } from "server/entities/player/BasePlayerEntity";
import { GenderCommandType } from "../../types/GenderCommandType";
import { NumberCommandType } from "../../types/NumberCommandType";
import { Animals } from "shared/Animals";
import { AnimalColorCommandType } from "../../types/AnimalColorCommandType";

/**
 * ServerHorseCommand
 * Give a specific player a horse.
 * 
 * @export ServerHorseCommand
 * 
 * @author NodeSupport
 */
@Commands.Command({name : "addhorse", description : "Adds a horse to the players collection."})
export class ServerHorseCommand {
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
        {name : "player", description : "The player you wish to give a horse.", type : PlayerCommandType},
        {name : "name", description : "The horses name to give. @notice<For spaces use quotations.>", type : StringCommandType},
        {name : "gender", description: "The gender of the horse. @notice<Male, Female.>", type : GenderCommandType},
        {name : "color", description : "The color of the horse. @notice<Brown, White, Black, Grey>", type : AnimalColorCommandType},
        {name : "runspeed", description : "The run speed of the horse. @notice<Number from 0 to 100.>", type : NumberCommandType},
        {name : "turnspeed", description : "The turn speed of the horse. @notice<Number from 0 to 100.>", type : NumberCommandType},
        {name : "jumppower", description : "The jump power of the horse. @notice<Number from 0 to 100.>", type : NumberCommandType},
        {name : "stamina", description : "The stamina of the horse. @notice<Number from 0 to 100.>", type : NumberCommandType},
        {name : "health", description : "The health of the horse. @notice<Number from 0 to 100.>", type : NumberCommandType}
    ])

    command(
        interaction: CommandInteraction, 
        targets : BasePlayerEntity[] | undefined, 
        name : string | undefined, 
        gender?: ["male" | "female"] | undefined, 
        color?: ["white", "black", "grey", "brown"], 
        ...stats : unknown[]
    ) : CommandResponse {
        targets?.forEach((target) => {
            target.getHorseService().add(
                name ?? "Unnamed",
                color ? color[0] as Animals.Color : Animals.Color.Brown, 
                gender ? gender[0] === "male" ? Animals.Gender.Male : Animals.Gender.Female : Animals.Gender.Male,
                {
                    [Animals.Statistics.RunSpeed] : stats[0] as number,
                    [Animals.Statistics.TurnSpeed] : stats[1] as number,
                    [Animals.Statistics.JumpPower] : stats[2] as number,
                    [Animals.Statistics.Stamina] : stats[3] as number,
                    [Animals.Statistics.Health] : stats[4] as number
                }
            )
        })

        return interaction.reply("Successfully added the horse to the players collection.")
    }
}
