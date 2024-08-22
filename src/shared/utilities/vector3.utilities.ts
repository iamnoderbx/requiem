import { TweenService } from "@rbxts/services";

export namespace Vector {
	export class Ease {
        private value: Vector3Value = new Instance("Vector3Value");
        private goal : Vector3 | undefined;

        private connections: Array<RBXScriptConnection> = [];

        constructor(initial: Vector3, private target?: Vector3, private tween?: TweenInfo) {
            this.value.Value = initial;
        }

        public Get() {
            return this.value.Value;
        }

        public Connect(callback: () => void) {
            let connection = this.value.Changed.Connect(() => {
                callback();
            });

            this.connections.push(connection);

            return () => {
                connection.Disconnect();
            }
        }

        public Disconnect() {
            print("Disconnecting")
            this.connections.forEach(connection => connection.Disconnect());
            this.connections = [];
        }

        public Instant(target: Vector3) {
            this.value.Value = target
        }

        public EaseTo(target: Vector3, tween?: TweenInfo) {
            this.target = target;
            this.tween = tween;

            this.Play();
        }

        public GetGoal() {
            return this.goal;
        }

        public Play() {
            const tween = TweenService.Create(this.value, this.tween ?? new TweenInfo(), {
                Value: this.target ?? this.value.Value
            });

            this.goal = this.target;

            tween.Play();
        }

        public Alive() {
            return this.value !== undefined;
        }

        public Destroy() {
            this.value.Destroy();
            this.value = undefined!;

            this.target = undefined!;

            this.tween = undefined!;
        }
    }
}