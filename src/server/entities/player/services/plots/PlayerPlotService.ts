import { PlayerActions, PlotActions } from "shared/utilities/network/Events"
import { StoreComponentItem, StorePublicComponent } from "server/components/Store/StorePublicComponent";
import { Plots } from "shared/Plots";
import { BasePlayerEntity } from "../../BasePlayerEntity";
import { MemoryStoreService } from "@rbxts/services";
import PlotAPIServiceRunner, { GetPlotResponse } from "./PlotAPIServiceRunner";
import { SharedPlotComponent } from "server/components/Plots/SharedPlotsComponent";
import { DailyStoreUtilities } from "../stores/DailyStoreUtilities";
import { UtilityArrayComponent } from "server/components/Utilities/UtilityArrayComponent";
import { Stores } from "shared/Stores";
import { Blueprint } from "shared/Blueprint";

const MemoryStoreHashmap = MemoryStoreService.GetHashMap("stores");
const PlotServiceStoreOffset = 12523;

export default class PlayerPlotService {
    private static plots: Map<number, SharedPlotComponent.Component> = new Map();
	public static synchronized : Map<string, number> = new Map<string, number>();

    private container!: SharedPlotComponent.Container;
    private blueprints!: UtilityArrayComponent.Component<number>;
    
    constructor(private player : BasePlayerEntity) {
		this.player = player
	}

    private async getPlot(plot : GetPlotResponse) {
        // Check if the plot already exists
        const doesPlotWithIdExist = PlayerPlotService.plots.get(plot.id)

        // Create the plot
        if(!doesPlotWithIdExist) {
            const component = new SharedPlotComponent.Component({ id: plot.id, owner: plot.owner })
            this.container.addPlot(component)

            PlayerPlotService.plots.set(plot.id, component)
        }

        // Check if the component exists within the container
        const component = PlayerPlotService.plots.get(plot.id)

        const exists = this.container.get().find((v) => v.get().id === plot.id);
        if(!exists) this.container.addPlot(component as SharedPlotComponent.Component)
    }

    private updatePlayerPlots() {
        // Get the players plots
        return new Promise(async (resolve, reject) => {
            PlotAPIServiceRunner.getUserPlots(this.player.getUserId()).then(async (response) => {
                response.forEach(async (plot) => await this.getPlot(plot));
                resolve("Successfully updated player plots.")
            }).catch((err) => reject(err))
        });
    }

    public async purchase(seed : number, id: number) {
        const original = seed - Plots.Random

        const store = DailyStoreUtilities.stores.get().find((store) => store.getUnserialized().id === seed)
        if (!store) return this.player.error("Could not find the store to purchase the plot from.")

        // Get the plot
        const item = store.get().items[id]
        const items = store.get().items;

        // Check if the plot is available
        if (!item.available) return this.player.error("This plot is no longer available.")

        // The plots position
        const position = item.meta[0] as Vector3;
        const plot_id = math.floor(position.X) + math.floor(position.Y) + math.floor(position.Z);

        // Get the key for the plot
        const key = item.price + "_" + string.format("%d_%d_%d", math.floor(position.X), math.floor(position.Y), math.floor(position.Z))

        // Get the memory store
        const memory = MemoryStoreHashmap.GetAsync("landlord_" + tostring(original) + "_" + tostring(seed) + "_" + key + "_" + tostring(PlotServiceStoreOffset));
        if(memory !== undefined) return this.player.error("This plot is no longer available.")

        // Purchase the plot
        MemoryStoreHashmap.SetAsync("landlord_" + tostring(original) + "_" + tostring(seed) + "_" + key + "_" + tostring(PlotServiceStoreOffset), true, 300);
        
        // Update the store
        item.available = false
        store.rewrite({ id: seed, items: items })

        PlotAPIServiceRunner.addPlot(plot_id, this.player.getUserId()).then(async (response) => {
            await this.updatePlayerPlots();

            // Send a success message to the player
            this.player.success("You have successfully purchased the land \"" + item.name + "\" for $" + item.price + ".")
        }).catch((err) => {
            this.player.error(err)
        })
    }

