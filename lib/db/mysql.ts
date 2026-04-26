import mysql, { RowDataPacket } from "mysql2/promise";

let pool: mysql.Pool;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT ?? 3306),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  return pool;
}

type SQLParams = (string | number | boolean | null | Buffer | Date)[];

export async function query<T extends RowDataPacket[]>(
  sql: string,
  params: SQLParams = []
): Promise<T> {
  const pool = getPool();

  const [rows] = await pool.execute(sql, params);

  return rows as T;
}