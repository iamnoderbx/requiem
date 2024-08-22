import Object from "@rbxts/object-utils";
import { HttpService } from "@rbxts/services";
import { Locations } from "shared/types/Locations";
import { Treasury } from "shared/types/Treasury";

type TreasuryAPIResponse = { 
    Success: boolean, 
    Body: unknown, 
    StatusCode: number, 
    StatusMessage: string
};

enum TreasuryAPIEndpoints {
    CREATE_TREASURY = "create/treasury",
    
    GET_TREASURY_AUDITS = "get-treasury/audit-logs",
    GET_TREASURY_OWNER = "get-treasury/owner",
    GET_TREASURY_CONTAINER = "get-treasury/container",
    GET_TREASURY_ACCESS = "get-treasury/access-table",
    GET_TREASURY_MARCS = "get-treasury/marcs",
    GET_TREASURY = "get-treasury/treasury",
    GET_USERS_TREASURIES = "treasuries",
    GET_TREASURY_INCOME_SOURCES = "get-treasury/income-sources",

    UPDATE_TREASURY_NAME = "update-treasury/name",
    UPDATE_TREASURY_ACCESS = "update-treasury/access-table",
    UPDATE_TREASURY_OWNER = "update-treasury/update-owner",
    UPDATE_TREASURY_LOCATION = "update-treasury/update-container-location",

    UPDATE_TREASURY_INCOME_SOURCES = "update-treasury/update-income-source",
    ADD_TREASURY_INCOME_SOURCE = "update-treasury/add-income-source",

    REMOVE_TREASURY_MARCS = "update-treasury/remove-marcs",
    ADD_TREASURY_MARCS = "update-treasury/add-marcs",

    REMOVE_TREASURY_CONTENT_ITEM = "update-treasury/remove-item",
    ADD_TREASURY_CONTENT_ITEM = "update-treasury/add-item",

    RESET = "reset",
}

enum TreasuryAPIRequestTypes {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
}

const TreasuryAPIEndpointMethods= new Map<TreasuryAPIEndpoints, TreasuryAPIRequestTypes>([
    [TreasuryAPIEndpoints.CREATE_TREASURY, TreasuryAPIRequestTypes.POST],

    [TreasuryAPIEndpoints.GET_TREASURY_AUDITS, TreasuryAPIRequestTypes.GET],
    [TreasuryAPIEndpoints.GET_TREASURY_OWNER, TreasuryAPIRequestTypes.GET],
    [TreasuryAPIEndpoints.GET_TREASURY_CONTAINER, TreasuryAPIRequestTypes.GET],
    [TreasuryAPIEndpoints.GET_TREASURY_ACCESS, TreasuryAPIRequestTypes.GET],
    [TreasuryAPIEndpoints.GET_TREASURY_MARCS, TreasuryAPIRequestTypes.GET],
    [TreasuryAPIEndpoints.GET_TREASURY, TreasuryAPIRequestTypes.GET],
    [TreasuryAPIEndpoints.GET_TREASURY_INCOME_SOURCES, TreasuryAPIRequestTypes.GET],
    [TreasuryAPIEndpoints.GET_USERS_TREASURIES, TreasuryAPIRequestTypes.GET],

    [TreasuryAPIEndpoints.UPDATE_TREASURY_NAME, TreasuryAPIRequestTypes.PUT],
    [TreasuryAPIEndpoints.UPDATE_TREASURY_ACCESS, TreasuryAPIRequestTypes.PUT],
    [TreasuryAPIEndpoints.UPDATE_TREASURY_OWNER, TreasuryAPIRequestTypes.PUT],
    [TreasuryAPIEndpoints.UPDATE_TREASURY_LOCATION, TreasuryAPIRequestTypes.POST],

    [TreasuryAPIEndpoints.UPDATE_TREASURY_INCOME_SOURCES, TreasuryAPIRequestTypes.PUT],
    [TreasuryAPIEndpoints.ADD_TREASURY_INCOME_SOURCE, TreasuryAPIRequestTypes.POST],

    [TreasuryAPIEndpoints.REMOVE_TREASURY_MARCS, TreasuryAPIRequestTypes.POST],
    [TreasuryAPIEndpoints.ADD_TREASURY_MARCS, TreasuryAPIRequestTypes.POST],

    [TreasuryAPIEndpoints.REMOVE_TREASURY_CONTENT_ITEM, TreasuryAPIRequestTypes.POST],
    [TreasuryAPIEndpoints.ADD_TREASURY_CONTENT_ITEM, TreasuryAPIRequestTypes.POST],

    [TreasuryAPIEndpoints.RESET, TreasuryAPIRequestTypes.POST],
]);

