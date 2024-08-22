import Roact from "@rbxts/roact";
import ChatComponent from "../components/chat/chat.component";
import { useEffect, useMutable } from "@rbxts/roact-hooked";
import { useKeyPress } from "@rbxts/pretty-roact-hooks";
import { RunService } from "@rbxts/services";
import { NetworkBubble } from "client/network/ClientBubbles";
import { NetworkEvent } from "shared/utilities/network/Events";
import { States } from "client/entities/player/ClientPlayerStates";
import { useStateSelector } from "../management/InterfaceSelector";

export default function ChatRoute() : Roact.Element {
    const ref = Roact.createRef<TextBox>();
    const slashPressed = useKeyPress(["Slash"]);

    const connection = useMutable<RBXScriptConnection | undefined>(undefined);

    const isHidden = useStateSelector(States.States.subscription("hide_chat"), (state) => {
        return state.get();
    })

    useEffect(() => {
        const textbox = ref.getValue();
        if(!textbox || !slashPressed) return;
        
        textbox.CaptureFocus()
        
        task.spawn(() => {
            RunService.RenderStepped.Wait()
            textbox.Text = ""

            if(connection.current) connection.current.Disconnect()

            connection.current = textbox.FocusLost.Connect(() => {
                connection.current?.Disconnect()
                connection.current = undefined

                NetworkBubble.post(NetworkEvent.Chat, textbox.Text)

                textbox.Text = "Click here or press \"/\" to type."
                textbox.ReleaseFocus()
            })
        })

    }, [ ref, slashPressed ])

    return <ChatComponent Visible={!isHidden} ref={ref} />
}