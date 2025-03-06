import { API_ASSOC_ARRAY_LIMIT } from '@/lib/config';
import { attemptToParseInt } from '@/lib/utils';
import { getRecordByID, getRecordsByID } from '@/lib/api/generic-sql-statements';
import type { NextApiRequest, NextApiResponse } from 'next'


//  TODO  there's "2" much repetition. refactor



export const handler = async (req: NextApiRequest, res: NextApiResponse) => {

  const impossibleErrorMessage = "couldn't read id from URL query string";

  // handle weird cases
  return Promise.resolve(req.query).

    then((query) => {
      const genericID = query['exhibitionid'] ?? impossibleErrorMessage;
      return Array.isArray(genericID) ? genericID[0] ?? impossibleErrorMessage : genericID;
    }).

    then(attemptToParseInt).

    then(_ => getRecordByID<ExhibitionRecord>('exhibitions', 'Exhibition_ID', _)).
    then(_ => {
      if (_==null)
        return res.status(500).json({ error: "no records found" });
      return _;
    }).

    then(_ => {
      const objects = getRecordsByID<ExhibitionsXObjectsRecord>('exhibitionsxobjects',
                                                                'Exhibition_ID',
                                                                 _!['Exhibition_ID'],
                                                                 API_ASSOC_ARRAY_LIMIT);
      return { info: _!, objects: objects.map(_ => _['Object_ID']) };
    }).

    then(_ => {
      const tmp = _['objects']. // objectids to now lookup
        map(_ => getRecordByID<MainRecord>('main', 'Object_ID', _));
      return Array.from(tmp);
    }).
    then(data => res.status(200).json(data)).
    catch(e => res.status(500).json({ error: e.message }));
};

export default handler;

