import { IHumanEnforcerService } from '../../shared_types';

interface Env {
  HUMAN_ENFORCER_SERVICE: IHumanEnforcerService;
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