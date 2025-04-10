import { HumanSecurityEnforcer } from '@humansecurity/cloudflare-enforcer';

import config from './config.json';

export interface Env {
    // If using Human Security features that require the PXKV Namespace
    PXKV: KVNamespace;
}

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        // create a new enforcer
        const enforcer = await HumanSecurityEnforcer.initialize(config, env);

        // call enforce
        const retVal = await enforcer.enforce(ctx, request);

        // if enforce returned a response, return that response
        if (retVal instanceof Response) {
            return retVal;
        }

        // retrieve the resource from the cache or origin server
        // make sure to use the value returned from enforce
        const response = await fetch(retVal);

        // call postEnforce and return the resulting response
        return await enforcer.postEnforce(ctx, response);
    },
};
