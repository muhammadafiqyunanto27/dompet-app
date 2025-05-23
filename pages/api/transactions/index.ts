import { db } from '@/src/db';
import { transactions } from '@/src/db/schema';
import { transactionSchema } from '@/utils/zodSchemas';
import { eq } from 'drizzle-orm';
import { NextApiRequest, NextApiResponse } from 'next';
import { getUserFromRequest } from '@/utils/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user: any = getUserFromRequest(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const userId = user.userId;

  try {
    switch (req.method) {
      case 'GET':
        return await handleGet(req, res, userId);
      case 'POST':
        return await handlePost(req, res, userId);
      case 'PUT':
        return await handlePut(req, res, userId);
      case 'DELETE':
        return await handleDelete(req, res, userId);
      default:
        return res.status(405).end();
    }
  } catch (err) {
    console.error('Transaction error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse, userId: number) {
  const result = await db.select().from(transactions).where(eq(transactions.userId, userId));
  return res.status(200).json(result);
}

async function handlePost(req: NextApiRequest, res: NextApiResponse, userId: number) {
  const parsed = transactionSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid data' });

  const { title, amount, date } = parsed.data;

  await db.insert(transactions).values({
    title,
    amount,
    userId,
    createdAt: date ? new Date(date) : new Date(),
  });

  return res.status(200).json({ message: 'Transaction added' });
}

async function handlePut(req: NextApiRequest, res: NextApiResponse, userId: number) {
  const id = parseInt(Array.isArray(req.query.id) ? req.query.id[0] : req.query.id ?? '');
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

  const existing = await db.select().from(transactions).where(eq(transactions.id, id));
  if (!existing.length || existing[0].userId !== userId) {
    return res.status(403).json({ error: 'Unauthorized update' });
  }

  const parsed = transactionSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid data' });

  const { title, amount, date } = parsed.data;

  await db
    .update(transactions)
    .set({ title, amount, createdAt: date ? new Date(date) : new Date() })
    .where(eq(transactions.id, id));

  return res.status(200).json({ message: 'Transaction updated' });
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse, userId: number) {
  const id = parseInt(Array.isArray(req.query.id) ? req.query.id[0] : req.query.id ?? '');
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

  const existing = await db.select().from(transactions).where(eq(transactions.id, id));
  if (!existing.length || existing[0].userId !== userId) {
    return res.status(403).json({ error: 'Unauthorized delete' });
  }

  await db.delete(transactions).where(eq(transactions.id, id));
  return res.status(200).json({ message: 'Deleted' });
}
