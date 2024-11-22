'use client';

import { API_PATH } from "@/lib/config";
import { columnDefs } from "@/lib/column-definitions";

import 'jquery';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import 'datatables.net-buttons-dt';
import 'datatables.net-buttons/js/buttons.colVis.mjs';
import 'datatables.net-buttons/js/buttons.html5.mjs';
import 'datatables.net-buttons/js/buttons.print.mjs';
import 'datatables.net-fixedheader-dt';
import 'datatables.net-searchbuilder-dt';
import 'datatables.net-responsive-dt';
import 'datatables.net-select-dt';
import jszip from 'jszip';

DataTable.use(DT);
DT.Buttons.jszip(jszip);

          // url: `http://localhost:3333/api/mii/dtajax`,

//  TODO  there are more options to port over
export const MyDataTable = ({ tableName }: { tableName: TableName }) => {
  console.log(columnDefs[tableName]);
  // console.log(`${API_URL_PREFIX}/${tableName}/dtajax`);
  return (
    <DataTable
      key={ tableName }
      className="display nowrap"
      columns={ columnDefs[tableName] }
      options={{
        ajax: `${API_PATH}/${tableName}/dtajax`,
        deferRender: true,
        paging: true,
        pageLength: 10,
        // ordering: false,
        ordering: true,
        serverSide: true,
        processing: true,
        responsive: true,
        select: true,
        fixedHeader: true,
        search: true,
        searchBuilder: { enterSearch: true },
        layout: {
          top2Start: 'searchBuilder',
          topEnd: ['search'],
          top1Start: {
            buttons: [ 'colvis', 'copy', 'csv', 'excel' ]
          }
        }
      }}></DataTable>
  );
};

export default MyDataTable;

