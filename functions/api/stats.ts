// Cloudflare Function for GET /api/stats
/// <reference types="@cloudflare/workers-types" />

interface Env {
  DB: D1Database;
}

interface EventContext<E, P, D> {
  request: Request;
  env: E;
  params: P;
  data: D;
  waitUntil: (promise: Promise<any>) => void;
  passThroughOnException: () => void;
}

export async function onRequestGet(context: EventContext<Env, any, any>): Promise<Response> {
  try {
    // Use D1Storage to get analysis count
    const result = await context.env.DB.prepare(
      "SELECT COUNT(*) as count FROM analysis_results"
    ).first();
    
    const count = result?.count || 0;
    
    return new Response(JSON.stringify({ totalAnalyses: count }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    return new Response(JSON.stringify({ error: "Failed to fetch stats" }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

// Handle CORS preflight
export async function onRequestOptions(): Promise<Response> {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}