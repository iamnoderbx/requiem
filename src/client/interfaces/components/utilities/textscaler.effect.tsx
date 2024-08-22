import { Workspace } from "@rbxts/services"

// The text size you wish to scale relative to.
export const ScaleTextToBounds = (text_size : number) => {
    // text_size is a text size thats relative to 1920x1080
    // We want to scale it to the current screen size

    // Get the current screen size
    const screen_size = Workspace.CurrentCamera!.ViewportSize

    // Calculate the scale factor
    const scale_factor = screen_size.X / 1920

    // Scale the text size
    return 1 + (text_size * scale_factor)
}