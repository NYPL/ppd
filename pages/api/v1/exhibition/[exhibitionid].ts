import { makeRecordRetrieverHandler } from '@/lib/api/generic-sql-statements';

export const handler = makeRecordRetrieverHandler('exhibitions', 'exhibitionid', 'Exhibition_ID');

export default handler;
