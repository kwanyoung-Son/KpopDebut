// Cloudflare Function for GET /api/results/:sessionId
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
    const sessionId = context.params.sessionId as string;
    
    if (!sessionId) {
      return new Response(JSON.stringify({ error: "Session ID is required" }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
    
    // Get analysis result from D1
    const result = await context.env.DB.prepare(
      `SELECT * FROM analysisResults WHERE sessionId = ?`
    ).bind(sessionId).first();
    
    if (!result) {
      return new Response(JSON.stringify({ error: "Result not found" }), {
        status: 404,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
    
    // Parse JSON fields
    const parsedResult = {
      ...result,
      quizAnswers: result.quizAnswers ? JSON.parse(result.quizAnswers as string) : null,
      styleTags: result.styleTags ? JSON.parse(result.styleTags as string) : []
    };
    
    return new Response(JSON.stringify(parsedResult), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Get result error:', error);
    return new Response(JSON.stringify({ error: "Failed to retrieve result" }), {
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