
import { attemptToParseInt } from '@/lib/utils';
import { getByIdStatement } from '@/lib/api/generic-sql-statements';
import type { NextApiRequest, NextApiResponse } from 'next'


export const getMainRecordByID = (objectId: number): MainRecord => {
  const stm = getByIdStatement('main', 'Object_Id', objectId);
  const r = stm.get() as MainRecord;
  if (r === undefined)
    throw new Error ("no results");
  return r;
};

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const impossibleErrorMessage = "couldn't read objectid from URL query string";

  Promise.resolve(req.query).
    then(({ objectid }) => objectid===undefined ?
         impossibleErrorMessage :
         Array.isArray(objectid) ? objectid[0] ?? impossibleErrorMessage : objectid).
    then(attemptToParseInt).
    then(getMainRecordByID).
    then(data => res.status(200).json(data)).
    catch(e => res.status(500).json({ error: e.message }));
}

export default handler;

