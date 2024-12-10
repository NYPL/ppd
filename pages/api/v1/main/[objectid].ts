
import { makeRecordRetrieverHandler } from '@/lib/api/generic-sql-statements';

export const handler = makeRecordRetrieverHandler('main', 'objectid', 'Object_ID');

export default handler;

