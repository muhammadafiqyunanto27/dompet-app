import { NextApiRequest, NextApiResponse } from 'next';
import { getUserFromRequest } from '@/utils/auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = getUserFromRequest(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  return res.status(200).json({ user });
}