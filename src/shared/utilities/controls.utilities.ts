export namespace ControlsUtilities {
    export function remapShiftlockKey() {
        const players = game.GetService("Players")
        const PlayerScripts = players.LocalPlayer.WaitForChild("PlayerScripts")
        const PlayerModule = PlayerScripts.WaitForChild("PlayerModule")
        const CameraModule = PlayerModule.WaitForChild("CameraModule")
        const MouseLockController = CameraModule.WaitForChild("MouseLockController")
        const BoundKeys = MouseLockController.WaitForChild("BoundKeys") as StringValue

        BoundKeys.Value = "LeftAlt"
    }
}