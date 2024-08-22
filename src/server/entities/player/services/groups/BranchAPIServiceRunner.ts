import Object from "@rbxts/object-utils";
import { HttpService } from "@rbxts/services";

type BranchAPIResponse = {
    Success: boolean,
    Body: unknown,
    StatusCode: number,
    StatusMessage: string
};

enum BranchAPIEndpoints {
    CREATE_BRANCH = "branch/create",
    GET_BRANCH = "branch/get",
    CREATE_RANK = "branch/rank/create",
    GET_RANKS = "branch/ranks/get",
    GET_NAME = "branch/name/get",
    DELETE_RANK = "branch/rank/delete",
    UPDATE_NAME = "branch/name/update",
    GET_TREASURY = "branch/treasury/get",
    UPDATE_TREASURY = "branch/treasury/update",

    DELETE_BRANCH = "branch/delete",

    GET_WAGES = "branch/wages/get",
    UPDATE_WAGES = "branch/wages/update",

    BRANCH_FROM_MEMBER = "member/branch",
    ADD_MEMBER = "branch/member/add",
    REMOVE_MEMBER = "branch/member/remove",
    GET_MEMBER = "branch/member/get",
    GET_RANK = "branch/member/rank/get",
    GET_WAGE = "branch/member/wage/get",
    UPDATE_MEMBER = "branch/member/update",
    GET_MEMBERS = "branch/members/get",
    SET_RANK = "branch/member/rank/set",
    PROMOTE_MEMBER = "branch/member/promote",

    CREATE_DETACHMENT = "branch/detachment/create",
    SET_MEMBER_DETACHMENT = "branch/member/detachment/set",
    GET_DETACHMENT = "branch/detachment/get",
    GET_BRANCH_DETACHMENTS = "branch/detachments/get",
    UPDATE_DETACHMENT = "branch/detachment/update",
    DELETE_DETACHMENT = "branch/detachment/delete",
    GET_DETACHMENT_MEMBERS = "branch/detachment/members/get",
    ADD_DETACHMENT_MEMBER = "branch/detachment/member/add",
    REMOVE_DETACHMENT_MEMBER = "branch/detachment/member/remove",

    UPDATE_POINTS = "branch/points/update",
    ADD_POINTS = "branch/points/add",
    REMOVE_POINTS = "branch/points/remove",
    GET_POINTS = "branch/points/get",

    GET_SHOUT = "branch/shout/get",
    UPDATE_SHOUT = "branch/shout/update",

    GET_ICON = "branch/icon/get",
    UPDATE_ICON = "branch/icon/update",
    
    GET_BRANCH_TRANSFERS = "branch/transfers/get",
    ACCEPT_BRANCH_TRANSFRER = "branch/transfer/accept",
    DELETE_BRANCH_TRANSFER = "branch/transfer/delete",
    ADD_BRANCH_TRANSFER = "branch/transfer/add",

    ADD_AUDIT = "audit/add",
    GET_AUDITS = "audit/get",

    RESET = "reset",
}

enum BranchAPIRequestTypes {
    GET = "GET",
    POST = "POST",
    PUT = "POST",
    DELETE = "DELETE",
}

