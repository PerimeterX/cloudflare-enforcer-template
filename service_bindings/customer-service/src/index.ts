type EnforceResponse = {
  contextId: string;
  request: Request;
  response?: never;
} | {
  contextId?: never;
  request?: never;
  response: Response;
}

interface HumanEnforcerService {
  enforce(request: Request): Promise<EnforceResponse>;
  postEnforce(contextId: string, response: Response): Promise<Response>;
}

interface Env {
  HUMAN_ENFORCER_SERVICE: HumanEnforcerService;
}

export default {
  async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Forward the request to HUMAN Service
    const { contextId, request, response } = await env.HUMAN_ENFORCER_SERVICE.enforce(req.clone());

    if (response) {
      return response;
    }

    // Forward the request to the origin
    const originResponse = await fetch(request);

    // Call postEnforce with the response from the origin
    return await env.HUMAN_ENFORCER_SERVICE.postEnforce(contextId, originResponse.clone());
  },
}; 