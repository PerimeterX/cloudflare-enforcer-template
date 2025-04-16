export interface IHumanEnforcerService {
    enforce(request: Request): Promise<EnforceResponse>;
    postEnforce(contextId: string, response: Response): Promise<Response>;
}

export type EnforceResponse = {
    contextId: string;
    request: Request;
    response?: never;
} | {
    contextId?: never;
    request?: never;
    response: Response;
}