
import { DB } from '@/lib/api/attach-db';

export const getByIdStatement = (table: string, id_field: string, id: string | number) => {
  const q = `SELECT * FROM ${table} WHERE ${id_field}=?`;
  return DB.prepare(q).bind(id);
};

export const getAllStatement = (table: string) => {
  const q = `SELECT * FROM ${table}`;
  return DB.prepare(q);
};

