import Roact from "@rbxts/roact";
import ChatComponent from "../components/chat/chat.component";
import { useEffect, useMutable } from "@rbxts/roact-hooked";
import { useKeyPress } from "@rbxts/pretty-roact-hooks";
import { Players, RunService, UserInputService } from "@rbxts/services";
import CommandBarComponent from "../components/commands/commandbar.component";
import { AdminAutoCompletion } from "client/controllers/admin/AdminAutoCompletion";
import { String } from "shared/utilities/string.utilities";
import { getController } from "shared/utilities/decorators/ServiceControllers";
import { AdminClientController } from "client/controllers/admin/AdminClientController";
import { CUSTOM_SPECIFIERS } from "shared/utilities/decorators/CommandDecorators";
import { NetworkBubble } from "client/network/ClientBubbles";
import { NetworkEvent } from "shared/utilities/network/Events";

let current_autofill: Frame
let current_tabConnection: RBXScriptConnection
let current_textChanged: RBXScriptConnection
let current_autofillOptions: Array<string>
let current_autofill_cursor: number = 0;

let ignoreChange = false;
let wasAutofillSpacePressed = false;

let textbox_scalers: TextLabel[] = [];

export default function AdminBarRoute(): Roact.Element {
    const ref = Roact.createRef<Frame>();
    const semiPressed = useKeyPress(["Semicolon"]);

    const connection = useMutable<RBXScriptConnection | undefined>(undefined);

    useEffect(() => {
        // If the frame doesn't exist, we can just return
        const frame = ref.getValue();
        if (!frame || !semiPressed) return;

        // Capture the focus of the textbox
        const textbox = frame.FindFirstChild("TextBox") as TextBox;
        textbox.CaptureFocus()

        if (current_tabConnection) current_tabConnection.Disconnect();
        if (current_textChanged) current_textChanged.Disconnect();

        // Create the connection
        current_tabConnection = UserInputService.InputBegan.Connect((input) => {
            if (!textbox.IsFocused()) return;
            if (input.KeyCode !== Enum.KeyCode.Tab && input.KeyCode !== Enum.KeyCode.Space) return;
            if (current_autofillOptions.size() === 0) return;

            if (input.KeyCode === Enum.KeyCode.Space) {
                // Only set wasSpacePressed if there are no direct matches to our current autofill options
                const splitified = String.splitString(textbox.Text, " ");
                const last = splitified[splitified.size() - 1]

                if (current_autofillOptions.find((value) => value === last)) return;
                wasAutofillSpacePressed = true;
            }

            // Remove all instances of "	"
            if (textbox.Text.find("\t")) {
                ignoreChange = true;

                textbox.Text = textbox.Text.gsub("\t", "")[0]
                textbox.CursorPosition = textbox.Text.size() + 1;
            }

            const current = String.splitString(textbox.Text, " ")
            const last = current[current.size() - 1]

            // If the cursor is at the end of the textbox, we can just autofill the first option
            if (current_autofill_cursor >= current_autofillOptions.size()) current_autofill_cursor = 0;

            // Get the current autofill option
            const autofill = current_autofillOptions[current_autofill_cursor];
            current_autofill_cursor += 1;

            // Replace the last word with the autofill option
            ignoreChange = true;
            textbox.Text = textbox.Text.gsub(last, autofill!)[0]
        })

        // Listen for changes in the textbox
        current_textChanged = textbox.GetPropertyChangedSignal("Text").Connect(() => {
            // Find if there is a tab in the textbox
            const found = textbox.Text.find("\t");

            // Remove all instances of "	"
            if (found && found.size() > 0) {
                ignoreChange = true;
                textbox.Text = textbox.Text.gsub("\t", "")[0]

                textbox.CursorPosition = textbox.Text.size() + 1;
                return;
            }

            // if wasAutofillSpacePressed remove the last character from the cursor
            if (wasAutofillSpacePressed) {
                // Get the current cursor position
                const cursor = textbox.CursorPosition;

                // Remove the character directly before the cursor if it's a space.
                if (textbox.Text.sub(cursor - 1, cursor - 1) === " ") {
                    ignoreChange = true;

                    // Reverse the string, remove the first space, then reverse it again
                    const reversed = string.reverse(textbox.Text);
                    const result = string.gsub(reversed, " ", "", 1);
                    textbox.Text = string.reverse(result[0]);

                    // Assign autofill space to false
                    wasAutofillSpacePressed = false;

                    // Set the cursor position to the end of the textbox
                    textbox.Text = textbox.Text + " ";
                    textbox.CursorPosition = textbox.Text.size() + 1;
                }
            }

            // Ignore the change if we're currently autofilling
            if (ignoreChange) {
                ignoreChange = false;
                return
            };

            // Check if the last character is a space if it is, we can ignore the autofill
            if (!textbox.Text || textbox.Text === "" || textbox.Text === " ") {
                if (current_autofill) current_autofill.Destroy()
                return
            };

            // Get the list of commands the player can execute.
            const commander = getController(AdminClientController);
            const commands = commander.getCommands() ?? [];

            const list = commands.map((command) => command.name);
            let autofill: Frame | undefined = undefined;

            // Split the string into an array
            const splitified = String.splitString(textbox.Text, " ");
            const isLastSpace = textbox.Text.sub(textbox.Text.size(), textbox.Text.size()) === " ";

            const cleanAutofill = () => {
                if (current_autofill) current_autofill.Destroy()

                current_autofillOptions = [];
                current_autofill_cursor = 0;
            }

            if (splitified.size() === 1 && !isLastSpace) {
                const results = AdminAutoCompletion.AutofillFromArray(splitified[splitified.size() - 1], list)

                // If results is empty, we can just return
                if (results.size() === 0) return cleanAutofill();

                // Set the current autofill options
                current_autofillOptions = results;
                current_autofill_cursor = 0;

                // Create the autofill
                autofill = AdminAutoCompletion.CreateDescriptionLabel(results.map((value) => {
                    return [value, commands.find((command) => command.name === value)!.description]
                }));
            } else if (splitified.size() >= 1) {
                const command = commands.find((command) => command.name === splitified[0]);
                const argumentIndex = String.getTotalSpaces(textbox.Text);

                const argument = command?.arguments[argumentIndex - 1];
                if (!argument) return cleanAutofill();

                let options = AdminAutoCompletion.StringifyOptions(argument.type as string | Instance);
                options = options.filter((value) => {
                    const current = splitified[argumentIndex];
                    if (!current) return false;

                    return string.lower(string.sub(value, 1, current.size())) === string.lower(current)
                });

                const display = options.map((value) => {
                    return [value]
                }) as Array<[string]>;

                const results = AdminAutoCompletion.AutofillFromArray(splitified[splitified.size() - 1], options)

                // Check if the argument is of type player.
                if(argument.type === Players) {
                    // Check if the current splitified starts with the character "@"
                    const current = splitified[splitified.size() - 1];
                    if(current.sub(1, 1) === "@") {
                        CUSTOM_SPECIFIERS.forEach((specifier) => {
                            if(string.lower(string.sub(specifier, 1, current.size())) === string.lower(current)) {
                                results.push(specifier);
                                display.push([specifier]);
                            }
                        })
                    }
                }
                
                // Set the current autofill options
                current_autofillOptions = results;
                current_autofill_cursor = 0;

                // Create the autofill
                const { holder, scaler } = AdminAutoCompletion.CreateScalingDescriptionLabel([["@" + argument.name, argument.description, 10], ...display])

                // Set the autofill
                autofill = holder;

                // Set the textbox scalers
                textbox_scalers = scaler;
                textbox_scalers.forEach((value) => value.Text = textbox.Text)
            }

            // Destroy the current autofill if it exists
            if (current_autofill) current_autofill.Destroy()

            if (!autofill) return;
            autofill.Parent = frame;

            // Set the current autofill
            current_autofill = autofill;
        })

        // Set the connection
        frame.Visible = true;

        task.spawn(() => {
            RunService.RenderStepped.Wait()
            textbox.Text = ""

            if (connection.current) connection.current.Disconnect()

            connection.current = textbox.FocusLost.Connect(() => {
                // Ensure the textbox isn't just spaces or empty
                if (textbox.Text.gsub(" ", "")[0] !== "") {
                    NetworkBubble.post(NetworkEvent.Command, textbox.Text)
                }
                
                frame.Visible = false;
                textbox.ReleaseFocus()
            })
        })

    }, [ref, semiPressed])

    return <CommandBarComponent ref={ref} />
}