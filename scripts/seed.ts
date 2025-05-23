import 'dotenv/config';
import { users, transactions } from '@/src/db/schema'; // ganti path sesuai project kamu
import bcrypt from 'bcrypt';
import { db } from '@/src/db';

async function seed() {
  console.log('Seeding started...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Seed user
  const insertedUsers = await db.insert(users).values([
    { username: 'admin', password: hashedPassword },
    { username: 'test', password: hashedPassword },
  ]).returning();

  const admin = insertedUsers[0];

  const now = new Date();

  // Seed transaksi untuk admin
  await db.insert(transactions).values([
    { userId: admin.id, title: 'Makan', amount: 15000, createdAt: now },
    { userId: admin.id, title: 'Transportasi', amount: 20000, createdAt: now },
  ]);

  console.log('Seeding complete.');
  process.exit();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
