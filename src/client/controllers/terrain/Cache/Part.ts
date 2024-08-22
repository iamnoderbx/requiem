export type MemoryCachedPart = {
	Open: {[key: number]: BasePart},
	InUse: {[key: number]: BasePart},
	CurrentCachedParent: Instance,
	Template: BasePart,
	ExpansionSize: number,
}

const CF_REALLY_FAR_AWAY = new CFrame(0, 10e8, 0);
const ERR_INVALID_TYPWE = "Invalid type for %s. Expected %s, got %s"

function assetwarn(requirement : boolean, message: string) {
	if (!requirement) {
		warn(message);
	}
}

function makeFromTemplate(template : BasePart, parent : Instance) : BasePart {
	const part = template.Clone();
	part.CFrame = CF_REALLY_FAR_AWAY;
	part.Parent = parent;

	return part;
}

export default class MemoryCacheInstance {
	// The parts that are available to be used
	private Open: BasePart[] = [];

	// The parent of the parts
	private CurrentCachedParent: Instance;

	// The template part to clone
	private Template: BasePart;

	// The number of parts to create when the cache is empty
	private ExpansionSize: number = 50;
	
	constructor(template : BasePart, numPrecreatedParts: number, parent: Instance) {
		assert(numPrecreatedParts > 0, "numPrecreatedParts must be greater than 0");
		assetwarn(template.IsA("BasePart"), string.format(ERR_INVALID_TYPWE, "template", "BasePart", template.ClassName));

		this.CurrentCachedParent = parent;
		this.Template = template;

		for (let i = 0; i < numPrecreatedParts; i++) {
			const part = makeFromTemplate(template, parent);
			this.Open.push(part);
		}

		template.Parent = undefined;
	}

	public getAllocatedPartForUsage() : BasePart {
		if(this.Open.size() === 0) {
			warn("Cache is empty, expanding cache by " + this.ExpansionSize + " parts");
			for (let i = 0; i < this.ExpansionSize; i++) {
				const part = makeFromTemplate(this.Template, this.CurrentCachedParent);
				this.Open.push(part);
			}
		}

		const part = this.Open.pop()!;
		return part;
	}

	public release(amount : number) : BasePart[] {
		const parts = [];
		for (let i = 0; i < amount; i++) {
			parts.push(this.getAllocatedPartForUsage());
		}

		return parts;
	}

	public reallocatePart(part: BasePart) {
		this.Open.push(part);
		part.CFrame = CF_REALLY_FAR_AWAY;
	}
}