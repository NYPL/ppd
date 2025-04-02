import { protoColumnDefs } from './proto-column-definitions';
import { FIELD_CHARACTER_LIMIT, TITLE_CHARACTER_LIMIT } from './config';
import { addNewKeyValToColumnDefs, clipOnlyForDisplay, redactOnlyForExport } from './utils';

/**
 * this module imports the auto-generated `protoColumnDefs`, mutates
 * it, and exports the result
 **/

//  TODO  this can use some cleanup

//  TODO  rename
// interface ColumnDef {
//   data: string;
//   name: string;
//   searchable?: boolean;
//   orderable?: boolean;
// }
// interface ColumnDefs {
//   // arbitrary number of keys,
//   // vals are ColumnDef[]
// }


let columnDefs = protoColumnDefs;


/************************************************************
 ** table: MAIN                                            **
 ************************************************************/


const titleClip = clipOnlyForDisplay(TITLE_CHARACTER_LIMIT);
const fieldClip = clipOnlyForDisplay(FIELD_CHARACTER_LIMIT);

/* Title must be clipped */
columnDefs = addNewKeyValToColumnDefs(columnDefs, 'main', 'Title', 'render', titleClip);


/* other fields that have to be tamed */
const mainFieldsToClip = [
  "Bibliography",
  "Provenance",
  "Notes",
  "Description",
  "Provenance",
  "Description",
  "Credit_Line",
  "Inscribed",
  "Markings",
  "Portfolio",
  "Collection",
  "Home_Location",
  "Series",
  "Descriptive_Title",
  "Folder",
  "Non_Display_Title",
  "Book_or_Album_Title",
  "Depicted_Location",
  "Institution",
  "Curatorial_Remarks"
];
mainFieldsToClip.forEach(field => {
  columnDefs = addNewKeyValToColumnDefs(columnDefs, 'main', field, 'render', fieldClip);
});

const mainFieldsToRedact = [
  "Home_Location"
];
mainFieldsToRedact.forEach(field => {
  columnDefs = addNewKeyValToColumnDefs(columnDefs, 'main', field, 'render', redactOnlyForExport());
});

/* Object Number should be a hyperlink */
columnDefs = addNewKeyValToColumnDefs(columnDefs, 'main', 'Object_Number', 'render',
                             (data: string, _: never, row: MainRecord) => {
  return `<a href="/object/${row['Object_ID']}" target="_blank">${data}</a>`;
});

/* I have just discovered: some fields are more searchable than others */
const mainNonSearchableFields = [
  "Object_ID", "Home_Location"
];
mainNonSearchableFields.forEach(field => {
  columnDefs = addNewKeyValToColumnDefs(columnDefs, 'main', field, 'searchable', 'false');
});

// render Object_ID as a link in exports
// columnDefs = addNewKeyValToColumnDefs(columnDefs, 'main', 'Object_ID', 'render', oidLinkOnlyForExport);

// shorten some column names
columnDefs = addNewKeyValToColumnDefs(columnDefs, 'main', 'Object_ID', 'title', 'OID');
columnDefs = addNewKeyValToColumnDefs(columnDefs, 'main', 'Department', 'title', 'Dept.');




export default columnDefs;
