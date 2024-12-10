
import { attemptToParseInt } from '@/lib/utils';
import { getRecordByID } from '@/lib/api/generic-sql-statements';
import type { NextApiRequest, NextApiResponse } from 'next'




export const makeRecordRetrieverHandler = (table: TableName,
                                           queryKey: string,
                                           field: string,
                                           all: boolean=false) => {
  return  async (req: NextApiRequest, res: NextApiResponse) => {
    const impossibleErrorMessage = "couldn't read id URL query string";
    Promise.resolve(req.query).
      then((query) => {
        const genericID = query[queryKey] ?? impossibleErrorMessage;
        return Array.isArray(genericID) ? genericID[0] ?? impossibleErrorMessage : genericID
      }).
      then(attemptToParseInt).
      then(_ => getRecordByID(table, field, _, all)).
      then(data => res.status(200).json(data)).
      catch(e => res.status(500).json({ error: e.message }));
  };
};




export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const impossibleErrorMessage = "couldn't read objectid from URL query string";
  Promise.resolve(req.query).
    then((query) => {
      const genericID = query['objectid'] ?? impossibleErrorMessage;
      return Array.isArray(genericID) ? genericID[0] ?? impossibleErrorMessage : genericID
    }).
    then(attemptToParseInt).
    // first, get all constituents related to object
    then(_ => getRecordByID<Array<ConstituentsxobjectsRecord>>('constituentsxobjects', 'Object_ID', _, true)).
    then(_ => {
      if (_==null)
        res.status(500).json({ error: "no records found" });
      return _.map(i => { return { role:i.Role, Constituent_ID:i.Constituent_ID }; });
    }).
    // next, get more info on each constituent
    // looks like: [{"role":"Photographer","Constituent_ID":13943},{"role":"Printer","Constituent_ID":16877},{"role":"Dealer","Constituent_ID":13943}]
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


