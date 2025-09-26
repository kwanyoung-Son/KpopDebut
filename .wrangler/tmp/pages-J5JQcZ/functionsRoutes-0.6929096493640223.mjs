import { onRequestGet as __api_results__sessionId__ts_onRequestGet } from "/home/runner/workspace/functions/api/results/[sessionId].ts"
import { onRequestOptions as __api_results__sessionId__ts_onRequestOptions } from "/home/runner/workspace/functions/api/results/[sessionId].ts"
import { onRequestOptions as __api_analyze_ts_onRequestOptions } from "/home/runner/workspace/functions/api/analyze.ts"
import { onRequestPost as __api_analyze_ts_onRequestPost } from "/home/runner/workspace/functions/api/analyze.ts"
import { onRequestGet as __api_stats_ts_onRequestGet } from "/home/runner/workspace/functions/api/stats.ts"
import { onRequestOptions as __api_stats_ts_onRequestOptions } from "/home/runner/workspace/functions/api/stats.ts"

export const routes = [
    {
      routePath: "/api/results/:sessionId",
      mountPath: "/api/results",
      method: "GET",
      middlewares: [],
      modules: [__api_results__sessionId__ts_onRequestGet],
    },
  {
      routePath: "/api/results/:sessionId",
      mountPath: "/api/results",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_results__sessionId__ts_onRequestOptions],
    },
  {
      routePath: "/api/analyze",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_analyze_ts_onRequestOptions],
    },
  {
      routePath: "/api/analyze",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_analyze_ts_onRequestPost],
    },
  {
      routePath: "/api/stats",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_stats_ts_onRequestGet],
    },
  {
      routePath: "/api/stats",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_stats_ts_onRequestOptions],
    },
  ]