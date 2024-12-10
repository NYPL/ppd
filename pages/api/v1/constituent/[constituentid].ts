
import { makeRecordRetrieverHandler } from '@/lib/api/generic-sql-statements';

export const handler = makeRecordRetrieverHandler('constituents', 'constituentid', 'Constituent_ID');

export default handler;


