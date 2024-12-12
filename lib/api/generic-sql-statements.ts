
import { DB } from '@/lib/api/attach-db';
import type { NextApiRequest, NextApiResponse } from 'next'
import { attemptToParseInt } from '@/lib/utils';


export const getAllStatement = (table: string) => {
  const q = `SELECT * FROM ${table}`;
  return DB.prepare(q);
};


export const getByIdStatement = (table: string,
                                 id_field: string,
                                 id: string | number,
                                 limit?: number | undefined ) => {
  const q = `SELECT * FROM ${table} WHERE ${id_field}=? ${ limit!=null ? " LIMIT " + limit : '' }`;

  return DB.prepare(q).bind(id);
};


export const getRecordByID = <T>(table: TableName, field: string, genericID: number): T => {
  const stm = getByIdStatement(table, field, genericID);
  let r: T = stm.get() as T;
  if (r === undefined)
    throw new Error ("no results");
  return r;
};


export const getRecordsByID = <T>(table: TableName, field: string,
                                  genericID: number,
                                  limit?: number | undefined): Array<T> => {
  const stm = getByIdStatement(table, field, genericID, limit);
  let r: Array<T> = stm.all() as Array<T>;
  if (r === undefined)
    throw new Error ("no results");
  return r;
};


export const makeRecordRetrieverHandler = (table: TableName,
                                           queryKey: string,
                                           field: string) => {
  return  async (req: NextApiRequest, res: NextApiResponse) => {
    const impossibleErrorMessage = "couldn't read id from URL query string";
    return Promise.resolve(req.query).
      then((query) => {
        const genericID = query[queryKey] ?? impossibleErrorMessage;
        return Array.isArray(genericID) ? genericID[0] ?? impossibleErrorMessage : genericID
      }).
      then(attemptToParseInt).
      then(_ => getRecordByID(table, field, _)).
      then(data => res.status(200).json(data)).
      catch(e => res.status(500).json({ error: e.message }));
  };
};

