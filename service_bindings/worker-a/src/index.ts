interface Env {
  WORKER_B: Fetcher;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Forward the request to Worker B
    const response = await env.WORKER_B.fetch(request.clone());
    
    // Get the response from Worker B
    const workerBResponse = await response.text();
    
    // Return a modified response
    return new Response(`Worker A received from Worker B: ${workerBResponse}`, {
      headers: { "content-type": "text/plain" },
    });
  },
}; 