// CreateTreasuryRequest and Response
export type CreateTreasuryRequest = { ownerID : number, type : Treasury.Type, name : string, location : Locations };
export type CreateTreasuryResponse = { message : string, treasuryID: number };

export type GetTreasuryAuditsRequest = { treasuryID : number };
export type GetTreasuryAuditsResponse = { treasuryID: string, auditLogs : Treasury.Audit[] };

export type GetTreasuryOwnerRequest = { treasuryID : number };
export type GetTreasuryOwnerResponse = { treasuryID : string, ownerID : number, };

export type GetTreasuryContainerRequest = { treasuryID : number };
export type GetTreasuryContainerResponse = { treasuryID : string, container : Treasury.Container };

export type GetTreasuryLocationResponse = number

export type GetTreasuryAccessTableRequest = { treasuryID : number };
export type GetTreasuryAccessTableResponse = { treasuryID : string, accessTable : Treasury.Permission[] | undefined };

export type GetTreasuryMarcsRequest = { treasuryID : number };
export type GetTreasuryMarcsResponse = { treasuryID : string, marcs : number};

export type GetTreasuryRequest = { treasuryID : number };
export type InternalGetTreasuryResponse = { treasuryID : string, ownerID: number, type : number, name : string, marcs : number, container: string, audit : string};
export type GetTreasuryResponse = { treasuryID : number, ownerID: number, type : number, name : string, marcs : number, container: Treasury.Container, audit : Treasury.Audit[], accessTable : Treasury.Permission[] | undefined, income : Treasury.IncomeSource[] | [] };

export type UpdateTreasuryNameRequest = { treasuryID : number, newName : string, playerID : number };
export type UpdateTreasuryNameResponse = { message : string };

export type UpdateTreasuryAccessRequest = { treasuryID : number, permissionTable : Treasury.Permission[], playerID : number};
export type UpdateTreasuryAccessResponse = { message : string };

export type UpdateTreasuryIncomeSourcesRequest = { treasuryID : number, incomesourceID : number, newTreasuryID : number, type: number, timeLastClaimed : number, level: number, playerID : number };
export type UpdateTreasuryIncomeSourcesResponse = { message : string };

export type AddTreasuryIncomeSourceRequest = { treasuryID : number, type: number, level: number, playerID : number, incomesourcesID : number};
export type AddTreasuryIncomeSourceResponse = { message : string, incomesourceID: number };

export type GetTreasuryIncomeSourcesRequest = { treasuryID : number };
export type GetTreasuryIncomeSourcesResponse = { treasuryID : string, incomeSources : Treasury.IncomeSource[] };

export type RemoveTreasuryMarcsRequest = { treasuryID : number, marcsRemoved : number, playerID : number };
export type RemoveTreasuryMarcsResponse = { message : string };

export type AddTreasuryMarcsRequest = { treasuryID : number, marcsAdded : number, playerID : number, paySlip : boolean | undefined, incomeSourceID : number | undefined, reason : string | undefined };
export type AddTreasuryMarcsResponse = { message : string };

export type RemoveTreasuryContentItemRequest = { treasuryID : number, itemUID : number, playerID : number };
export type RemoveTreasuryContentItemResponse = { message : string };

export type AddTreasuryContentItemRequest = { treasuryID : number, itemID: number, itemUID : number, playerID : number, metadata: unknown[] };
export type AddTreasuryContentItemResponse = { message : string, itemDetails: { itemID: number, itemUID: number, metadata: unknown[] } };

export type UpdateTreasuryOwnerRequest = { treasuryID : number, newOwnerID : number, playerID : number };
export type UpdateTreasuryOwnerResponse = { message : string };