	public async request(seed: number) {
		const rng = Plots.Random
		const offset = seed + rng

        // Check if the store already exists
        const doesStoreWithIdExist = DailyStoreUtilities.stores.get().find((store) => store.get().id === offset)
        if (!doesStoreWithIdExist) this.player.info("Requesting and loading land proprietor inventory...")

        // Create the store
        if (!doesStoreWithIdExist) {
			const filtered = Plots.Available.filter((plot) => (plot[Plots.Key.SELLER] + rng) === offset)

			const plots = filtered.map((plot) => {
                // Check if the quick lookup memory store contains the plot.
                // Get a unique key for the plot, and check if it exists in the memory store.
                const position = (plot[Plots.Key.POSITION])
                const plot_id = math.floor(position.X) + math.floor(position.Y) + math.floor(position.Z);

                const key = plot[Plots.Key.PRICE] + "_" + string.format("%d_%d_%d", math.floor(position.X), math.floor(position.Y), math.floor(position.Z))

                // Check if synchronized within the last five minutes
                const lastSync = PlayerPlotService.synchronized.get(key);
                const hasSynced = lastSync !== undefined && (tick() - lastSync) < 300;
                
                if(!hasSynced) {
                    // Set the last sync time
                    PlayerPlotService.synchronized.set(key, tick());

                    // Get the server response from the PlotAPIServiceRunner
                    PlotAPIServiceRunner.getPlot(plot_id).then((response) => {
                        MemoryStoreHashmap.SetAsync("landlord_" + tostring(seed) + "_" + tostring(offset) + "_" + key + "_" + tostring(PlotServiceStoreOffset), true, 300);
                    }).catch((err) => {
                        // The plot does not exist in our database
                        // Ensures that the plot is available for purchase
                    }).await();
                }

                // Get the memory store
                const memory = MemoryStoreHashmap.GetAsync("landlord_" + tostring(seed) + "_" + tostring(offset) + "_" + key + "_" + tostring(PlotServiceStoreOffset));

                // Return the plot
				return {name : plot[Plots.Key.NAME], price : plot[Plots.Key.PRICE], available: memory === undefined, meta: [
					plot[Plots.Key.POSITION], plot[Plots.Key.SIZE], plot[Plots.Key.DESCRIPTION], plot[Plots.Key.TAGS], plot[Plots.Key.IMAGE]
				]}
			})

            const store = new StorePublicComponent.Component({ id: offset, items: plots })
            DailyStoreUtilities.stores.add(store)
        } else doesStoreWithIdExist?.rewrite({ id: offset, items: doesStoreWithIdExist.get().items })
    }

    public addGroupsOfBlueprintsToPlayer(ids : number[]) {
        ids.forEach((id) => {
            this.player.getData().getData()?.blueprints.push(id);
        });
        
        this.blueprints.rewrite(this.blueprints.get());
    }

    public addBlueprintToPlayer(id : number) {
        this.player.getData().getData()?.blueprints.push(id);
        this.blueprints.rewrite(this.blueprints.get());
    }

	/**
     * This function initializes the plot service for the player.
     * 
     * @author NodeSupport
     */
    public initialize() {
        this.player.getNetwork().listen(PlayerActions.Plot, (...args: unknown[]) => {
            // Get the action
            const [action] = args as [ PlotActions ]

            // Switch the action
            switch (action) {
                case PlotActions.REQUEST: return this.request(args[1] as number)
                case PlotActions.PURCHASE: return this.purchase(args[1] as number, args[2] as number)
            }
        })

        this.player.getStoreService().onItemPurchased(Stores.Types.Draftsman).Connect((item : StoreComponentItem) => {
            const blueprint = Blueprint.getBlueprintFromLookupEnum(item.meta[1] as number);
            if(!blueprint) return this.player.error("An unknown error occured while purchasing, send this code 505 to a developer.");

            this.player.getData().getData()?.blueprints.push(blueprint[Blueprint.Key.ID]);
            this.blueprints.rewrite(this.blueprints.get());
        })

        return new Promise(async (resolve, reject) => {
            const blueprints = this.player.getData().getData()?.blueprints || [];

            this.container = new SharedPlotComponent.Container();
            this.blueprints = new UtilityArrayComponent.Component<number>(blueprints);
            
            await this.updatePlayerPlots();

            this.player.addComponent(this.container);
            this.player.addComponent(this.blueprints);

            resolve("Successfully initialized the plot service.")
        });
    };
}