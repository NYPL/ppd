import { attemptToParseInt } from '@/lib/utils';
import { getRecordByID } from '@/lib/api/generic-sql-statements';
import type { NextApiRequest, NextApiResponse } from 'next'

//  TODO  there's "2" much repetition. refactor

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const impossibleErrorMessage = "couldn't read id from URL query string";
  Promise.resolve(req.query).
    then((query) => {
      const genericID = query['exhibitionid'] ?? impossibleErrorMessage;
      return Array.isArray(genericID) ? genericID[0] ?? impossibleErrorMessage : genericID
    }).
    then(attemptToParseInt).
    then(_ => getRecordByID<ExhibitionsRecord>('exhibitions', 'Exhibition_ID', _)).
    then(_ => {
      if (_==null)
        res.status(500).json({ error: "no records found" });
      return _;
    }).
    then(_ => {
      const objects = getRecordByID<Array<ExhibitionsxobjectsRecord>>('exhibitionsxobjects',
                                                                       'Exhibition_ID',
                                                                       _['Exhibition_ID'], true);
      return { info: _, objects: objects.map(_ => _['Object_ID']) };
    }).
    then(_ => {
      const tmp = _['objects'].
        map(_ => getRecordByID<MainRecord>('main', 'Object_ID', _)).
        map(_ => {
          return {
            Object_ID: _['Object_ID'], Title: _['Title'],
            Medium: _['Medium'], Dated: _['Dated'], Link: _['Link'],
            Display_Name: _['Display_Name'],
            Display_Date: _['Display_Date']
          }
        });
      return Array.from(tmp);
    }).
    then(data => res.status(200).json(data)).
    catch(e => res.status(500).json({ error: e.message }));
};

export default handler;