export type GetUsersTreasuriesRequest = { ownerID : number, hasAccess : boolean };
export type GetUsersTreasuriesResponse = {marcs : number, name : string, treasuryID: number}[];

export type ResetRequest = { };
export type ResetResponse = { message : string };

// TreasuryAPIServiceRunner.createTreasury(this.instance.UserId, Treasury.Type.PERSONAL, "Personal Treasury", Treasury.Location.SHIGANSHINA).then(async (response) => {
//     const data = await TreasuryAPIServiceRunner.getTreasury(response.treasuryID)
//     print("Before changes:", data)

//     await TreasuryAPIServiceRunner.updateTreasuryName(response.treasuryID, "Testing Name", this.instance.UserId); task.wait(2)
//     await TreasuryAPIServiceRunner.updateTreasuryOwner(response.treasuryID, 1, this.instance.UserId); task.wait(2)
//     await TreasuryAPIServiceRunner.addTreasuryMarcs(response.treasuryID, 100, this.instance.UserId); task.wait(2)
//     await TreasuryAPIServiceRunner.removeTreasuryMarcs(response.treasuryID, 50, this.instance.UserId); task.wait(2)
//     await TreasuryAPIServiceRunner.addTreasuryContentItem(response.treasuryID, 1, 5, this.instance.UserId, [1, "Test Item"]); task.wait(2)
//     await TreasuryAPIServiceRunner.removeTreasuryContentItem(response.treasuryID, 5, this.instance.UserId); task.wait(2)

//     await TreasuryAPIServiceRunner.updateTreasuryAccess(response.treasuryID, [{user: this.instance.UserId, withdraw_item_limit: 100, withdraw_marc_limit: 100}], this.instance.UserId)
    
//     task.wait(1)

//     await TreasuryAPIServiceRunner.getTreasuryAccessTable(response.treasuryID).then(async (tbl) => {
//         print("Before Access table:", tbl)

//         task.wait(2)

//         await TreasuryAPIServiceRunner.updateTreasuryAccess(response.treasuryID, [{user: this.instance.UserId, withdraw_item_limit: 50, withdraw_marc_limit: 50}], this.instance.UserId)
//         print("After Access table:", await TreasuryAPIServiceRunner.getTreasuryAccessTable(response.treasuryID))
//     })

//     await TreasuryAPIServiceRunner.addTreasuryIncomeSource(response.treasuryID, 5, 5, this.instance.UserId).then(async (source) => {
//         task.wait(2)

//         await TreasuryAPIServiceRunner.addTreasuryMarcs(response.treasuryID, 100, this.instance.UserId, true, source.incomesourceID);
//         const income_sources = await TreasuryAPIServiceRunner.getTreasuryIncomeSources(response.treasuryID)

//         print("After claimed income changes:", income_sources)
//     })

//     const treasury = await TreasuryAPIServiceRunner.getTreasury(response.treasuryID)
//     const income_sources = await TreasuryAPIServiceRunner.getTreasuryIncomeSources(response.treasuryID)
    
//     print("After changes:", treasury, income_sources)
// }).catch((e) => {
//     warn(e)
// })


// const treasury = await TreasuryAPIServiceRunner.createTreasury(1, Treasury.Type.PERSONAL, "Testing Treasury Wow!", Treasury.Location.SHIGANSHINA)
// const access = await TreasuryAPIServiceRunner.getTreasuryAccessTable(treasury.treasuryID);

// const access_tbl = access.accessTable ?? [];
// access_tbl.push({user: this.player.getUserId(), withdraw_item_limit: 1000, withdraw_marc_limit: 1000});

// await TreasuryAPIServiceRunner.updateTreasuryAccess(treasury.treasuryID, access_tbl, 1)

// // Get the player's treasuries.
// const treasuries = await TreasuryAPIServiceRunner.getUsersTreasuries(this.player.getUserId(), true);
// print(treasuries);

export default class TreasuryAPIServiceRunner {
    private static url = "http://162.248.102.189:1234/";

    /**
     * Get the secret key for the treasury API.
     * 
     * @returns { string }
     * 
     * @author NodeSupport
     */
    private static getTreasuryAPISecretKey() {
        return "mjgjvftuqhendjsboe"
    }

