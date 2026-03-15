// Vercel Edge/Node serverless function – proxy for Predict.fun API.
// Injects the secret API key server-side so it never appears in the browser bundle.
// Matches routes: /api/predictfun/[...path]  (e.g. /api/predictfun/v1/markets)

import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { path: pathSegments, ...queryParams } = req.query

  // Reconstruct the upstream path (Vercel passes [...path] as an array or string)
  const upstreamPath = Array.isArray(pathSegments)
    ? pathSegments.join('/')
    : (pathSegments ?? '')

  // Forward remaining query params
  const qs = new URLSearchParams(
    Object.fromEntries(
      Object.entries(queryParams).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v ?? ''])
    )
  ).toString()

  const upstreamUrl = `https://api.predict.fun/${upstreamPath}${qs ? '?' + qs : ''}`

  const upstream = await fetch(upstreamUrl, {
    method: req.method ?? 'GET',
    headers: {
      'x-api-key': process.env.PREDICTFUN_API_KEY ?? '',
      'Accept': 'application/json',
    },
  })

  const body = await upstream.text()

  res
    .status(upstream.status)
    .setHeader('Content-Type', 'application/json')
    .send(body)
}