const BranchAPIEndpointMethods = new Map<BranchAPIEndpoints, BranchAPIRequestTypes>([
    [BranchAPIEndpoints.CREATE_BRANCH, BranchAPIRequestTypes.POST],
    [BranchAPIEndpoints.GET_BRANCH, BranchAPIRequestTypes.GET],
    [BranchAPIEndpoints.CREATE_RANK, BranchAPIRequestTypes.POST],
    [BranchAPIEndpoints.GET_RANKS, BranchAPIRequestTypes.GET],
    [BranchAPIEndpoints.GET_NAME, BranchAPIRequestTypes.GET],
    [BranchAPIEndpoints.DELETE_RANK, BranchAPIRequestTypes.DELETE],
    [BranchAPIEndpoints.UPDATE_NAME, BranchAPIRequestTypes.PUT],
    [BranchAPIEndpoints.GET_TREASURY, BranchAPIRequestTypes.GET],
    [BranchAPIEndpoints.UPDATE_TREASURY, BranchAPIRequestTypes.PUT],
    [BranchAPIEndpoints.DELETE_BRANCH, BranchAPIRequestTypes.DELETE],
    [BranchAPIEndpoints.GET_WAGES, BranchAPIRequestTypes.GET],
    [BranchAPIEndpoints.UPDATE_WAGES, BranchAPIRequestTypes.PUT],
    [BranchAPIEndpoints.GET_MEMBERS, BranchAPIRequestTypes.GET],

    [BranchAPIEndpoints.BRANCH_FROM_MEMBER, BranchAPIRequestTypes.GET],
    [BranchAPIEndpoints.ADD_MEMBER, BranchAPIRequestTypes.POST],
    [BranchAPIEndpoints.REMOVE_MEMBER, BranchAPIRequestTypes.POST],
    [BranchAPIEndpoints.GET_MEMBER, BranchAPIRequestTypes.GET],
    [BranchAPIEndpoints.SET_RANK, BranchAPIRequestTypes.PUT],
    [BranchAPIEndpoints.PROMOTE_MEMBER, BranchAPIRequestTypes.PUT],
    [BranchAPIEndpoints.UPDATE_MEMBER, BranchAPIRequestTypes.PUT],
    [BranchAPIEndpoints.GET_RANK, BranchAPIRequestTypes.GET],
    [BranchAPIEndpoints.GET_WAGE, BranchAPIRequestTypes.GET],

    [BranchAPIEndpoints.UPDATE_POINTS, BranchAPIRequestTypes.PUT],
    [BranchAPIEndpoints.ADD_POINTS, BranchAPIRequestTypes.POST],
    [BranchAPIEndpoints.REMOVE_POINTS, BranchAPIRequestTypes.DELETE],
    [BranchAPIEndpoints.GET_POINTS, BranchAPIRequestTypes.GET],

    [BranchAPIEndpoints.GET_SHOUT, BranchAPIRequestTypes.GET],
    [BranchAPIEndpoints.UPDATE_SHOUT, BranchAPIRequestTypes.PUT],

    [BranchAPIEndpoints.GET_ICON, BranchAPIRequestTypes.GET],
    [BranchAPIEndpoints.UPDATE_ICON, BranchAPIRequestTypes.PUT],

    [BranchAPIEndpoints.CREATE_DETACHMENT, BranchAPIRequestTypes.POST],
    [BranchAPIEndpoints.GET_DETACHMENT, BranchAPIRequestTypes.GET],
    [BranchAPIEndpoints.SET_MEMBER_DETACHMENT, BranchAPIRequestTypes.POST],
    [BranchAPIEndpoints.GET_BRANCH_DETACHMENTS, BranchAPIRequestTypes.GET],
    [BranchAPIEndpoints.UPDATE_DETACHMENT, BranchAPIRequestTypes.PUT],
    [BranchAPIEndpoints.DELETE_DETACHMENT, BranchAPIRequestTypes.DELETE],
    [BranchAPIEndpoints.GET_DETACHMENT_MEMBERS, BranchAPIRequestTypes.GET],
    [BranchAPIEndpoints.ADD_DETACHMENT_MEMBER, BranchAPIRequestTypes.POST],
    [BranchAPIEndpoints.REMOVE_DETACHMENT_MEMBER, BranchAPIRequestTypes.DELETE],

    [BranchAPIEndpoints.GET_BRANCH_TRANSFERS, BranchAPIRequestTypes.GET],
    [BranchAPIEndpoints.ACCEPT_BRANCH_TRANSFRER, BranchAPIRequestTypes.PUT],
    [BranchAPIEndpoints.DELETE_BRANCH_TRANSFER, BranchAPIRequestTypes.DELETE],
    [BranchAPIEndpoints.ADD_BRANCH_TRANSFER, BranchAPIRequestTypes.POST],

    [BranchAPIEndpoints.ADD_AUDIT, BranchAPIRequestTypes.POST],
    [BranchAPIEndpoints.GET_AUDITS, BranchAPIRequestTypes.GET],

    [BranchAPIEndpoints.RESET, BranchAPIRequestTypes.POST],

]);

export type BranchDetachmentType =  {detachment_id: number, detachment_name: string, r : number, g: number, b: number, abbreviation: string, players: number}

