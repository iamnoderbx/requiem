export namespace Plots {
	export const Random = 1581925;
	
	export enum Key {
		OWNER = 1,
		PRICE = 2,
		SIZE = 3,
		POSITION = 4,
		NAME = 5,
		DESCRIPTION = 6,
		TAGS = 7,
		IMAGE = 8,
		SELLER = 9,
	};

	export type Plot = {
		[Key.OWNER]: number,
		[Key.PRICE]: number,
		[Key.POSITION]: Vector3,
		[Key.SIZE]: number,
		[Key.NAME]: string,
		[Key.DESCRIPTION]: string,
		[Key.TAGS]: string[],
		[Key.IMAGE]: string,
		[Key.SELLER]: number,
	}

	export const Available : Plot[] = [
		{
			[Key.OWNER]: 0,
			[Key.PRICE]: 50000,
			[Key.SIZE]: 300,
			[Key.POSITION]: new Vector3(-375, 0, -180),
			[Key.NAME]: "Development Plot",
			[Key.DESCRIPTION]: "This plot is an all exclusive development plot. It is perfect for testing purposes.",
			[Key.TAGS]: ["Development Plot", "Exclusive"],
			[Key.IMAGE]: "rbxassetid://18297039061",
			[Key.SELLER]: 0,
		},
	];

	export function getDataFromId(id: number) : Plot | undefined {
		return Available.find((plot) => {
			const position = (plot[Key.POSITION])
			const plot_id = math.floor(position.X) + math.floor(position.Y) + math.floor(position.Z);
			
			return plot_id === id;
		});
	}
}