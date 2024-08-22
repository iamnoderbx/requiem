import Object from "@rbxts/object-utils";
import { HttpService } from "@rbxts/services";

type PlotsAPIResponse = { 
    Success: boolean, 
    Body: unknown, 
    StatusCode: number, 
    StatusMessage: string
};

enum PlotsAPIEndpoints {
    ADD_PLOT = "plots/add",
	GET_PLOT = "plots/get",
	GET_USER_PLOTS = "plots/getAll",
    ADD_ASSET = "assets/add",
	RESET = "reset"
}

enum PlotsAPIRequestTypes {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
}

const PlotsAPIEndpointMethods= new Map<PlotsAPIEndpoints, PlotsAPIRequestTypes>([
    [PlotsAPIEndpoints.ADD_PLOT, PlotsAPIRequestTypes.POST],
	[PlotsAPIEndpoints.GET_PLOT, PlotsAPIRequestTypes.GET],
	[PlotsAPIEndpoints.GET_USER_PLOTS, PlotsAPIRequestTypes.GET],

    [PlotsAPIEndpoints.ADD_ASSET, PlotsAPIRequestTypes.POST], // assetId, plotId, x, y, z, built, owner, properties

	[PlotsAPIEndpoints.RESET, PlotsAPIRequestTypes.POST]
]);

export type ResetResponse = { message: string };
export type AddPlotResponse = { message: string };

export type PlotAssetType = {
    assetId : number,
    plotId : number,

    x : number,
    y : number,
    z : number,

    built: boolean,
    properties: number[],

    owner: number,
};

export type GetPlotResponse = { id: number, owner : number };
export type GetUsersPlotsResponse = GetPlotResponse[];
export type AddAssetResponse = { message: string };

export default class PlotsAPIServiceRunner {
    private static url = "http://162.248.102.189:1237/";

    /**
     * Get the secret key for the reputation API.
     * 
     * @returns { string }
     * 
     * @author NodeSupport
     */
    private static getPlotsAPISecretKey() : string {
        return "r67guiklsapol124"
    }

    /**
     * Send a POST request to the plots API. Will convert the body to JSON.
     * If the request is a get request, the body will be appended to the URL as a query string.
     * 
     * @param request The request to send
     * @param body The body of the request
     * @returns { Tuple<HttpResponse, PlotsAPIResponse> }
     * 
     * @author NodeSupport
     */
    private static sendPostToPlotsAPI(request : PlotsAPIEndpoints, body : Record<string, unknown>) : LuaTuple<[RequestAsyncResponse, unknown]> {
        const method = PlotsAPIEndpointMethods.get(request);;
        let url = this.url + request;

        const headers = {
            "Content-Type": "application/json",
            "authorization": this.getPlotsAPISecretKey(),
        };

        if(method === PlotsAPIRequestTypes.GET) {
            // Append the body to the URL as a query string
            const append: string = Object.keys(body).map((key) => `${key}=${body[key]}`).join("&");
            
            // Append the query string to the URL
            url += `?${append}`;
        }

        const response = HttpService.RequestAsync({
            Url: url,
            Method: method,
            Headers: headers,
            Body: method === PlotsAPIRequestTypes.GET ? undefined : HttpService.JSONEncode(body),
        });

        const [ success, decoded ] = pcall(() => HttpService.JSONDecode(response.Body)) as LuaTuple<[boolean, PlotsAPIResponse]>;
        if(!success) return $tuple(response, { error: response.Body });

        return $tuple(response, decoded)
    };

    /**
     * Create a request promise to the plots API.
     *  
     * @param request The request to send
     * @param body The body of the request
     * @returns { Promise<T> }
     * 
     * @author NodeSupport
     */
    private static createRequestPromise<T>(request : PlotsAPIEndpoints, body : unknown) : Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const [ response, decoded ] = this.sendPostToPlotsAPI(request, body as Record<string, unknown>);

            // Reject if the request was not successful
            if(!response.Success) return reject((decoded as unknown as {error : string}).error);
            return resolve(decoded as T)
        })
    }

	public static async addPlot(id : number, owner : number) : Promise<AddPlotResponse> {
		return this.createRequestPromise<AddPlotResponse>(PlotsAPIEndpoints.ADD_PLOT, { id, owner });
	}

	public static async getPlot(id: number) : Promise<GetPlotResponse> {
		return this.createRequestPromise<GetPlotResponse>(PlotsAPIEndpoints.GET_PLOT, { id });
	}

	public static async getUserPlots(owner: number) : Promise<GetUsersPlotsResponse> {
		return this.createRequestPromise<GetUsersPlotsResponse>(PlotsAPIEndpoints.GET_USER_PLOTS, { owner });
	}

    public static async addAsset(asset: PlotAssetType) : Promise<AddAssetResponse> {
        return this.createRequestPromise<AddPlotResponse>(PlotsAPIEndpoints.ADD_ASSET, asset);
    };

	public static async reset() : Promise<ResetResponse> {
		return this.createRequestPromise<ResetResponse>(PlotsAPIEndpoints.RESET, {});
	}
}