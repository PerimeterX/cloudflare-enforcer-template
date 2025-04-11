import { WorkerEntrypoint } from "cloudflare:workers";
import { HumanSecurityEnforcer, HumanSecurityConfiguration } from "@humansecurity/cloudflare-enforcer";

interface IHumanEnforcerService {
  enforce(request: Request): Promise<EnforceResponse>;
  postEnforce(contextId: string, response: Response): Promise<Response>;
}

type EnforceResponse = {
  contextId: string;
  request: Request;
  response?: never;
} | {
  contextId?: never;
  request?: never;
  response: Response;
}

type Env = {
  PXKV: KVNamespace;
}

const config: HumanSecurityConfiguration = {
  px_app_id: "",
  px_auth_token: "",
  px_cookie_secret: "",
  px_remote_config_auth_token: "",
  px_remote_config_id: "",
  px_logger_auth_token: "",
}

const enforcerStore: Map<string, HumanSecurityEnforcer> = new Map<string, HumanSecurityEnforcer>();

export default class HumanEnforcerService extends WorkerEntrypoint<Env> implements IHumanEnforcerService {
  async enforce(request: Request): Promise<EnforceResponse> {
    const contextId = crypto.randomUUID();
    try {
      const enforcer = await HumanSecurityEnforcer.initialize(config, this.env);
      const retVal = await enforcer.enforce(this.ctx, request);
      if (retVal instanceof Response) {
        return {
          response: retVal,
        }
      }

      enforcerStore.set(contextId, enforcer);
      return {
        contextId,
        request: retVal,
      };
    } catch (error) {
      console.error('Error in enforce:', error);
      // Return the original request if there's an error
      return {
        request,
        contextId,
      };
    }
  }

  async postEnforce(contextId: string, response: Response): Promise<Response> {
    const enforcer = enforcerStore.get(contextId);
    if (!enforcer) {
      console.error("enforcer not found - contextId:", contextId);
      return response;
    }

    try {
      return await enforcer.postEnforce(this.ctx, response);
    } catch (error) {
      console.error('Error in postEnforce:', error);
      // Return the original response if there's an error
      return response;
    } finally {
      enforcerStore.delete(contextId);
    }
  }
}
