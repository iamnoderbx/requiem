import { Chat, TextService } from "@rbxts/services";
import { NetworkBubble } from "server/network/NetworkBubble";
import { Controller } from "shared/utilities/decorators/ServiceControllers";
import { NetworkEvent } from "shared/utilities/network/Events";

@Controller()
export default class ChatServiceRunner {
    public initialize() {
        const replicator = new NetworkBubble.Replicator(NetworkEvent.Chat);

        replicator.listen((player : Player, args : unknown[]) => {
            const message = args[0] as string;
            
            let TextFilterResult : TextFilterResult | undefined;

            const [success, response] = pcall(() => {
                TextFilterResult = TextService.FilterStringAsync(message, player.UserId);
            })

            if(!success || !TextFilterResult) return
            
            const filtered = TextFilterResult.GetChatForUserAsync(player.UserId);
            Chat.Chat(player.Character!.FindFirstChild("Head")! as BasePart, filtered)
        })
    }
}
