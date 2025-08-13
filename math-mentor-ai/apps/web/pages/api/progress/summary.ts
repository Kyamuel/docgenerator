import type { NextApiRequest, NextApiResponse } from 'next';
import { getAccessToken } from '@auth0/nextjs-auth0';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();
  try {
    const { accessToken } = await getAccessToken(req, res, { scopes: ['openid', 'profile', 'email'] });
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
    const r = await fetch(`${apiBase}/progress/summary`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e: any) {
    res.status(401).json({ error: 'Unauthorized' });
  }
}