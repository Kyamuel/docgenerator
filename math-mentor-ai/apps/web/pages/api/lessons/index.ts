import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
  const query = new URLSearchParams(req.query as any).toString();
  const r = await fetch(`${apiBase}/lessons${query ? `?${query}` : ''}`);
  const data = await r.json();
  res.status(r.status).json(data);
}