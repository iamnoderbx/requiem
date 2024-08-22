import Commands, { CommandInteraction, CommandResponse, Permission } from "shared/utilities/decorators/CommandDecorators";
import { PlayerCommandType } from "../../types/PlayerCommandType";
import { BasePlayerEntity } from "server/entities/player/BasePlayerEntity";
import { BlueprintCommandType } from "../../types/BlueprintCommandType";
import { Blueprint } from "shared/Blueprint";
/**
 * ServerAddBlueprintCommand
 * Add blueprints to a specified player.
 * 
 * @export ServerAddBlueprintCommand
 * 
 * @author NodeSupport
 */
@Commands.Command({name : "addblueprint", description : "Add blueprints to a user."})
export class ServerAddBlueprintCommand {
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
        {name : "player", description : "The player to give blueprint.", type : PlayerCommandType},
        {name : "blueprint", description : "The name of the blueprint. @notice<Specifiers such as @all supported.>", type : BlueprintCommandType}
    ])

    command(interaction: CommandInteraction, targets : BasePlayerEntity[], blueprints : string[]) : CommandResponse {
		if(!targets || targets.size() === 0) return interaction.error("Failed to add blueprints, player(s) were not specified.")
		if(!blueprints || blueprints.size() === 0) return interaction.error("Failed to add blueprints, blueprint(s) were not specified.")

		const ids : number[] = []

		blueprints.forEach((name) => {
			const id = Blueprint.BlueprintLookupEnum[string.upper(name) as keyof typeof Blueprint.BlueprintLookupEnum]
			if(id === undefined) return interaction.error("Failed to add blueprint, the blueprint does not exist.")

			ids.push(id);
		})

		targets.forEach((target) => {
			target.getPlotService().addGroupsOfBlueprintsToPlayer(ids)
		});

        return interaction.reply(`Successfully added ${ids.size()} blueprints to ${targets.size()} player(s).`)
    }
}
