import { DB_FILE } from '@/lib/config';
import BetterSqlite3 from 'better-sqlite3';

export const DB: BetterSqlite3.Database = new BetterSqlite3(DB_FILE, {
  readonly: true,
  fileMustExist: true
});