    /**
     * Send a POST request to the treasury API. Will convert the body to JSON.
     * If the request is a get request, the body will be appended to the URL as a query string.
     * 
     * @param request The request to send
     * @param body The body of the request
     * @returns { Tuple<HttpResponse, TreasuryAPIResponse> }
     * 
     * @author NodeSupport
     */
    private static sendPostToTreasuryAPI(request : TreasuryAPIEndpoints, body : Record<string, unknown>) : LuaTuple<[RequestAsyncResponse, unknown]> {
        const method = TreasuryAPIEndpointMethods.get(request);;
        let url = this.url + request;

        const headers = {
            "Content-Type": "application/json",
            "authorization": this.getTreasuryAPISecretKey(),
        };

        if(method === TreasuryAPIRequestTypes.GET) {
            // Append the body to the URL as a query string
            const append: string = Object.keys(body).map((key) => `${key}=${body[key]}`).join("&");
            
            // Append the query string to the URL
            url += `?${append}`;
        }

        const response = HttpService.RequestAsync({
            Url: url,
            Method: method,
            Headers: headers,
            Body: method === TreasuryAPIRequestTypes.GET ? undefined : HttpService.JSONEncode(body),
        });

        const [ success, decoded ] = pcall(() => HttpService.JSONDecode(response.Body)) as LuaTuple<[boolean, TreasuryAPIResponse]>;
        if(!success) return $tuple(response, { error: response.Body });

        return $tuple(response, decoded)
    };

    /**
     * Create a request promise to the treasury API.
     *  
     * @param request The request to send
     * @param body The body of the request
     * @returns { Promise<T> }
     * 
     * @author NodeSupport
     */
    private static createRequestPromise<T>(request : TreasuryAPIEndpoints, body : unknown) : Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const [ response, decoded ] = this.sendPostToTreasuryAPI(request, body as Record<string, unknown>);

