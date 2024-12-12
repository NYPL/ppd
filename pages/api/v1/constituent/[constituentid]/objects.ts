import { API_ASSOC_ARRAY_LIMIT } from '@/lib/config';
import { attemptToParseInt } from '@/lib/utils';
import { getRecordByID, getRecordsByID } from '@/lib/api/generic-sql-statements';
import type { NextApiRequest, NextApiResponse } from 'next'


//  TODO  there's "2" much repetition. refactor



export const handler = async (req: NextApiRequest, res: NextApiResponse) => {

  const impossibleErrorMessage = "couldn't read id from URL query string";

  return Promise.resolve(req.query).

    // handle weird cases
    then((query) => {
      const genericID = query['constituentid'] ?? impossibleErrorMessage;
      return Array.isArray(genericID) ? genericID[0] ?? impossibleErrorMessage : genericID
    }).

    then(attemptToParseInt).

    then(_ => getRecordByID<ConstituentsRecord>('constituents', 'Constituent_ID', _)).
    then(_ => {
      if (_==null || !_ )
        return res.status(500).json({ error: "no records found" });
      return _;
    }).
    then(_ => {
      const objects = getRecordsByID<ConstituentsxobjectsRecord>('constituentsxobjects',
                                                                 'Constituent_ID',
                                                                  _!['Constituent_ID'],
                                                                  API_ASSOC_ARRAY_LIMIT);
      const oids = objects.map(({ Object_ID, Role }: ConstituentsxobjectsRecord) => {
        return { Object_ID, Role };
      });

      const tmp = oids.
        map(_ => {
          const record = getRecordByID<MainRecord>('main', 'Object_ID', _['Object_ID']);
          return { record, role: _['Role'] };
        });

      return tmp;
    }).

    then(data => res.status(200).json(data)).
    catch(e => res.status(500).json({ error: e.message }));
};

export default handler;

