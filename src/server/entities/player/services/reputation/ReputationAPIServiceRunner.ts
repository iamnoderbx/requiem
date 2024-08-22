import Object from "@rbxts/object-utils";
import { HttpService } from "@rbxts/services";
import { ReputationInstance, ReputationLocation } from "selectors/LocationSharedSelectors";

type ReputationAPIResponse = { 
    Success: boolean, 
    Body: unknown, 
    StatusCode: number, 
    StatusMessage: string
};

enum ReputationAPIEndpoints {
    CREATE_LOCATION = "location/add",
	GET_LOCATION = "location/get",
	GET_LOCATION_BY_GOVERNOR = "location/get/governor",

	UPDATE_LOCATION_GOVERNOR = "location/update/governor",
	UPDATE_LOCATION_TAXES = "location/update/taxes",
	UPDATE_LOCATION_POPULATION = "location/update/population",
	UPDATE_LOCATION_BUSINESSES = "location/update/businesses",
	UPDATE_LOCATION_INCOME = "location/update/income",
	UPDATE_LOCATION_HAPPINESS = "location/update/happiness",
	UPDATE_LOCATION_OUTLOOK = "location/update/outlook",

	ADD_REPUTATION = "reputation/add",
	UPDATE_REPUTATION = "reputation/update",
	DELETE_REPUTATION = "reputation/delete",
	GET_REPUTATION = "reputation/get",
	GET_ALL_REPUTATIONS = "reputation/get/all",

	GET_EVERYTHING = "get/all",

    RESET = "reset",
}

enum ReputationAPIRequestTypes {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
}

const ReputationAPIEndpointMethods= new Map<ReputationAPIEndpoints, ReputationAPIRequestTypes>([
    [ReputationAPIEndpoints.CREATE_LOCATION, ReputationAPIRequestTypes.POST],
	[ReputationAPIEndpoints.GET_LOCATION, ReputationAPIRequestTypes.GET],
	[ReputationAPIEndpoints.GET_LOCATION_BY_GOVERNOR, ReputationAPIRequestTypes.GET],

	[ReputationAPIEndpoints.UPDATE_LOCATION_GOVERNOR, ReputationAPIRequestTypes.PUT],
	[ReputationAPIEndpoints.UPDATE_LOCATION_TAXES, ReputationAPIRequestTypes.PUT],
	[ReputationAPIEndpoints.UPDATE_LOCATION_POPULATION, ReputationAPIRequestTypes.PUT],
	[ReputationAPIEndpoints.UPDATE_LOCATION_BUSINESSES, ReputationAPIRequestTypes.PUT],
	[ReputationAPIEndpoints.UPDATE_LOCATION_INCOME, ReputationAPIRequestTypes.PUT],
	[ReputationAPIEndpoints.UPDATE_LOCATION_HAPPINESS, ReputationAPIRequestTypes.PUT],
	[ReputationAPIEndpoints.UPDATE_LOCATION_OUTLOOK, ReputationAPIRequestTypes.PUT],

	[ReputationAPIEndpoints.ADD_REPUTATION, ReputationAPIRequestTypes.POST],
	[ReputationAPIEndpoints.UPDATE_REPUTATION, ReputationAPIRequestTypes.PUT],
	[ReputationAPIEndpoints.DELETE_REPUTATION, ReputationAPIRequestTypes.DELETE],
	[ReputationAPIEndpoints.GET_REPUTATION, ReputationAPIRequestTypes.GET],
	[ReputationAPIEndpoints.GET_ALL_REPUTATIONS, ReputationAPIRequestTypes.GET],

	[ReputationAPIEndpoints.GET_EVERYTHING, ReputationAPIRequestTypes.GET],
	[ReputationAPIEndpoints.RESET, ReputationAPIRequestTypes.POST],
]);

export type CreateLocationResponse = { message: string };
export type GetLocationResponse = ReputationLocation

export type AddReputationResponse = { message : string };
export type UpdateReputationResponse = { message : string };
export type DeleteReputationResponse = { message : string };
export type GetReputationResponse = { id : number, type : number, name : string, reputation : number, location : number };
export type GetAllReputationsResponse = { reputations : Array<GetReputationResponse> }
export type GetLocationEverythingResponse = Array<{location : GetLocationResponse, reputation : Array<ReputationInstance>}>;

export type ResetResponse = { message : string };

export default class ReputationAPIServiceRunner {
    private static url = "http://162.248.102.189:1236/";

    /**
     * Get the secret key for the reputation API.
     * 
     * @returns { string }
     * 
     * @author NodeSupport
     */
    private static getReputationAPISecretKey() : string {
        return "247fgbefktyh8018kd"
    }

    /**
     * Send a POST request to the reputation API. Will convert the body to JSON.
     * If the request is a get request, the body will be appended to the URL as a query string.
     * 
     * @param request The request to send
     * @param body The body of the request
     * @returns { Tuple<HttpResponse, ReputationAPIResponse> }
     * 
     * @author NodeSupport
     */
    private static sendPostToReputationAPI(request : ReputationAPIEndpoints, body : Record<string, unknown>) : LuaTuple<[RequestAsyncResponse, unknown]> {
        const method = ReputationAPIEndpointMethods.get(request);;
        let url = this.url + request;

        const headers = {
            "Content-Type": "application/json",
            "authorization": this.getReputationAPISecretKey(),
        };

        if(method === ReputationAPIRequestTypes.GET) {
            // Append the body to the URL as a query string
            const append: string = Object.keys(body).map((key) => `${key}=${body[key]}`).join("&");
            
            // Append the query string to the URL
            url += `?${append}`;
        }

        const response = HttpService.RequestAsync({
            Url: url,
            Method: method,
            Headers: headers,
            Body: method === ReputationAPIRequestTypes.GET ? undefined : HttpService.JSONEncode(body),
        });

        const [ success, decoded ] = pcall(() => HttpService.JSONDecode(response.Body)) as LuaTuple<[boolean, ReputationAPIResponse]>;
        if(!success) return $tuple(response, { error: response.Body });

        return $tuple(response, decoded)
    };

