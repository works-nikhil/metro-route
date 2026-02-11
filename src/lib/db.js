import { Pool } from "pg";

// Reuse the same pool in development; in serverless (e.g. Vercel) one pool per
// cold start is fine and avoids creating a new pool on every request.
const globalForDb = globalThis;

const pool =
  globalForDb.poolCopy ??
  new Pool({
    connectionString: process.env.PG_DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.poolCopy = pool;
}

/**
 * Run a parameterized query. Use $1, $2, ... in text and pass params array.
 * @param {string} text - SQL (e.g. 'SELECT * FROM stations WHERE id = $1')
 * @param {unknown[]} [params] - Query parameters
 * @returns {Promise<import('pg').QueryResult>}
 */
export async function query(text, params) {
  return pool.query(text, params);
}

export default pool;
