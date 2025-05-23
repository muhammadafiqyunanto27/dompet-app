import { db } from '@/src/db';
import { users } from '@/src/db/schema';
import { registerSchema } from '@/utils/zodSchemas';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid data' });

  const { username, password } = parsed.data;
  const hashed = await bcrypt.hash(password, 10);

  try {
    await db.insert(users).values({ username, password: hashed });
    return res.status(200).json({ message: 'User registered' });
  } catch (err: any) {
    console.error('Register error:', err);

    // Cek error karena duplikat username (kode bisa berbeda tergantung DBMS yang kamu pakai)
    if (err.code === '23505') { // PostgreSQL: unique_violation
      return res.status(409).json({ error: 'Username already exists' });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
}
