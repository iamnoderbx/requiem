import Roact from "@rbxts/roact";
import { Branches } from "shared/Branches";
import { TeamUtilities } from "shared/types/Teams";

export default function BranchIconComponent(props: { Branch: string }): Roact.Element {
	const branch = Branches.getBranchFromCleanString(props.Branch);

	return (
		<imagelabel
			Key={"ImageLabel1"}
			Image={TeamUtilities.getBranchIcon(branch)}
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundColor3={Color3.fromRGB(255, 255, 255)}
			BackgroundTransparency={1}
			BorderColor3={Color3.fromRGB(0, 0, 0)}
			BorderSizePixel={0}
			Position={UDim2.fromScale(0.0601, 0.479)}
			Size={UDim2.fromScale(0.0599, 0.593)}
		>
			<uicorner Key={"UICorner"} />
		</imagelabel>
	)
}