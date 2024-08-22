import Roact from "@rbxts/roact";
import { useEffect, useState } from "@rbxts/roact-hooked";
import { BlueprintsSubscription } from "client/entities/player/ClientPlayerEntity";
import BlueprintComponent from "client/interfaces/components/editor/blueprints/blueprint.component";
import BlueprintsBodyComponent from "client/interfaces/components/editor/blueprints/blueprints.body.component";
import BlueprintContentDrawerHolderComponent from "client/interfaces/components/editor/blueprints/blueprints.content.drawer.holder.component";
import BlueprintsHeaderButtonComponent from "client/interfaces/components/editor/blueprints/blueprints.header.button.component";
import ContentDrawerLookupContainer from "client/interfaces/components/editor/blueprints/content.drawer.grid.component";
import FolderDocketComponent from "client/interfaces/components/editor/blueprints/folder.component";
import BlueprintFoldersComponent, { BlueprintFolderComponent } from "client/interfaces/components/editor/blueprints/folders.layout.component";
import BlueprintsHeaderComponent from "client/interfaces/components/editor/blueprints/header.component";
import { EntryViewportFrame } from "client/interfaces/components/entries/entry.viewport.component";
import { useStateSelector } from "client/interfaces/management/InterfaceSelector";
import { Blueprint } from "shared/Blueprint";
import { String } from "shared/utilities/string.utilities";

type Asset = {
	name : string,
	icon : string,
	children: Asset[],
	
	blueprint?: Blueprint.Type,
}

export default function BlueprintsRoutePage(): Roact.Element {
	const blueprints = useStateSelector(BlueprintsSubscription, (state) => {
		return state.get();
	})

	const [ folders, setFolders ] = useState<Asset[]>([]);
	const [ assetSelected, setAssetSelected ] = useState<Asset>();

	useEffect(() => {
		if(!blueprints) return;

		const folders : Asset[] = [];

		const createFolderHeirarchy = (blueprint : Blueprint.Type) => {
			const category = blueprint[Blueprint.Key.CATEGORY];
			const subcategory = blueprint[Blueprint.Key.SUBCATEGORY];

			// Check if the category exists
			const categoryName = Blueprint.Category[category];
			let categoryFolder = folders.find((folder) => folder.name === categoryName);

			// If the category doesn't exist, create it
			if(!categoryFolder) folders.push({
				children: [],
				icon: "rbxassetid://13537927238",
				name: categoryName,
			})

			// Get the category folder again - it should exist now
			categoryFolder = categoryFolder ?? folders.find((folder) => folder.name === categoryName)!;

			const subcategoryName = Blueprint.getSubcategoryName(category, subcategory);
			let subcategoryFolder = categoryFolder.children.find((folder) => folder.name === subcategoryName);

			// If the subcategory doesn't exist, create it
			if(!subcategoryFolder) categoryFolder.children.push({
				children: [],
				icon: "rbxassetid://13537927238",
				name: subcategoryName,
			})

			// Get the subcategory folder again - it should exist now
			subcategoryFolder = subcategoryFolder ?? categoryFolder.children.find((folder) => folder.name === subcategoryName)!;

			// Fill the subcategory folder with the blueprint
			subcategoryFolder.children.push({
				children: [],
				blueprint: blueprint,
				icon: "rbxassetid://13537076676",
				name: blueprint[Blueprint.Key.NAME],
			})
		};

		for(const id of blueprints) {
			const blueprint = Blueprint.getBlueprintFromLookupEnum(id);
			if(!blueprint) continue;

			createFolderHeirarchy(blueprint);
		}

		setFolders(folders);		
	}, [ blueprints ])

	return <BlueprintContentDrawerHolderComponent>
		<BlueprintsHeaderComponent>
			<BlueprintsHeaderButtonComponent Text="Save All" Icon="rbxassetid://11963355762" OnClick={() => print("Save")} />
		</BlueprintsHeaderComponent>

		<BlueprintsBodyComponent>
			<BlueprintFoldersComponent>
				{folders.map((folder) => {
					return <BlueprintFolderComponent Name={String.CapitalizeAllFirstLetters(folder.name) + " Blueprints"} Icon={folder.icon} Selected={assetSelected === folder} OnSelected={() => setAssetSelected(folder)}>
						{folder.children.map((subcategory) => {
							return <BlueprintFolderComponent Name={String.CapitalizeAllFirstLetters(subcategory.name) + " Blueprints"} Icon={subcategory.icon} Selected={assetSelected === subcategory} OnSelected={() => setAssetSelected(subcategory)}>
								{subcategory.children.map((blueprint) => {
									return <BlueprintFolderComponent Name={String.CapitalizeAllFirstLetters(blueprint.name)} Icon={blueprint.icon} Arrow={false} Selected={assetSelected === blueprint} OnSelected={() => setAssetSelected(blueprint)}/>
								})}
							</BlueprintFolderComponent>
						})}
					</BlueprintFolderComponent>
				})}
			</BlueprintFoldersComponent>

			<ContentDrawerLookupContainer OnSearchChanged={() => print("Changed Search")}>
				{assetSelected && assetSelected.blueprint && <BlueprintComponent Blueprint={assetSelected.blueprint}>
					<EntryViewportFrame Model={assetSelected.blueprint[Blueprint.Key.MODEL]} />
				</BlueprintComponent>}

				{assetSelected && !assetSelected.blueprint && assetSelected.children.map((asset) => {
					if(asset.blueprint) return <BlueprintComponent Blueprint={asset.blueprint}>
						<EntryViewportFrame Model={asset.blueprint[Blueprint.Key.MODEL]} />
					</BlueprintComponent>

					return <FolderDocketComponent Name={asset.name} />
				})}
			</ContentDrawerLookupContainer>
		</BlueprintsBodyComponent>
	</BlueprintContentDrawerHolderComponent>
}