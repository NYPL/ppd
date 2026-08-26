import { protoColumnDefs } from './proto-column-definitions';
import { FIELD_CHARACTER_LIMIT, TITLE_CHARACTER_LIMIT } from './config';
import { addNewKeyValToColumnDefs, clipOnlyForDisplay, clipStringAtLengthN, moveColumnBefore, removeColumn, redactOnlyForExport } from './utils';

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

/*** Fields to redact ***/
/* Value should look like a monetary value */
columnDefs = addNewKeyValToColumnDefs(columnDefs, 'main', 'Value', 'render', redactOnlyForExport(true));
columnDefs = addNewKeyValToColumnDefs(columnDefs, 'main', 'Home_Location', 'render', redactOnlyForExport());

/* Object Number should be a hyperlink */
columnDefs = addNewKeyValToColumnDefs(columnDefs, 'main', 'Object_Number', 'render',
                             (data: string, _: never, row: MainRecord) => {
  return `<a href="/object/${row['Object_ID']}" target="_blank">${data}</a>`;
});

/* I have just discovered: some fields are more searchable than others */
const mainNonSearchableFields = [
  "Object_ID", "Home_Location", "Value"
];
mainNonSearchableFields.forEach(field => {
  columnDefs = addNewKeyValToColumnDefs(columnDefs, 'main', field, 'searchable', 'false');
});

// render Object_ID as a link in exports
// columnDefs = addNewKeyValToColumnDefs(columnDefs, 'main', 'Object_ID', 'render', oidLinkOnlyForExport);

// shorten some column names
columnDefs = addNewKeyValToColumnDefs(columnDefs, 'main', 'Object_ID', 'title', 'OID');
columnDefs = addNewKeyValToColumnDefs(columnDefs, 'main', 'Department', 'title', 'Dept.');


/************************************************************
 ** table: CONSTITUENTS                                    **
 ************************************************************/

/* Display_Name is the most useful column, so it goes first
   (well, right after Constituent_ID) */
columnDefs = moveColumnBefore(columnDefs, 'constituents', 'Display_Name', 'First_Name');

/* Display_Name is a hyperlink to the constituent page
   (but only for display; exports get the plain name) */
columnDefs = addNewKeyValToColumnDefs(columnDefs, 'constituents', 'Display_Name', 'render',
                             (data: string, type: DTOrthogonalType, row: ConstituentRecord) => {
  if (type !== 'display')
    return data;
  return `<a href="/constituent/${row['Constituent_ID']}" target="_blank">${data}</a>`;
});

/* other fields that have to be tamed */
columnDefs = addNewKeyValToColumnDefs(columnDefs, 'constituents', 'Institution', 'render', fieldClip);

columnDefs = addNewKeyValToColumnDefs(columnDefs, 'constituents', 'Constituent_ID', 'searchable', 'false');

// shorten some column names
columnDefs = addNewKeyValToColumnDefs(columnDefs, 'constituents', 'Constituent_ID', 'title', 'CID');


/************************************************************
 ** table: EXHIBITIONS                                     **
 ************************************************************/

/* Title must be clipped, and is a hyperlink to the exhibition page
   (but only for display; exports get the full, un-linked title) */
columnDefs = addNewKeyValToColumnDefs(columnDefs, 'exhibitions', 'Title', 'render',
                             (data: string, type: DTOrthogonalType, row: ExhibitionRecord) => {
  if (type !== 'display')
    return data;
  const clipped = clipStringAtLengthN(data, TITLE_CHARACTER_LIMIT);
  return `<a href="/exhibition/${row['Exhibition_ID']}" target="_blank">${clipped}</a>`;
});

/* other fields that have to be tamed */
const exhibitionsFieldsToClip = [
  "Boiler_Text",
  "Remarks",
  "Citation",
  "Organization_Credit_Line",
  "Sponsor_Credit_Line",
  "Sub_Title"
];
exhibitionsFieldsToClip.forEach(field => {
  columnDefs = addNewKeyValToColumnDefs(columnDefs, 'exhibitions', field, 'render', fieldClip);
});

/* columns we don't want at all */
columnDefs = removeColumn(columnDefs, 'exhibitions', 'Is_Virtual');

columnDefs = addNewKeyValToColumnDefs(columnDefs, 'exhibitions', 'Exhibition_ID', 'searchable', 'false');

// shorten some column names
columnDefs = addNewKeyValToColumnDefs(columnDefs, 'exhibitions', 'Exhibition_ID', 'title', 'EID');
columnDefs = addNewKeyValToColumnDefs(columnDefs, 'exhibitions', 'Department', 'title', 'Dept.');




export default columnDefs;
