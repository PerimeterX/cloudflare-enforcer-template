import { WorkerEntrypoint } from "cloudflare:workers";
import { HumanSecurityEnforcer } from "@humansecurity/cloudflare-enforcer";

import { IHumanEnforcerService, EnforceResponse } from "../../shared_types";
import config from './config.json';

type Env = {
  PXKV: KVNamespace;
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