            // Reject if the request was not successful
            if(!response.Success) return reject((decoded as unknown as {error : string}).error);
            return resolve(decoded as T)
        })
    }

    /**
     * Create a new treasury for a player or group.
     * 
     * @param ownerID The ID of the owner of the treasury
     * @param treasuryType The type of treasury
     * @param name The name of the treasury
     * @returns { Promise<CreateTreasuryResponse> }
     * 
     * @author NodeSupport
     */
    public static createTreasury(ownerID : number, treasuryType : Treasury.Type, name : string, location : Locations) : Promise<CreateTreasuryResponse> {
        const request : CreateTreasuryRequest = { ownerID, type: treasuryType, name, location };
        return this.createRequestPromise(TreasuryAPIEndpoints.CREATE_TREASURY, request) as Promise<CreateTreasuryResponse>;
    }

    /**
     * Get the audits for a treasury.
     * 
     * @param treasuryID The ID of the treasury
     * @returns { Promise<GetTreasuryAuditsResponse> }
     * 
     * @author NodeSupport
     */
    public static getTreasuryAudits(treasuryID : number) : Promise<GetTreasuryAuditsResponse> {
        const request : GetTreasuryAuditsRequest = { treasuryID };
        return this.createRequestPromise(TreasuryAPIEndpoints.GET_TREASURY_AUDITS, request) as Promise<GetTreasuryAuditsResponse>;
    }

    /**
     * Get the owner of a treasury.
     * 
     * @param treasuryID The ID of the treasury
     * @returns { Promise<GetTreasuryOwnerResponse> }
     * 
     * @author NodeSupport
     */
    public static getTreasuryOwner(treasuryID : number) : Promise<GetTreasuryOwnerResponse> {
        const request : GetTreasuryOwnerRequest = { treasuryID };
        return this.createRequestPromise(TreasuryAPIEndpoints.GET_TREASURY_OWNER, request) as Promise<GetTreasuryOwnerResponse>;
    }

    /**
     * Gets the container of a treasury.
     * 
     * @param treasuryID The ID of the treasury to get the container of
     * @returns { Promise<GetTreasuryContainerResponse> }
     * 
     * @author NodeSupport
     */
    public static getTreasuryContainer(treasuryID : number) : Promise<GetTreasuryContainerResponse> {
        const request : GetTreasuryContainerRequest = { treasuryID };
        return this.createRequestPromise(TreasuryAPIEndpoints.GET_TREASURY_CONTAINER, request) as Promise<GetTreasuryContainerResponse>;
    }

    /**
     * Get the location of a treasury.
     * 
     * @param treasuryID The ID of the treasury
     * @returns { Promise<GetTreasuryLocationResponse> }
     * 
     * @author NodeSupport
     */
    public static getTreasuryLocation(treasuryID : number) : Promise<GetTreasuryLocationResponse> {
        const container = this.getTreasuryContainer(treasuryID);
        return container.then((response) => response.container.location) as Promise<GetTreasuryLocationResponse>;
    }

    /**
     * Get the access table of a treasury.
     * 
     * @param treasuryID The ID of the treasury
     * @returns { Promise<GetTreasuryAccessTableResponse> }
     * 
     * @author NodeSupport
     */
    public static getTreasuryAccessTable(treasuryID : number) : Promise<GetTreasuryAccessTableResponse> {
        const request : GetTreasuryAccessTableRequest = { treasuryID };
        return this.createRequestPromise(TreasuryAPIEndpoints.GET_TREASURY_ACCESS, request) as Promise<GetTreasuryAccessTableResponse>;
    }

    /**
     * Get the marcs of a treasury.
     * 
     * @param treasuryID The ID of the treasury
     * @returns { Promise<GetTreasuryMarcsResponse>}
     * 
     * @author NodeSupport
     */
    public static getTreasuryMarcs(treasuryID : number) : Promise<GetTreasuryMarcsResponse> {
        const request : GetTreasuryMarcsRequest = { treasuryID };
        return this.createRequestPromise(TreasuryAPIEndpoints.GET_TREASURY_MARCS, request) as Promise<GetTreasuryMarcsResponse>;
    }

    /**
     * Get all relevant information about a treasury.
     * 
     * @param treasuryID The ID of the treasury
     * @returns { Promise<GetTreasuryResponse> }
     * 
     * @author NodeSupport
     */
    public static getTreasury(treasuryID : number) : Promise<GetTreasuryResponse> {
        // Create the request
        const request : GetTreasuryRequest = { treasuryID };

        // Return a promise
        return new Promise((resolve, reject) => {
            // Create the request promise
            this.createRequestPromise<InternalGetTreasuryResponse>(TreasuryAPIEndpoints.GET_TREASURY, request)
                .then((response) => {
                    return resolve({
                        treasuryID: response.treasuryID,    // Convert the response to the correct type
                        ownerID: response.ownerID,          // Convert the response to the correct type
                        type: response.type,                // Convert the response to the correct type
                        name: response.name,                // Convert the response to the correct type
                        marcs: response.marcs,              // Convert the response to the correct type

                        // Format to encode the container and audit
                        container: HttpService.JSONDecode(response.container),
                        audit: HttpService.JSONDecode(response.audit),
                    } as unknown as GetTreasuryResponse)
                })
                // Reject if there is an error
                .catch((e) => reject(e))
        })
    }

    /**
     * Update the name of a treasury.
     * 
     * @param treasuryID The ID of the treasury
     * @param newName The new name of the treasury
     * @param playerID The ID of the player updating the treasury
     * @returns { Promise<UpdateTreasuryNameResponse> }
     * 
     * @author NodeSupport
     */
    public static updateTreasuryName(treasuryID : number, newName : string, playerID : number) : Promise<UpdateTreasuryNameResponse> {
        const request : UpdateTreasuryNameRequest = { treasuryID, newName, playerID };
        return this.createRequestPromise(TreasuryAPIEndpoints.UPDATE_TREASURY_NAME, request) as Promise<UpdateTreasuryNameResponse>;
    }

    /**
     * Update the access table of a treasury. This overrides the access table with whatever
     * you provide as an argument. If you want to add or remove a user, you should get the
     * current access table, modify it, and then update it.
     * 
     * @param treasuryID The ID of the treasury
     * @param permissionTable The new permission table
     * @param playerID The ID of the player updating the treasury
     * @returns { Promise<UpdateTreasuryAccessResponse> }
     * 
     * @author NodeSupport
     */
    public static updateTreasuryAccess(treasuryID : number, permissionTable  : Treasury.Permission[], playerID : number) : Promise<UpdateTreasuryAccessResponse> {
        const request : UpdateTreasuryAccessRequest = { treasuryID, permissionTable, playerID };
        return this.createRequestPromise(TreasuryAPIEndpoints.UPDATE_TREASURY_ACCESS, request) as Promise<UpdateTreasuryAccessResponse>;
    }

    /**
     * Update the income source of a treasury.
     * Can optionally move the income source to a new treasury.
     * 
     * @param treasuryID The ID of the treasury
     * @param incomesourceID The ID of the income source
     * @param newTreasuryID The ID of the new treasury
     * @param incomeSourceType The type of income source
     * @param level The level of the income source
     * @param playerID The ID of the player updating the treasury
     * @returns { Promise<UpdateTreasuryIncomeSourcesResponse> }
     * 
     * @author NodeSupport
     */
    public static updateTreasuryIncomeSource(treasuryID : number, incomesourceID : number, newTreasuryID : number, incomeSourceType: number, timeLastClaimed : number, level: number, playerID : number) : Promise<UpdateTreasuryIncomeSourcesResponse> {
        const request : UpdateTreasuryIncomeSourcesRequest = { treasuryID, incomesourceID, newTreasuryID, type: incomeSourceType, timeLastClaimed, level, playerID };
        return this.createRequestPromise(TreasuryAPIEndpoints.UPDATE_TREASURY_INCOME_SOURCES, request) as Promise<UpdateTreasuryIncomeSourcesResponse>;
    }

    /**
     * Adds an income source to a treasury. Returning the income source ID.
     * 
     * @param treasuryID The ID of the treasury
     * @param incomeSourceType The type of income source
     * @param level The level of the income source
     * @param playerID The ID of the player updating the treasury
     * @returns { Promise<AddTreasuryIncomeSourceResponse> }
     * 
     * @author NodeSupport
     */
    public static addTreasuryIncomeSource(treasuryID : number, incomeSourceType: number, level: number, playerID : number) : Promise<AddTreasuryIncomeSourceResponse> {
        const incomesourcesID = math.random(100000, 999999)
        const request : AddTreasuryIncomeSourceRequest = { treasuryID, incomesourcesID, type: incomeSourceType, level, playerID };
        
        return this.createRequestPromise(TreasuryAPIEndpoints.ADD_TREASURY_INCOME_SOURCE, request) as Promise<AddTreasuryIncomeSourceResponse>;
    }

    /**
     * Get the income sources of a treasury.
     * 
     * @param treasuryID The ID of the treasury
     * @returns { Promise<GetTreasuryIncomeSourcesResponse> }
     * 
     * @author NodeSupport
     */
    public static getTreasuryIncomeSources(treasuryID : number) : Promise<GetTreasuryIncomeSourcesResponse> {
        const request : GetTreasuryIncomeSourcesRequest = { treasuryID };
        return this.createRequestPromise(TreasuryAPIEndpoints.GET_TREASURY_INCOME_SOURCES, request) as Promise<GetTreasuryIncomeSourcesResponse>;
    }

    /**
     * Remove marcs from a treasury.
     * 
     * @param treasuryID The ID of the treasury
     * @param marcsRemoved The amount of marcs to remove
     * @param playerID The ID of the player removing the marcs
     * @returns { Promise<RemoveTreasuryMarcsResponse> }
     * 
     * @author NodeSupport
     */
    public static removeTreasuryMarcs(treasuryID : number, marcsRemoved : number, playerID : number) : Promise<RemoveTreasuryMarcsResponse> {
        const request : RemoveTreasuryMarcsRequest = { treasuryID, marcsRemoved, playerID };
        return this.createRequestPromise(TreasuryAPIEndpoints.REMOVE_TREASURY_MARCS, request) as Promise<RemoveTreasuryMarcsResponse>;
    }

    /**
     * Add marcs to a treasury. Optionally, you can specify if the marcs are from a payslip.
     * If the marcs are from a payslip, you should also provide the income source ID of the payslip.
     * This will update the income sources' claimed timestamp.
     * 
     * @param treasuryID The ID of the treasury
     * @param marcsAdded The amount of marcs to add
     * @param playerID The ID of the player adding the marcs
     * @param paySlip True if the marcs are from a payslip
     * @param incomeSourceID The ID of the income source if the marcs are from a payslip
     * @returns { Promise<AddTreasuryMarcsResponse> }
     * 
     * @author NodeSupport
     */
    public static addTreasuryMarcs(treasuryID : number, marcsAdded : number, playerID : number, paySlip? : boolean, incomeSourceID? : number, reason?: string) : Promise<AddTreasuryMarcsResponse> {
        const request : AddTreasuryMarcsRequest = { treasuryID, marcsAdded, playerID, paySlip, incomeSourceID, reason };
        return this.createRequestPromise(TreasuryAPIEndpoints.ADD_TREASURY_MARCS, request) as Promise<AddTreasuryMarcsResponse>;
    }

    /**
     * Remove an item from a treasury.
     *  
     * @param treasuryID The ID of the treasury
     * @param itemUID The UID of the item to remove
     * @param playerID The ID of the player removing the item
     * @returns { Promise<RemoveTreasuryContentItemResponse> }
     * 
     * @author NodeSupport
     */
    public static removeTreasuryContentItem(treasuryID : number, itemUID : number, playerID : number) : Promise<RemoveTreasuryContentItemResponse> {
        const request : RemoveTreasuryContentItemRequest = { treasuryID, itemUID, playerID };
        return this.createRequestPromise(TreasuryAPIEndpoints.REMOVE_TREASURY_CONTENT_ITEM, request) as Promise<RemoveTreasuryContentItemResponse>;
    }

    /**
     * Add an item to a treasury.
     * 
     * @param treasuryID The ID of the treasury
     * @param itemType The type of item
     * @param itemUID The UID of the item
     * @param playerID The ID of the player adding the item
     * @param metadata The metadata of the item (array of unknowns)
     * @returns { Promise<AddTreasuryContentItemResponse> }
     * 
     * @author NodeSupport
     */
    public static addTreasuryContentItem(treasuryID : number, itemType: number, itemUID : number, playerID : number, metadata: unknown[]) : Promise<AddTreasuryContentItemResponse> {
        const request : AddTreasuryContentItemRequest = { treasuryID, itemID: itemType, itemUID, playerID, metadata };
        return this.createRequestPromise(TreasuryAPIEndpoints.ADD_TREASURY_CONTENT_ITEM, request) as Promise<AddTreasuryContentItemResponse>;
    }

    /**
     * Update the owner of a treasury. Typically used for transferring ownership upon
     * a players death or when a branch/bloodline leadership changes.
     * 
     * @param treasuryID The ID of the treasury
     * @param newOwnerID The ID of the new owner
     * @param playerID The ID of the player updating the treasury
     * @returns { Promise<UpdateTreasuryOwnerResponse> }
     * 
     * @author NodeSupport
     */
    public static updateTreasuryOwner(treasuryID : number, newOwnerID : number, playerID : number) : Promise<UpdateTreasuryOwnerResponse> {
        const request : UpdateTreasuryOwnerRequest = { treasuryID, newOwnerID, playerID };
        return this.createRequestPromise(TreasuryAPIEndpoints.UPDATE_TREASURY_OWNER, request) as Promise<UpdateTreasuryOwnerResponse>;
    }

    /**
     * Get all treasuries owned by a player.
     * 
     * @param ownerID The ID of the owner
     * @param hasAccess Whether or not to search for treasuries the player has access to
     * @returns { Promise<GetUsersTreasuriesResponse> }
     * 
     * @author NodeSupport
     */
    public static getUsersTreasuries(ownerID : number, hasAccess : boolean = false) : Promise<GetUsersTreasuriesResponse> {
        const request : GetUsersTreasuriesRequest = { ownerID, hasAccess };
        return this.createRequestPromise<GetUsersTreasuriesResponse>(TreasuryAPIEndpoints.GET_USERS_TREASURIES, request);
    }

    public static reset() : Promise<ResetResponse> {
        const request : ResetRequest = { };
        return this.createRequestPromise<ResetResponse>(TreasuryAPIEndpoints.RESET, request);
    };
}