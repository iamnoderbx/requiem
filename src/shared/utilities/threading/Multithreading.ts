import { Players, RunService, ServerScriptService } from "@rbxts/services";
import { Requiem } from "shared/Requiem";

export class Multithreading {
	private folder : Folder = new Instance("Folder");

	// A queue we will push and pop from
	private available : Actor[] = [];
	private backup : Actor | undefined;

	private callbacks : Map<number, Callback> = new Map();

	constructor(private pool : number, private module : ModuleScript) {
		this.folder.Name = "Pool$" + module.Name;
		this.folder.Parent = RunService.IsServer() ? ServerScriptService : Players.LocalPlayer!.WaitForChild("PlayerScripts");

		// Create the threads
		const variant = RunService.IsServer() ? Requiem.Assets.other.ServerActor : Requiem.Assets.other.ClientActor

		for (let i = 0; i < this.pool; i++) {
			const actor = variant.Clone();
			const newModule = module.Clone();
			newModule.Parent = actor

			actor.Name = tostring(i);
			actor.Parent = this.folder;

			const response = actor.FindFirstChild("Result") as BindableEvent;
			response.Event.Connect((response_id : number, response : defined[]) => {
				const callback = this.callbacks.get(response_id);
				if(callback) callback(response);

				this.callbacks.delete(response_id);
	
				// Push the actor back into the available pool
				this.available.push(actor);
			});

			this.available.push(actor);
		}

		this.backup = this.available[0];
	}

	execute(...args : defined[]) {

		// Get the first available thread
		const actor = this.available[0] ?? this.backup;
		if(!actor.GetAttribute("ready")) actor.GetAttributeChangedSignal("ready").Wait();
		actor.SendMessage("execute", args);

		this.available.remove(0);

		task.spawn(() => {
			task.wait(1)
			this.available.push(actor);
		})


		// const event = actor.FindFirstChild("Event") as BindableEvent;
		// if(!actor.GetAttribute("ready")) actor.GetAttributeChangedSignal("ready").Wait();

		// const id = math.random();

		// // Fire the event
		// event.Fire(id, ...args);
	}
}