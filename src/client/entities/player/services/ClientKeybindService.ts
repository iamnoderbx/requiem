import { Keybinds } from "shared/Keybindings";
import { ClientPlayerEntity } from "../ClientPlayerEntity";
import { HorseActions, PlayerActions } from "shared/utilities/network/Events";
import { UserInputService } from "@rbxts/services";
import Object from "@rbxts/object-utils";
import { KeyCode } from "@rbxts/pretty-roact-hooks";

export default class ClientKeybindService {
    private began_callbacks: Map<Keybinds.CategoryKeys<any>, (BindableEvent)[]> = new Map();
    private ended_callbacks: Map<Keybinds.CategoryKeys<any>, (BindableEvent)[]> = new Map();

    private keybinds: Keybinds.Map = Keybinds.Default

    constructor(private player: ClientPlayerEntity) {
        UserInputService.InputBegan.Connect((input) => {
            const keycode = input.KeyCode
            if(keycode === Enum.KeyCode.Unknown) return

            if(UserInputService.GetFocusedTextBox()) return
            
            const keybind = this.getKeycodeFromSoftMap(keycode)
            if(!keybind) return

            const events = this.began_callbacks.get(keybind)
            if(events) {
                for(const event of events) {
                    event.Fire()
                }
            }
        })

        UserInputService.InputEnded.Connect((input) => {
            const keycode = input.KeyCode
            if(keycode === Enum.KeyCode.Unknown) return

            if(UserInputService.GetFocusedTextBox()) return

            const keybind = this.getKeycodeFromSoftMap(keycode)
            if(!keybind) return

            const events = this.ended_callbacks.get(keybind)
            if(events) {
                for(const event of events) {
                    event.Fire()
                }
            }
        })
    }
    
    private getKeycodeFromSoftMap(keycode : Enum.KeyCode) {
        let result : string | number | undefined = undefined

        const softmap = this.keybinds as unknown as Keybinds.SoftKeybindMap;
        Object.keys(softmap).forEach(category => {
            const map = softmap[category as unknown as keyof typeof softmap]

            Object.keys(map).forEach(keybind => {
                if(map[keybind].some(key => key === keycode)) {
                    result = keybind
                }
            })
        })

        return result
    }

    public update(map: Keybinds.Map) {
        this.keybinds = map
    }

    // Now you can use CategoryKeys in your function
    public getCategory<T extends keyof typeof Keybinds.Default>(category: T) {
        return {
            pressed: (keybind: Keybinds.CategoryKeys<T>) => {
                // ...
                if(!this.began_callbacks.has(keybind)) {
                    this.began_callbacks.set(keybind, [])
                }

                const event = new Instance("BindableEvent")
                this.began_callbacks.get(keybind)!.push(event)
                
                return event.Event
            },

            released: (keybind: Keybinds.CategoryKeys<T>) => {
                if(!this.ended_callbacks.has(keybind)) {
                    this.ended_callbacks.set(keybind, [])
                }

                const event = new Instance("BindableEvent")
                this.ended_callbacks.get(keybind)!.push(event)
                
                return event.Event
            },

            getKeyCode: (keybind: Keybinds.CategoryKeys<T>) => {
                const map = this.keybinds[category]
                if(!map) return

                return map[keybind]
            },

            destroy: (keybind: Keybinds.CategoryKeys<T>) => {
                const began_events = this.began_callbacks.get(keybind)
                const ended_events = this.ended_callbacks.get(keybind)

                if(ended_events) {
                    for(const event of ended_events) {
                        event.Destroy()
                    }
                }

                if(began_events) {
                    for(const event of began_events) {
                        event.Destroy()
                    }
                }

                this.ended_callbacks.delete(keybind)
                this.began_callbacks.delete(keybind)
            }
        }
    }
}