    /**
     * Create a request promise to the reputation API.
     *  
     * @param request The request to send
     * @param body The body of the request
     * @returns { Promise<T> }
     * 
     * @author NodeSupport
     */
    private static createRequestPromise<T>(request : ReputationAPIEndpoints, body : unknown) : Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const [ response, decoded ] = this.sendPostToReputationAPI(request, body as Record<string, unknown>);

            // Reject if the request was not successful
            if(!response.Success) return reject((decoded as unknown as {error : string}).error);
            return resolve(decoded as T)
        })
    }

	public static async createLocation(name : string, typeIs : number, population : number, average_income : number, happiness : number, outlook : number, governor : number, civilian_tax : number, industrial_tax : number, businesses : number) : Promise<CreateLocationResponse> {
		return this.createRequestPromise<CreateLocationResponse>(ReputationAPIEndpoints.CREATE_LOCATION, { name, type: typeIs, population, average_income, happiness, outlook, governor, civilian_tax, industrial_tax, businesses });
	}

	public static async getLocation(name : string, typeIs : number) : Promise<GetLocationResponse> {
		return this.createRequestPromise<GetLocationResponse>(ReputationAPIEndpoints.GET_LOCATION, { name, type: typeIs });
	}

	public static async getLocationByGovernor(governor : number) : Promise<GetLocationResponse> {
		return this.createRequestPromise<GetLocationResponse>(ReputationAPIEndpoints.GET_LOCATION_BY_GOVERNOR, { governor });
	}

	public static async updateLocationGovernor(id : number, governor : number) : Promise<CreateLocationResponse> {
		return this.createRequestPromise<CreateLocationResponse>(ReputationAPIEndpoints.UPDATE_LOCATION_GOVERNOR, { id, governor });
	}

	public static async updateLocationTaxes(id : number, civilian_tax : number, industrial_tax : number) : Promise<CreateLocationResponse> {
		return this.createRequestPromise<CreateLocationResponse>(ReputationAPIEndpoints.UPDATE_LOCATION_TAXES, { id, civilian_tax, industrial_tax });
	}

	public static async updateLocationPopulation(id : number, population : number) : Promise<CreateLocationResponse> {
		return this.createRequestPromise<CreateLocationResponse>(ReputationAPIEndpoints.UPDATE_LOCATION_POPULATION, { id, population });
	}

	public static async updateLocationBusinesses(id : number, businesses : number) : Promise<CreateLocationResponse> {
		return this.createRequestPromise<CreateLocationResponse>(ReputationAPIEndpoints.UPDATE_LOCATION_BUSINESSES, { id, businesses });
	}

	public static async updateLocationIncome(id : number, average_income : number) : Promise<CreateLocationResponse> {
		return this.createRequestPromise<CreateLocationResponse>(ReputationAPIEndpoints.UPDATE_LOCATION_INCOME, { id, average_income });
	}

	public static async updateLocationHappiness(id : number, happiness : number) : Promise<CreateLocationResponse> {
		return this.createRequestPromise<CreateLocationResponse>(ReputationAPIEndpoints.UPDATE_LOCATION_HAPPINESS, { id, happiness });
	}

	public static async updateLocationOutlook(id : number, outlook : number) : Promise<CreateLocationResponse> {
		return this.createRequestPromise<CreateLocationResponse>(ReputationAPIEndpoints.UPDATE_LOCATION_OUTLOOK, { id, outlook });
	}
	
	public static async addReputation(name : string, typeIs : number, reputation : number, location : number) : Promise<AddReputationResponse> {
		return this.createRequestPromise<AddReputationResponse>(ReputationAPIEndpoints.ADD_REPUTATION, { name, type: typeIs, reputation, location });
	}

	public static async updateReputation(id : number, reputation : number) : Promise<UpdateReputationResponse> {
		return this.createRequestPromise<UpdateReputationResponse>(ReputationAPIEndpoints.UPDATE_REPUTATION, { id, reputation });
	}

	public static async deleteReputation(id : number) : Promise<DeleteReputationResponse> {
		return this.createRequestPromise<DeleteReputationResponse>(ReputationAPIEndpoints.DELETE_REPUTATION, { id });
	}

	public static async getReputation(name : string, location : number) : Promise<GetReputationResponse> {
		return this.createRequestPromise<GetReputationResponse>(ReputationAPIEndpoints.GET_REPUTATION, { name, location });
	}

	public static async getAllReputations(location : number) : Promise<GetAllReputationsResponse> {
		return this.createRequestPromise<GetAllReputationsResponse>(ReputationAPIEndpoints.GET_ALL_REPUTATIONS, { location });
	}

	public static async getEverything() : Promise<GetLocationEverythingResponse> {
		return this.createRequestPromise<GetLocationEverythingResponse>(ReputationAPIEndpoints.GET_EVERYTHING, {});
	}

	public static async reset() : Promise<ResetResponse> {
		return this.createRequestPromise<ResetResponse>(ReputationAPIEndpoints.RESET, {});
	}
}