export type CreateBranchResponse = { message: string, id: number };
export type GetBranchResponse = { branch_id: number, name: string, icon : string, shout : string, memberCount : number, commander : number | undefined };
export type CreateBranchRankResponse = { message: string, rank_id: number };
export type GetBranchRanksResponse = { ranks: Array<{ name: string, wage: number, id: number, rank_id: number, branch_id: number }> };
export type GetBranchNameResponse = { name: string };
export type DeleteBranchRankResponse = { message: string };
export type UpdateBranchNameResponse = { message: string };
export type GetBranchTreasuryResponse = { treasury: number };
export type UpdateBranchTreasuryResponse = { message: string };
export type DeleteBranchResponse = { message: string };
export type GetBranchWagesResponse = { wages: Array<{ wage: number, rank_id: number, branch_id: number }> };
export type UpdateBranchWagesResponse = { message: string };
export type AddBranchMemberResponse = { message: string };
export type RemoveBranchMemberResponse = { message: string };
export type GetBranchMemberResponse = { user_id: number, branch_id: number, rank_id: number, rank: string, username: string, wage : number, detachment: BranchDetachmentType };
export type GetBranchRankResponse = { name: string, wage: number, id: number, rank_id: number, branch_id: number }
export type GetBranchWageResponse = { wage: number };
export type UpdateBranchMemberResponse = { message: string };
export type GetBranchMembersResponse = {totalPages: number, members: Array<{ branch_id: number, rank_id: number, user_id: number, username : string, detachment: BranchDetachmentType}>};
export type SetBranchRankResponse = { message: string };
export type PromoteBranchMemberResponse = { message: string };
export type UpdateBranchPointsResponse = { message: string };
export type AddBranchPointsResponse = { message: string };
export type RemoveBranchPointsResponse = { message: string };
export type GetBranchPointsResponse = { points: number };
export type GetBranchShoutResponse = { shout: string };
export type UpdateBranchShoutResponse = { message: string };
export type GetBranchIconResponse = { icon: string };
export type UpdateBranchIconResponse = { message: string };
export type CreateBranchDetachmentResponse = { message: string, id: number };
export type GetBranchDetachmentResponse = { name: string, id: number, branch_id: number, abbreviation: string, r: number, g: number, b: number };
export type GetBranchDetachmentsResponse = Array<{ name: string, id: number, branch_id: number, abbreviation: string, r: number, g: number, b: number, players: number }>;
export type UpdateBranchDetachmentResponse = { message: string };
export type DeleteBranchDetachmentResponse = { message: string };
export type GetBranchDetachmentMembersResponse = Array<{ id: number, detachment_id: number, user_id: number }>;
export type AddBranchDetachmentMemberResponse = { message: string };
export type RemoveBranchDetachmentMemberResponse = { message: string };
export type BranchFromMemberResponse = { branch_id: number, name: string, icon : string, shout : string, memberCount : number, commander : number | undefined };
export type ResetResponse = { message: string };
export type SetMemberDetachmentResponse = { message: string };
export type GetBranchTransfersResponse = Array<{user_id: number, current_branch_id: number, target_branch_id: number}>
export type AcceptBranchTransferResponse = { message: string };
export type DeleteBranchTransferResponse = { message: string };
export type AddBranchTransferResponse = { message: string };
export type AddAuditResponse = { message: string };
export type GetAuditsResponse = {pages: number, logs: Array<{id: number, user_id: number, branch_id: number, log: string, timestamp: string, audit_type: number}>}

export default class BranchAPIServiceRunner {
    private static url = "http://162.248.102.189:1235/";

    /**
     * Get the secret key for the branch API.
     * 
     * @returns { string }
     * 
     * @author NodeSupport
     */
    private static getBranchAPISecretKey() : string {
        return "m9hteifjf89aw9boe"
    }

    /**
     * Send a POST request to the Branch API. Will convert the body to JSON.
     * If the request is a get request, the body will be appended to the URL as a query string.
     * 
     * @param request The request to send
     * @param body The body of the request
     * @returns { Tuple<HttpResponse, BranchAPIResponse> }
     * 
     * @author NodeSupport
     */
    private static sendPostToBranchAPI(request: BranchAPIEndpoints, body: Record<string, unknown>): LuaTuple<[RequestAsyncResponse, unknown]> {
        const method = BranchAPIEndpointMethods.get(request);;
        let url = this.url + request;

        const headers = {
            "Content-Type": "application/json",
            "authorization": this.getBranchAPISecretKey(),
        };

        if (method === BranchAPIRequestTypes.GET) {
            // Append the body to the URL as a query string
            const append: string = Object.keys(body).map((key) => `${key}=${body[key]}`).join("&");

            // Append the query string to the URL
            url += `?${append}`;
        }

        const response = HttpService.RequestAsync({
            Url: url,
            Method: method,
            Headers: headers,
            Body: method === BranchAPIRequestTypes.GET ? undefined : HttpService.JSONEncode(body),
        });

        const [success, decoded] = pcall(() => HttpService.JSONDecode(response.Body)) as LuaTuple<[boolean, BranchAPIResponse]>;
        if (!success) return $tuple(response, { [response.Success ? "message" : "error"]: response.Body });

        return $tuple(response, decoded)
    };

    /**
     * Create a request promise to the branch API.
     *  
     * @param request The request to send
     * @param body The body of the request
     * @returns { Promise<T> }
     * 
     * @author NodeSupport
     */
    private static createRequestPromise<T>(request: BranchAPIEndpoints, body: unknown): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const [response, decoded] = this.sendPostToBranchAPI(request, body as Record<string, unknown>);

