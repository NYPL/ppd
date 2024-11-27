
import { attemptToParseInt } from '@/lib/utils';
import { getByIdStatement } from '@/lib/api/generic-sql-statements';
import type { NextApiRequest, NextApiResponse } from 'next'


export const getMainRecordByID = (objectId: number): MainRecord => {
  const stm = getByIdStatement('main', 'objectId', objectId);
  const r = stm.get() as MainRecord;
  if (r === undefined)
    throw new Error ("no results");
  return r;
};

//  TODO  how do you make these "type errors" go away?
export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // @ts-ignore
  const { objectid }: { objectid: string } = req.query;
  return Promise.resolve(objectid).
    then(attemptToParseInt).
    then(getMainRecordByID).
    then(data => res.status(200).json(data)).
    catch(e => res.status(500).json({ error: e.message }));
}

export default handler;

