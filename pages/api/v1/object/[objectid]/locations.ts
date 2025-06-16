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

    // first, get all locations related to object
    then(_ => getRecordsByID<ObjectsXLocationsRecord>('objectsxlocations',
                                                      'Object_ID', _,
                                                       API_ASSOC_ARRAY_LIMIT)).
    then(_ => {
      if (_==null)
        res.status(500).json({ error: "no records found" });
      return _.map(i => { return { Location_Type:i.Location_Type,
                                   Location_Active: i.Location_Active,
                                   Locations_String: i.Location_String } });
    }).
    then(data => res.status(200).json(data)).
    catch(e => res.status(500).json({ error: e.message }));
};

export default handler;