            // Reject if the request was not successful
            if (!response.Success) return reject((decoded as unknown as { error: string }).error);
            return resolve(decoded as T)
        })
    }

    /**
     * Create a branch.
     * 
     * @param name The name of the branch
     * @param icon The icon of the branch
     * @param shout The shout of the branch
     * @returns { Promise<CreateBranchResponse> }
     * 
     * @example
     * ```ts
     * BranchAPIServiceRunner.createBranch("Test Branch", "https://www.roblox.com/asset?id=123456", "Hello World!").then((response) => {
     *     print(response.message);
     * }).catch((error) => {
     *     warn(error);
     * });
     * ```
     * 
     * @author NodeSupport
     **/
    public static createBranch(name: string, icon: string, shout: string): Promise<CreateBranchResponse> {
        return this.createRequestPromise<CreateBranchResponse>(BranchAPIEndpoints.CREATE_BRANCH, { name, icon, shout });
    };

    /**
     * Get the branch.
     * 
     * @param id The id of the branch
     * @returns { Promise<GetBranchResponse> }
     * 
     * @example
     * ```ts
     * BranchAPIServiceRunner.getBranch(1).then((response) => {
     *     print(response.name);
     * }).catch((error) => {
     *     warn(error);
     * });
     * ```
     * 
     * @author NodeSupport
     **/
    public static getBranch(branch_id: number): Promise<GetBranchResponse> {
        return this.createRequestPromise<GetBranchResponse>(BranchAPIEndpoints.GET_BRANCH, { branch_id });
    }

    /**
     * Create a branch rank.
     * 
     * @param branch_id The id of the branch
     * @param name The name of the rank
     * @param permissions The permissions of the rank
     * @returns { Promise<CreateBranchRankResponse> }
     * 
     * @example
     * ```ts
     * BranchAPIServiceRunner.createBranchRank(1, "Test Rank", ["MANAGE_MEMBERS"]).then((response) => {
     *     print(response.message);
     * }).catch((error) => {
     *     warn(error);
     * });
     * ```
     * 
     * @author NodeSupport
     **/
    public static createBranchRank(rank_id: number, branch_id: number, name: string, wage: number): Promise<CreateBranchRankResponse> {
        return this.createRequestPromise<CreateBranchRankResponse>(BranchAPIEndpoints.CREATE_RANK, { rank_id, branch_id, name, wage });
    };

    /**
     * Get the branch ranks.
     * 
     * @param branch_id The id of the branch
     * @returns { Promise<GetBranchRanksResponse> }
     * 
     * @example
     * ```ts
     * BranchAPIServiceRunner.getBranchRanks(1).then((response) => {
     *    response.ranks.forEach((rank) => {
     *       print(rank.name);
     *   });
     * }).catch((error) => {
     *    warn(error);
     * });
     * ```
     * 
     * @author NodeSupport
     **/
    public static getBranchRanks(branch_id: number): Promise<GetBranchRanksResponse> {
        return this.createRequestPromise<GetBranchRanksResponse>(BranchAPIEndpoints.GET_RANKS, { branch_id });
    };

    /**
     * Get the branch name.
     * 
     * @param branch_id The id of the branch
     * @returns { Promise<GetBranchNameResponse> }
     * 
     * @author NodeSupport
     */
    public static getBranchName(branch_id: number): Promise<GetBranchNameResponse> {
        return this.createRequestPromise<GetBranchNameResponse>(BranchAPIEndpoints.GET_NAME, { branch_id });
    };

    /**
     * Deletes a branch rank.
     *
     * @param {number} rank_id - The ID of the rank to delete.
     * @returns {Promise<DeleteBranchRankResponse>} - A promise that resolves to the response of the delete rank request.
     *
     * @author NodeSupport
     */
    public static deleteBranchRank(rank_id: number): Promise<DeleteBranchRankResponse> {
        return this.createRequestPromise<DeleteBranchRankResponse>(BranchAPIEndpoints.DELETE_RANK, { rank_id });
    };

    /**
     * Updates the name of a branch.
     *
     * @param {number} branch_id - The ID of the branch to update.
     * @param {string} name - The new name of the branch.
     * @returns {Promise<UpdateBranchNameResponse>} - A promise that resolves to the response of the update branch name request.
     *
     * @author NodeSupport
     */
    public static updateBranchName(branch_id: number, name: string): Promise<UpdateBranchNameResponse> {
        return this.createRequestPromise<UpdateBranchNameResponse>(BranchAPIEndpoints.UPDATE_NAME, { branch_id, name });
    };

    /**
     * Gets the treasury of a branch.
     *
     * @param {number} branch_id - The ID of the branch to get the treasury of.
     * @returns {Promise<GetBranchTreasuryResponse>} - A promise that resolves to the response of the get branch treasury request.
     *
     * @author NodeSupport
     */
    public static getBranchTreasury(branch_id: number): Promise<GetBranchTreasuryResponse> {
        return this.createRequestPromise<GetBranchTreasuryResponse>(BranchAPIEndpoints.GET_TREASURY, { branch_id });
    };

    /**
     * Updates the treasury of a branch.
     *
     * @param {number} branch_id - The ID of the branch to update.
     * @param {number} treasury - The new treasury of the branch.
     * @returns {Promise<UpdateBranchTreasuryResponse>} - A promise that resolves to the response of the update branch treasury request.
     *
     * @author NodeSupport
     */
    public static updateBranchTreasury(branch_id: number, treasury: number): Promise<UpdateBranchTreasuryResponse> {
        return this.createRequestPromise<UpdateBranchTreasuryResponse>(BranchAPIEndpoints.UPDATE_TREASURY, { branch_id, treasury });
    };

    /**
     * Deletes a branch.
     *
     * @param {number} branch_id - The ID of the branch to delete.
     * @returns {Promise<DeleteBranchResponse>} - A promise that resolves to the response of the delete branch request.
     *
     * @author NodeSupport
     */
    public static deleteBranch(branch_id: number): Promise<DeleteBranchResponse> {
        return this.createRequestPromise<DeleteBranchResponse>(BranchAPIEndpoints.DELETE_BRANCH, { branch_id });
    };

    /**
     * Gets the wages of a branch.
     *
     * @param {number} branch_id - The ID of the branch to get the wages of.
     * @returns {Promise<GetBranchWagesResponse>} - A promise that resolves to the response of the get branch wages request.
     *
     * @author NodeSupport
     */
    public static getBranchWages(branch_id: number): Promise<GetBranchWagesResponse> {
        return this.createRequestPromise<GetBranchWagesResponse>(BranchAPIEndpoints.GET_WAGES, { branch_id });
    };

    /**
     * Updates the wages of a branch.
     *
     * @param {number} branch_id - The ID of the branch to update.
     * @param {Array<{ wage: number, rank_id: number }>} wages - The new wages of the branch.
     * @returns {Promise<UpdateBranchWagesResponse>} - A promise that resolves to the response of the update branch wages request.
     *
     * @author NodeSupport
     */
    public static updateBranchWages(branch_id: number, wages: Array<{ wage: number, rank_id: number }>): Promise<UpdateBranchWagesResponse> {
        return this.createRequestPromise<UpdateBranchWagesResponse>(BranchAPIEndpoints.UPDATE_WAGES, { branch_id, wages });
    };

    /**
     * Adds a member to a branch.
     *
     * @param {number} branch_id - The ID of the branch to add a member to.
     * @param {number} user_id - The ID of the user to add to the branch.
     * @param {number} rank_id - The ID of the rank to assign to the user.
     * @param {string} name - The name of the user.
     * @returns {Promise<AddBranchMemberResponse>} - A promise that resolves to the response of the add branch member request.
     *
     * @author NodeSupport
     */
    public static addBranchMember(branch_id: number, user_id: number, rank_id: number, name: string): Promise<AddBranchMemberResponse> {
        return this.createRequestPromise<AddBranchMemberResponse>(BranchAPIEndpoints.ADD_MEMBER, { branch_id, user_id, rank_id, name });
    };

    /**
     * Removes a member from a branch.
     *
     * @param {number} branch_id - The ID of the branch to remove a member from.
     * @param {number} user_id - The ID of the user to remove from the branch.
     * @returns {Promise<RemoveBranchMemberResponse>} - A promise that resolves to the response of the remove branch member request.
     *
     * @author NodeSupport
     */
    public static removeBranchMember(branch_id: number, user_id: number): Promise<RemoveBranchMemberResponse> {
        return this.createRequestPromise<RemoveBranchMemberResponse>(BranchAPIEndpoints.REMOVE_MEMBER, { branch_id, user_id });
    };

    /**
     * Gets a member of a branch.
     *
     * @param {number} branch_id - The ID of the branch to get a member from.
     * @param {number} user_id - The ID of the user to get from the branch.
     * @returns {Promise<GetBranchMemberResponse>} - A promise that resolves to the response of the get branch member request.
     *
     * @author NodeSupport
     */
    public static getBranchMember(member_id : number): Promise<GetBranchMemberResponse> {
        return this.createRequestPromise<GetBranchMemberResponse>(BranchAPIEndpoints.GET_MEMBER, { member_id });
    };

    /**
     * Gets the rank of a member in a branch.
     *
     * @param {number} branch_id - The ID of the branch to get a member's rank from.
     * @param {number} user_id - The ID of the user to get the rank of.
     * @returns {Promise<GetBranchRankResponse>} - A promise that resolves to the response of the get branch rank request.
     *
     * @author NodeSupport
     */
    public static getBranchRank(branch_id: number, user_id: number): Promise<GetBranchRankResponse> {
        return this.createRequestPromise<GetBranchRankResponse>(BranchAPIEndpoints.GET_RANK, { branch_id, user_id });
    };

    /**
     * Gets the wage of a member in a branch.
     *
     * @param {number} branch_id - The ID of the branch to get a member's wage from.
     * @param {number} user_id - The ID of the user to get the wage of.
     * @returns {Promise<GetBranchWageResponse>} - A promise that resolves to the response of the get branch wage request.
     *
     * @author NodeSupport
     */
    public static getBranchWage(branch_id: number, user_id: number): Promise<GetBranchWageResponse> {
        return this.createRequestPromise<GetBranchWageResponse>(BranchAPIEndpoints.GET_WAGE, { branch_id, user_id });
    };

    /**
     * Updates a member in a branch.
     *
     * @param {number} branch_id - The ID of the branch to update a member in.
     * @param {number} user_id - The ID of the user to update.
     * @param {number} rank_id - The ID of the rank to assign to the user.
     * @returns {Promise<UpdateBranchMemberResponse>} - A promise that resolves to the response of the update branch member request.
     *
     * @author NodeSupport
     */
    public static updateBranchMember(branch_id: number, user_id: number, rank_id: number): Promise<UpdateBranchMemberResponse> {
        return this.createRequestPromise<UpdateBranchMemberResponse>(BranchAPIEndpoints.UPDATE_MEMBER, { branch_id, user_id, rank_id });
    };

    /**
     * Gets the members of a branch.
     *
     * @param {number} branch_id - The ID of the branch to get the members of.
     * @param {number} page - The page number for pagination.
     * @param {number} limit - The limit of members to return per page.
     * @returns {Promise<GetBranchMembersResponse>} - A promise that resolves to the response of the get branch members request.
     *
     * @author NodeSupport
     */
    public static getBranchMembers(branch_id: number, page: number, limit: number, rank_id?: number, search?: string): Promise<GetBranchMembersResponse> {
        return this.createRequestPromise<GetBranchMembersResponse>(BranchAPIEndpoints.GET_MEMBERS, { branch_id, page, limit, rank_id, search });
    };

    /**
     * Sets the rank of a member in a branch.
     *
     * @param {number} branch_id - The ID of the branch to set a member's rank in.
     * @param {number} user_id - The ID of the user to set the rank of.
     * @param {number} rank_id - The ID of the rank to assign to the user.
     * @returns {Promise<SetBranchRankResponse>} - A promise that resolves to the response of the set branch rank request.
     *
     * @author NodeSupport
     */
    public static setBranchRank(branch_id: number, user_id: number, rank_id: number): Promise<SetBranchRankResponse> {
        return this.createRequestPromise<SetBranchRankResponse>(BranchAPIEndpoints.SET_RANK, { branch_id, user_id, rank_id });
    };

    /**
     * Promotes a member in a branch.
     *
     * @param {number} branch_id - The ID of the branch to promote a member in.
     * @param {number} user_id - The ID of the user to promote.
     * @returns {Promise<PromoteBranchMemberResponse>} - A promise that resolves to the response of the promote branch member request.
     *
     * @author NodeSupport
     */
    public static promoteBranchMember(branch_id: number, user_id: number): Promise<PromoteBranchMemberResponse> {
        return this.createRequestPromise<PromoteBranchMemberResponse>(BranchAPIEndpoints.PROMOTE_MEMBER, { branch_id, user_id });
    };

    /**
     * Updates the points of a branch.
     *
     * @param {number} branch_id - The ID of the branch to update.
     * @param {number} points - The new points of the branch.
     * @returns {Promise<UpdateBranchPointsResponse>} - A promise that resolves to the response of the update branch points request.
     *
     * @author NodeSupport
     */
    public static updateBranchPoints(branch_id: number, points: number): Promise<UpdateBranchPointsResponse> {
        return this.createRequestPromise<UpdateBranchPointsResponse>(BranchAPIEndpoints.UPDATE_POINTS, { branch_id, points });
    };

    /**
     * Adds points to a branch.
     *
     * @param {number} branch_id - The ID of the branch to add points to.
     * @param {number} user_id - The ID of the user to add points for.
     * @param {number} points - The number of points to add.
     * @param {number} point_type - The type of points to add.
     * @returns {Promise<AddBranchPointsResponse>} - A promise that resolves to the response of the add branch points request.
     *
     * @author NodeSupport
     */
    public static addBranchPoints(branch_id: number, user_id: number, points: number, point_type: number): Promise<AddBranchPointsResponse> {
        return this.createRequestPromise<AddBranchPointsResponse>(BranchAPIEndpoints.ADD_POINTS, { branch_id, user_id, points, point_type });
    };

    /**
     * Removes points from a branch.
     *
     * @param {number} branch_id - The ID of the branch to remove points from.
     * @param {number} points - The number of points to remove.
     * @returns {Promise<RemoveBranchPointsResponse>} - A promise that resolves to the response of the remove branch points request.
     *
     * @author NodeSupport
     */
    public static removeBranchPoints(branch_id: number, points: number): Promise<RemoveBranchPointsResponse> {
        return this.createRequestPromise<RemoveBranchPointsResponse>(BranchAPIEndpoints.REMOVE_POINTS, { branch_id, points });
    };

    /**
     * Gets the points of a branch.
     *
     * @param {number} branch_id - The ID of the branch to get the points of.
     * @returns {Promise<GetBranchPointsResponse>} - A promise that resolves to the response of the get branch points request.
     *
     * @author NodeSupport
     */
    public static getBranchPoints(branch_id: number): Promise<GetBranchPointsResponse> {
        return this.createRequestPromise<GetBranchPointsResponse>(BranchAPIEndpoints.GET_POINTS, { branch_id });
    };

    /**
     * Gets the shout of a branch.
     *
     * @param {number} branch_id - The ID of the branch to get the shout of.
     * @returns {Promise<GetBranchShoutResponse>} - A promise that resolves to the response of the get branch shout request.
     *
     * @author NodeSupport
     */
    public static getBranchShout(branch_id: number): Promise<GetBranchShoutResponse> {
        return this.createRequestPromise<GetBranchShoutResponse>(BranchAPIEndpoints.GET_SHOUT, { branch_id });
    };

    /**
     * Updates the shout of a branch.
     *
     * @param {number} branch_id - The ID of the branch to update.
     * @param {string} shout - The new shout of the branch.
     * @returns {Promise<UpdateBranchShoutResponse>} - A promise that resolves to the response of the update branch shout request.
     *
     * @author NodeSupport
     */
    public static updateBranchShout(branch_id: number, shout: string): Promise<UpdateBranchShoutResponse> {
        return this.createRequestPromise<UpdateBranchShoutResponse>(BranchAPIEndpoints.UPDATE_SHOUT, { branch_id, shout });
    };

    /**
     * Gets the icon of a branch.
     *
     * @param {number} branch_id - The ID of the branch to get the icon of.
     * @returns {Promise<GetBranchIconResponse>} - A promise that resolves to the response of the get branch icon request.
     *
     * @author NodeSupport
     */
    public static getBranchIcon(branch_id: number): Promise<GetBranchIconResponse> {
        return this.createRequestPromise<GetBranchIconResponse>(BranchAPIEndpoints.GET_ICON, { branch_id });
    };

    /**
     * Updates the icon of a branch.
     *
     * @param {number} branch_id - The ID of the branch to update.
     * @param {string} icon - The new icon of the branch.
     * @returns {Promise<UpdateBranchIconResponse>} - A promise that resolves to the response of the update branch icon request.
     *
     * @author NodeSupport
     */
    public static updateBranchIcon(branch_id: number, icon: string): Promise<UpdateBranchIconResponse> {
        return this.createRequestPromise<UpdateBranchIconResponse>(BranchAPIEndpoints.UPDATE_ICON, { branch_id, icon });
    };

    /**
     * Creates a detachment for a branch.
     *
     * @param {number} branch_id - The ID of the branch to create a detachment for.
     * @param {string} name - The name of the detachment.
     * @param {string} abbreviation - The abbreviation of the detachment.
     * @param {number} r - The red component of the detachment's color.
     * @param {number} g - The green component of the detachment's color.
     * @param {number} b - The blue component of the detachment's color.
     * @returns {Promise<CreateBranchDetachmentResponse>} - A promise that resolves to the response of the create branch detachment request.
     *
     * @author NodeSupport
     */
    public static createBranchDetachment(branch_id: number, name: string, abbreviation: string, r: number, g: number, b: number): Promise<CreateBranchDetachmentResponse> {
        return this.createRequestPromise<CreateBranchDetachmentResponse>(BranchAPIEndpoints.CREATE_DETACHMENT, { branch_id, name, abbreviation, r, g, b });
    };

    /**
     * Gets a detachment of a branch.
     *
     * @param {number} detachment_id - The ID of the detachment to get.
     * @returns {Promise<GetBranchDetachmentResponse>} - A promise that resolves to the response of the get branch detachment request.
     *
     * @author NodeSupport
     */
    public static getBranchDetachment(detachment_id: number): Promise<GetBranchDetachmentResponse> {
        return this.createRequestPromise<GetBranchDetachmentResponse>(BranchAPIEndpoints.GET_DETACHMENT, { detachment_id });
    };

    /**
     * Gets all detachments of a branch.
     *
     * @param {number} branch_id - The ID of the branch to get the detachments of.
     * @returns {Promise<GetBranchDetachmentsResponse>} - A promise that resolves to the response of the get branch detachments request.
     *
     * @author NodeSupport
     */
    public static getBranchDetachments(branch_id: number): Promise<GetBranchDetachmentsResponse> {
        return this.createRequestPromise<GetBranchDetachmentsResponse>(BranchAPIEndpoints.GET_BRANCH_DETACHMENTS, { branch_id });
    };

    /**
     * Updates a detachment of a branch.
     *
     * @param {number} detachment_id - The ID of the detachment to update.
     * @param {string} name - The new name of the detachment.
     * @param {string} abbreviation - The new abbreviation of the detachment.
     * @param {number} r - The red component of the new color of the detachment.
     * @param {number} g - The green component of the new color of the detachment.
     * @param {number} b - The blue component of the new color of the detachment.
     * @returns {Promise<UpdateBranchDetachmentResponse>} - A promise that resolves to the response of the update branch detachment request.
     *
     * @author NodeSupport
     */
    public static updateBranchDetachment(detachment_id: number, name: string, abbreviation: string, r: number, g: number, b: number): Promise<UpdateBranchDetachmentResponse> {
        return this.createRequestPromise<UpdateBranchDetachmentResponse>(BranchAPIEndpoints.UPDATE_DETACHMENT, { detachment_id, name, abbreviation, r, g, b });
    };

    /**
     * Deletes a detachment of a branch.
     *
     * @param {number} detachment_id - The ID of the detachment to delete.
     * @returns {Promise<DeleteBranchDetachmentResponse>} - A promise that resolves to the response of the delete branch detachment request.
     *
     * @author NodeSupport
     */
    public static deleteBranchDetachment(detachment_id: number): Promise<DeleteBranchDetachmentResponse> {
        return this.createRequestPromise<DeleteBranchDetachmentResponse>(BranchAPIEndpoints.DELETE_DETACHMENT, { detachment_id });
    };

    /**
     * Gets the members of a detachment of a branch.
     *
     * @param {number} detachment_id - The ID of the detachment to get the members of.
     * @returns {Promise<GetBranchDetachmentMembersResponse>} - A promise that resolves to the response of the get branch detachment members request.
     *
     * @author NodeSupport
     */
    public static getBranchDetachmentMembers(branch_id : number, detachment_id : number, page : number, limit : number): Promise<GetBranchDetachmentMembersResponse> {
        return this.createRequestPromise<GetBranchDetachmentMembersResponse>(BranchAPIEndpoints.GET_DETACHMENT_MEMBERS, { branch_id, detachment_id, page, limit });
    };

    /**
     * Adds a member to a detachment of a branch.
     *
     * @param {number} detachment_id - The ID of the detachment to add a member to.
     * @param {number} user_id - The ID of the user to add to the detachment.
     * @returns {Promise<AddBranchDetachmentMemberResponse>} - A promise that resolves to the response of the add branch detachment member request.
     *
     * @author NodeSupport
     */
    public static addBranchDetachmentMember(branch_id : number, user_id : number, rank_id : number, detachment_id : number, username : string): Promise<AddBranchDetachmentMemberResponse> {
        return this.createRequestPromise<AddBranchDetachmentMemberResponse>(BranchAPIEndpoints.ADD_DETACHMENT_MEMBER, { branch_id, user_id, rank_id, detachment_id, username });
    };

    /**
     * Removes a member from a detachment of a branch.
     *
     * @param {number} detachment_id - The ID of the detachment to remove a member from.
     * @param {number} user_id - The ID of the user to remove from the detachment.
     * @returns {Promise<RemoveBranchDetachmentMemberResponse>} - A promise that resolves to the response of the remove branch detachment member request.
     *
     * @author NodeSupport
     */
    public static removeBranchDetachmentMember(detachment_id: number, user_id: number): Promise<RemoveBranchDetachmentMemberResponse> {
        return this.createRequestPromise<RemoveBranchDetachmentMemberResponse>(BranchAPIEndpoints.REMOVE_DETACHMENT_MEMBER, { detachment_id, user_id });
    };

    public static getBranchFromMember(user_id: number): Promise<BranchFromMemberResponse> {
        return this.createRequestPromise<BranchFromMemberResponse>(BranchAPIEndpoints.BRANCH_FROM_MEMBER, { user_id });
    }

    public static setMemberDetachment(branch_id: number, user_id: number, detachment_id: number): Promise<SetMemberDetachmentResponse> {
        return this.createRequestPromise<SetMemberDetachmentResponse>(BranchAPIEndpoints.SET_MEMBER_DETACHMENT, { branch_id, user_id, detachment_id });
    };

    public static getBranchTransfers(branch_id: number): Promise<GetBranchTransfersResponse> {
        return this.createRequestPromise<GetBranchTransfersResponse>(BranchAPIEndpoints.GET_BRANCH_TRANSFERS, { branch_id });
    }

    public static acceptBranchTransfer(user_id: number, target_branch_id: number): Promise<AcceptBranchTransferResponse> {
        return this.createRequestPromise<AcceptBranchTransferResponse>(BranchAPIEndpoints.ACCEPT_BRANCH_TRANSFRER, { user_id, target_branch_id });
    }

    public static deleteBranchTransfer(user_id: number, current_branch_id: number, target_branch_id: number): Promise<DeleteBranchTransferResponse> {
        return this.createRequestPromise<DeleteBranchTransferResponse>(BranchAPIEndpoints.DELETE_BRANCH_TRANSFER, { user_id, current_branch_id, target_branch_id });
    }

    public static addBranchTransfer(user_id: number, current_branch_id : number, target_branch_id: number): Promise<AddBranchTransferResponse> {
        return this.createRequestPromise<AddBranchTransferResponse>(BranchAPIEndpoints.ADD_BRANCH_TRANSFER, { user_id, current_branch_id, target_branch_id });
    }

    public static addAudit(user_id: number, branch_id: number, log: string, audit_type: number): Promise<AddAuditResponse> {
        return this.createRequestPromise<AddAuditResponse>(BranchAPIEndpoints.ADD_AUDIT, { user_id, branch_id, log, audit_type });
    }

    public static getAudits(branch_id: number, page: number, limit: number, audit_type?: number): Promise<GetAuditsResponse> {
        return this.createRequestPromise<GetAuditsResponse>(BranchAPIEndpoints.GET_AUDITS, { branch_id, page, limit, audit_type });
    }

    public static reset(): Promise<ResetResponse> {
        return this.createRequestPromise<ResetResponse>(BranchAPIEndpoints.RESET, {});
    }
}