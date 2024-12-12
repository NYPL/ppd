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

    // first, get all exhibitions related to object
    then(_ => getRecordsByID<ExhibitionsxobjectsRecord>('exhibitionsxobjects',
                                                        'Object_ID', _,
                                                        API_ASSOC_ARRAY_LIMIT)).
    then(_ => {
      if (_==null)
        res.status(500).json({ error: "no records found" });
      return _.map(i => i.Exhibition_ID);
    }).

    // next, get more info on each exhibition
    then(_ => {
      return _.map(i => {
        const exhRecord = getRecordByID<ExhibitionsRecord>('exhibitions', 'Exhibition_ID', i);
        return exhRecord;
      });
    }).
    then(data => res.status(200).json(data)).
    catch(e => res.status(500).json({ error: e.message }));
};

export default handler;


