// src/db/migrate.ts
import 'dotenv/config';
import * as dotenv from 'dotenv';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const runMigrations = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
  }

  const connection = postgres(process.env.DATABASE_URL, { max: 1 });
  const db = drizzle(connection);

  console.log('⏳ Running migrations...');
  const start = Date.now();

  await migrate(db, { migrationsFolder: 'src/db/migrations' });

  await connection.end();
  const end = Date.now();
  console.log(`✅ Migrations completed in ${end - start}ms`);

  process.exit(0);
};

runMigrations().catch((err) => {
  console.error('❌ Migration failed');
  console.error(err);
  process.exit(1);
});