import { ContextActionService, UserInputService } from "@rbxts/services"

export type BaseInputConnection = (state : Enum.UserInputState, keycode? : Enum.KeyCode) => Promise<Enum.ContextActionResult>

export class BaseInput {
    private bindings : Array<string> = []

    private isMouseButtonTwo : boolean = false
    private mouseButtonTwoConnection : RBXScriptConnection | undefined

    constructor(private keycode : Enum.KeyCode | Enum.UserInputType | Array<Enum.KeyCode | Enum.UserInputType>) {
        if(keycode === Enum.UserInputType.MouseButton2) {
            this.isMouseButtonTwo = true
        }
    }

    connect(callback: BaseInputConnection) {
        if(typeOf(this.keycode) === "table") {
            for(const _keycode of this.keycode as Array<Enum.KeyCode | Enum.UserInputType>) {
                this.bindings.push(_keycode.Name)

                ContextActionService.BindActionAtPriority(_keycode.Name, async (actionName: string, state: Enum.UserInputState) => {
                    const result = await callback(state, _keycode as Enum.KeyCode)
                    return result
                }, true, 0, _keycode)
            }
        } else {
            const _keycode = this.keycode as Enum.KeyCode | Enum.UserInputType
            this.bindings.push(_keycode.Name)
        
            if(this.isMouseButtonTwo) {
                this.mouseButtonTwoConnection = UserInputService.InputBegan.Connect(async (input : InputObject) => {
                    if(input.UserInputType !== Enum.UserInputType.MouseButton2) return
                    callback(input.UserInputState)
                })

                return
            }

            ContextActionService.BindActionAtPriority(_keycode.Name, async (actionName: string, state: Enum.UserInputState) => {
                const result = await callback(state)
                return result
            }, true, 0, _keycode)
        }
        
    }

    disconnect() {
        if(this.isMouseButtonTwo) {
            if(this.mouseButtonTwoConnection) {
                this.mouseButtonTwoConnection.Disconnect()
            }
            return
        }
        
        if(typeOf(this.keycode) === "table") {
            for(const _keycode of this.keycode as Array<Enum.KeyCode | Enum.UserInputType>) {
                ContextActionService.UnbindAction(_keycode.Name)
            }
        } else {
            const _keycode = this.keycode as Enum.KeyCode | Enum.UserInputType
            ContextActionService.UnbindAction(_keycode.Name)
        }
    }
}

export class Input {
    private inputs : Array<BaseInput> = []

    public createInputContext(keycode : Enum.KeyCode | Enum.UserInputType) {
        const input = new BaseInput(keycode)
        this.inputs.push(input)

        return input
    }

    public createInputContexts(keycodes : Array<Enum.KeyCode | Enum.UserInputType>) {
        const input = new BaseInput(keycodes)
        this.inputs.push(input)

        return input
    }

    public clearInputContexts() {
        for(const input of this.inputs) {
            input.disconnect()
        }

        this.inputs = []
    }
}