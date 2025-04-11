# Service Bindings Workers

This directory contains two Cloudflare Workers that demonstrate the use of service bindings:

1. **human-enforcer-service**: A worker that implements Human Security's Cloudflare Enforcer
2. **customer-service**: A worker that demonstrates how to use the enforcer service through service bindings

## Prerequisites

- Node.js (v16 or later)
- Cloudflare account with Workers enabled
- Cloudflare API token with appropriate permissions

## Setup

1. Install dependencies for both workers:
   ```bash
   # Install dependencies for human-enforcer-service
   cd human-enforcer-service
   npm install

   # Install dependencies for customer-service
   cd ../customer-service
   npm install
   ```

2. Configure Wrangler:
   ```bash
   # In both worker directories
   wrangler login
   ```

3. Configure Human Security Enforcer:
   In the `human-enforcer-service/src/index.ts` file, update the `HumanSecurityConfiguration` object with your specific configuration:
   ```typescript
   const config: HumanSecurityConfiguration = {
     // Add your configuration here
     // Required fields will be shown in your IDE
   };
   ```

## Local Development

### human-enforcer-service

1. Navigate to the worker directory:
   ```bash
   cd human-enforcer-service
   ```

2. Start the local development server:
   ```bash
   npm run dev
   ```

The worker will be available at `http://localhost:8787` by default.

### customer-service

1. Navigate to the worker directory:
   ```bash
   cd customer-service
   ```

2. Start the local development server:
   ```bash
   npm run dev
   ```

The worker will be available at `http://localhost:8788` by default.

## Deployment

### human-enforcer-service

1. Navigate to the worker directory:
   ```bash
   cd human-enforcer-service
   ```

2. Deploy the worker:
   ```bash
   npm run deploy
   ```

### customer-service

1. Navigate to the worker directory:
   ```bash
   cd customer-service
   ```

2. Deploy the worker:
   ```bash
   npm run deploy
   ```

## Service Bindings Configuration

The workers use Cloudflare's RPC Service Bindings to communicate. The `customer-service` worker is bound to the `human-enforcer-service` worker, allowing it to make RPC calls to the enforcer service.

To update the service binding configuration:

1. Edit the `wrangler.json` file in the `customer-service` directory
2. Update the `services` section with the correct binding name and service name
3. Redeploy both workers

For more information about RPC Service Bindings, see:
- [Cloudflare RPC Service Bindings Documentation](https://developers.cloudflare.com/workers/runtime-apis/rpc/)
- [Cloudflare WorkerEntryPoint Documentation](https://developers.cloudflare.com/workers/runtime-apis/bindings/service-bindings/rpc/)

## Notes

- The `human-enforcer-service` uses the `@humansecurity/cloudflare-enforcer` package
- Both workers are written in TypeScript
- Local development uses Wrangler's development server
- Deployment uses Wrangler's deployment functionality
- Service bindings must be configured in the Cloudflare dashboard after deployment 