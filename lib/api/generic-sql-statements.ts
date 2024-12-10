
import { DB } from '@/lib/api/attach-db';

export const getByIdStatement = (table: string, id_field: string, id: string | number) => {
  const q = `SELECT * FROM ${table} WHERE ${id_field}=?`;
  return DB.prepare(q).bind(id);
};

export const getRecordByID = <T>(table: TableName, field: string, genericID: number) => {
  const stm = getByIdStatement(table, field, genericID);
  const r = stm.get() as T;
  if (r === undefined)
    throw new Error ("no results");
  return r;
};

export const getAllStatement = (table: string) => {
  const q = `SELECT * FROM ${table}`;
  return DB.prepare(q);
};

