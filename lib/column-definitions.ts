
import { protoColumnDefs } from './proto-column-definitions';
import { TITLE_CHARACTER_LIMIT } from './config';
import { addNewKeyValToColumnDefs } from './utils';


let columnDefs = protoColumnDefs;

/* Title must be clipped */
columnDefs = addNewKeyValToColumnDefs(columnDefs, 'main', 'Title', 'render',
                             (data: string) => {
  if (data.length > TITLE_CHARACTER_LIMIT)
    return `${data.slice(0, TITLE_CHARACTER_LIMIT-3)}...`;
  return data;
});


export default columnDefs;

