
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

/* Object Number should be a hyperlink */
columnDefs = addNewKeyValToColumnDefs(columnDefs, 'main', 'Object_Number', 'render',
                             (data: string, _: any, row: any) => {
  return `<a href="/object/${row['Object_ID']}" target="_blank">${data}</a>`;
});

// shorten some column names
columnDefs = addNewKeyValToColumnDefs(columnDefs, 'main', 'Object_ID', 'title', 'OID');
columnDefs = addNewKeyValToColumnDefs(columnDefs, 'main', 'Department', 'title', 'Dept.');

export default columnDefs;

