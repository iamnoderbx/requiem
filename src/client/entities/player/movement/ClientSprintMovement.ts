import { ControlsUtilities } from "shared/utilities/controls.utilities";
import { BaseClientMovement, ClientMovementController } from "./BaseClientMovement";
import { BaseInput, Input } from "client/utilities/BaseInputUtilities";
import { BaseEntity } from "client/entities/BaseEntity";
import { StatisticModes } from "shared/statistics/classes/Statistic";

export namespace ClientSprintMovement {
    export let isSprinting : boolean = false;

    export class Movement extends BaseClientMovement {
        private input : Input = new Input();

        /**
         * This function handles the sprint action of the client.
         * 
         * @param {Enum.UserInputState} state - The state of the user input.
         * 
         * @returns {Promise<Enum.ContextActionResult>} The result of the context action.
         * 
         * @author NodeSupport
         */
        private async sprint(state: Enum.UserInputState): Promise<Enum.ContextActionResult> {
            // If the state is 'Cancel', pass the action
            if (state === Enum.UserInputState.Cancel) return Enum.ContextActionResult.Pass;

            // Resolve the client entity and get the statistics of its humanoid
            const client = await BaseEntity.resolveClientEntity();
            const statistics = client.getEntityHumanoid().getStatistics();

            // If the statistics are not available, pass the action
            if (!statistics) return Enum.ContextActionResult.Pass;

            // Get the 'walkspeed' and 'fov' statistics
            const walkspeed = statistics.get("walkspeed");
            const fov = statistics.get("fov");

            // Define the adjustment options
            const options = {
                Mode: StatisticModes.MULT,
                Priority: 2,
                Tween: state === Enum.UserInputState.Begin ? new TweenInfo(1.5) : new TweenInfo(0.5)
            };

            ClientSprintMovement.isSprinting = state === Enum.UserInputState.Begin;

            // If the state is 'Begin', adjust the 'walkspeed' and 'fov' statistics
            // If the state is 'End', delete the 'sprint' statistic from 'walkspeed' and 'fov'
            if (state === Enum.UserInputState.Begin) {
                walkspeed?.adjust("sprint", ClientMovementController.SprintMultiplier, options);
                fov?.adjust("sprint", 1 + (ClientMovementController.SprintMultiplier / 10), options);
            } else {
                walkspeed?.deleteStatistic("sprint", options);
                fov?.deleteStatistic("sprint", options);
            }

            // Pass the action
            return Enum.ContextActionResult.Pass;
        }

        public initialize() {
            // Remap the shiftlock key.
            ControlsUtilities.remapShiftlockKey()

            // Listen for the shift key to be pressed
            this.input.createInputContext(Enum.KeyCode.LeftShift).connect(
                (state) => this.sprint(state))
        }
    }
}

export default ClientSprintMovement;