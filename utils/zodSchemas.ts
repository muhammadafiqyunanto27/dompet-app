import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

export const loginSchema = registerSchema;

export const transactionSchema = z.object({
  title: z.string().min(1),
  amount: z.number(),
  date: z.string().optional(), // Tambahkan validasi tanggal opsional
});


export const userIdQuerySchema = z.object({
  userId: z.string().regex(/^\d+$/).transform(Number),
});

export const idQuerySchema = z.object({
  id: z.string().regex(/^\d+$/).transform(Number),
});