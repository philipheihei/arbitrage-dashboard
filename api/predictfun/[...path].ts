// Vercel serverless function – proxy for Predict.fun API.
// Injects the API key server-side so it never appears in the browser bundle.
// Route: /api/predictfun/[...path]  →  https://api.predict.fun/[...path]
//
// Uses only Node.js built-in types (@types/node) – no @vercel/node dependency.

import type { IncomingMessage, ServerResponse } from 'node:http'

type VercelRequest = IncomingMessage & {
  query: Record<string, string | string[] | undefined>
}

export default async function handler(req: VercelRequest, res: ServerResponse) {
  const segments = req.query['path']
  const upstreamPath = Array.isArray(segments)
    ? segments.join('/')
    : (segments ?? '')

  // Rebuild query string from every param except the catch-all 'path'
  const qs = Object.entries(req.query)
    .filter(([k]) => k !== 'path')
    .map(([k, v]) => {
      const val = Array.isArray(v) ? v[0] : (v ?? '')
      return `${encodeURIComponent(k)}=${encodeURIComponent(val)}`
    })
    .join('&')

  const upstreamUrl =
    `https://api.predict.fun/${upstreamPath}${qs ? '?' + qs : ''}`

  const upstream = await fetch(upstreamUrl, {
    method: req.method ?? 'GET',
    headers: {
      'x-api-key': process.env.PREDICTFUN_API_KEY ?? '',
      'Accept': 'application/json',
    },
  })

  const body = await upstream.text()

  res.statusCode = upstream.status
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.end(body)
}
