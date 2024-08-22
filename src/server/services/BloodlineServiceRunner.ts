import { DataStoreService } from "@rbxts/services";
import { SharedBloodlineComponent } from "server/components/Bloodlines/SharedBloodlineComponent";
import { NetworkBubble } from "server/network/NetworkBubble";
import { Bloodline } from "shared/types/Bloodline";
import { Treasury } from "shared/types/Treasury";
import { Controller } from "shared/utilities/decorators/ServiceControllers";
import { EnumUtilities } from "shared/utilities/enum.utilities";
import { NetworkEvent } from "shared/utilities/network/Events";

const BloodlineDataStore = DataStoreService.GetDataStore("Bloodlines_2");

export class BloodlineWrapper implements Bloodline.Bloodline {
    public id: number;
    public name: string;
    public origin: Bloodline.Origins;
    public treasury: any;
    public created: number;
    public icon: string;
    public storyboard: string;
    public members: Bloodline.Member[];

    public component: SharedBloodlineComponent.Component;

    constructor(bloodline: Bloodline.Bloodline) {
        this.id = bloodline.id;
        this.name = bloodline.name;
        this.origin = bloodline.origin;
        this.treasury = bloodline.treasury;
        this.created = bloodline.created;
        this.icon = bloodline.icon;
        this.storyboard = bloodline.storyboard;
        this.members = bloodline.members;

        this.component = new SharedBloodlineComponent.Component(this);
    }

    public addMember(member: Partial<Bloodline.Member>) {
        member.role = member.role ?? Bloodline.Role.Pending;
        member.permissions = member.permissions ?? [];
        member.parent = member.parent ?? 0;
        member.level = member.level ?? 0;
        member.lore = member.lore ?? "Unknown"

        this.members.push(member as Bloodline.Member);
        this.component.rewrite(this);
    }

    public setIcon(icon: string) {
        const rbxassetid = "rbxassetid://" + icon;
        this.icon = rbxassetid;
        this.component.rewrite(this);
    }

    public setMemberRole(memberId: number, role: Bloodline.Role) {
        const member = this.members.find(member => member.id === memberId);
        if (member) member.role = role
    }

    public getSharedComponent() {
        return this.component;
    }
}

@Controller()
export default class BloodlineServiceRunner {
    public bloodlines: BloodlineWrapper[] = [];

    private createBloodlineTreasury() {
        return {
            audits: [],
            contents: [],
            id: math.random(10000000),
            income_sources: [],
            name: "Test Bloodline Treasury",
            owner: 3,
            permissions: [],
            type: Treasury.Type.BLOODLINE,
        }
    }

    private createBloodlineWrapper(bloodline: Partial<Bloodline.Bloodline>) {
        if (bloodline.id && this.bloodlines.find(b => b.id === bloodline.id)) {
            return this.bloodlines.find(b => b.id === bloodline.id)!;
        }

        const id = math.floor(math.random() * 10000000);

        bloodline.name = bloodline.name ?? "Unnamed Bloodline";
        bloodline.id = bloodline.id ?? id;
        bloodline.created = bloodline.created ?? tick();
        bloodline.icon = bloodline.icon ?? "rbxassetid://17520139686";
        bloodline.storyboard = bloodline.storyboard ?? `Your bloodline does not currently have a story board. You may contact lore team in order to recieve one.`;
        bloodline.members = bloodline.members ?? [];
        bloodline.origin = bloodline.origin ?? EnumUtilities.EnumRandomizer(Bloodline.Origins);
        bloodline.treasury = bloodline.treasury ?? this.createBloodlineTreasury();

        const bloodlineWrapper = new BloodlineWrapper(bloodline as Bloodline.Bloodline);
        this.bloodlines.push(bloodlineWrapper);

        return bloodlineWrapper;
    }

    public create(bloodline: Partial<Bloodline.Bloodline>) {
        return new Promise<BloodlineWrapper>((resolve, reject) => {
            const wrapper = this.createBloodlineWrapper(bloodline)

            try {
                BloodlineDataStore.SetAsync(tostring(wrapper.id), wrapper);
                resolve(wrapper);
            } catch (error) {
                reject(error);
            }
        })
    }

    public getBloodlineFromPlayer(player: Player): BloodlineWrapper {
        // Loop through all bloodlines and find the one that the player is in
        return this.bloodlines.find(bloodline => bloodline.members.some(member => member.id === player.UserId))!;
    }

    public getBloodline(id: number): Promise<BloodlineWrapper> {
        return new Promise<BloodlineWrapper>((resolve, reject) => {
            if (id === -1 || id === 0) reject("Bloodline not found with id " + id);
            if (this.bloodlines.find(b => b.id === id)) {
                resolve(this.bloodlines.find(b => b.id === id)!);
                return;
            }

            const [bloodline] = BloodlineDataStore.GetAsync(tostring(id)) as unknown as LuaTuple<[Bloodline.Bloodline]>;
            if (bloodline && bloodline.id) {
                resolve(this.createBloodlineWrapper(bloodline as unknown as Bloodline.Bloodline));
            } else {
                reject("Bloodline not found with id " + id);
            }
        })
    }

    public initialize() {
        const replicator = new NetworkBubble.Replicator(NetworkEvent.Bloodline);
        replicator.listen((player: Player, args: unknown[]) => {
            const data = args[0] as { type: string, value: string }
            const bloodline = this.getBloodlineFromPlayer(player);

            if (data.type === "icon") bloodline.setIcon(data.value)
        })

        // Create a template bloodline for testing purposes
        this.create({
            id: 3,
            name: "Test",
            created: tick(),
            icon: "rbxassetid://17520139686",
            members: [],
            origin: Bloodline.Origins.Shiganshina,
            treasury: this.createBloodlineTreasury(),
        })
    }
}
