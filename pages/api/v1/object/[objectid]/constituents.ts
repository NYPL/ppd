import { API_ASSOC_ARRAY_LIMIT } from '@/lib/config';
import { attemptToParseInt } from '@/lib/utils';
import { getRecordByID, getRecordsByID } from '@/lib/api/generic-sql-statements';
import type { NextApiRequest, NextApiResponse } from 'next'


export const handler = async (req: NextApiRequest, res: NextApiResponse) => {

  const impossibleErrorMessage = "couldn't read id from URL query string";

  return Promise.resolve(req.query).

    // handle weird cases
    then((query) => {
      const genericID = query['objectid'] ?? impossibleErrorMessage;
      return Array.isArray(genericID) ? genericID[0] ?? impossibleErrorMessage : genericID
    }).

    then(attemptToParseInt).

    // first, get all constituents related to object
    then(_ => getRecordsByID<ConstituentsxobjectsRecord>('constituentsxobjects',
                                                         'Object_ID', _,
                                                         API_ASSOC_ARRAY_LIMIT)).
    then(_ => {
      if (_==null)
        res.status(500).json({ error: "no records found" });
      return _.map(i => { return { role:i.Role, Constituent_ID:i.Constituent_ID }; });
    }).

    // next, get more info on each constituent
    then(_ => {
      return _.map(({ role, Constituent_ID }) => {
        const constRecord = getRecordByID<ConstituentsRecord>('constituents', 'Constituent_ID', Constituent_ID);
        return { ...constRecord, role };
      });
    }).
    then(data => res.status(200).json(data)).
    catch(e => res.status(500).json({ error: e.message }));
};

export default handler;
