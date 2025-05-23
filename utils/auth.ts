import jwt from 'jsonwebtoken';
import { parse } from 'cookie';
import { NextApiRequest } from 'next';

const JWT_SECRET = process.env.JWT_SECRET ?? 'rahasia';

export function getUserFromRequest(req: NextApiRequest) {
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  if (!cookies.token) return null;

  try {
    return jwt.verify(cookies.token, JWT_SECRET);
  } catch {
    return null;
  }
}