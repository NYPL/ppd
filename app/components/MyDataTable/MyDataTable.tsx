'use client';

import { API_PATH } from "@/lib/config";
import columnDefs   from "@/lib/column-definitions";

import { useEffect } from 'react';
import 'jquery';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import 'datatables.net-buttons-dt';
import 'datatables.net-buttons/js/buttons.colVis.mjs';
import 'datatables.net-buttons/js/buttons.html5.mjs';
import 'datatables.net-buttons/js/buttons.print.mjs';
import 'datatables.net-fixedheader-dt';
import 'datatables.net-fixedcolumns-dt';
import 'datatables.net-searchbuilder-dt';
import 'datatables.net-responsive-dt';
import 'datatables.net-select-dt';
import jszip from 'jszip';

import style from './MyDataTable.module.scss';

DataTable.use(DT);
DT.Buttons.jszip(jszip);


//  TODO  there are more options to port over
export const MyDataTable = ({ tableName }: { tableName: TableName }) => {

  const $ = require('jquery');

  console.log(columnDefs[tableName]);

  useEffect(() => {
    const table = $('#main-table').DataTable();

    const handleDropdownChange = () => table.ajax.reload();

    const dropdown = document.getElementById('global-search-option');
    dropdown?.addEventListener('change', handleDropdownChange);

    return () => {
      dropdown?.removeEventListener('change', handleDropdownChange);
    };
  }, []);

  // console.log(`${API_URL_PREFIX}/${tableName}/dtajax`);
  return (
    <div>

      <div className={ style['non-dt-search-options'] }>
        <label>
          Global search option:&nbsp;
          <select id="global-search-option" defaultValue="ftglobal">
            <option value="classic">Classic</option>
            <option value="ftglobal">*Enhanced* global</option>
            <option value="fttitles">*Enhanced* title</option>
            <option value="ftconstituents">*Enhanced* constituents</option>
          </select>
        </label>
      </div>

      <DataTable
        id="main-table"
        key={ tableName }
        className="display nowrap"
        columns={ columnDefs[tableName] }
        options={{

          ajax: (data, callback) => {
            const searchOption = document.getElementById('global-search-option') as HTMLSelectElement | null;
            const mode = searchOption?.value ?? 'classic'; // fallback if not found

            fetch(`${API_PATH}/${tableName}/dtajax`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...data, globalSearchMode: mode })
            }).
            then(r => r.json()).
            then(callback).
            catch(err => {
              console.error('Ajax error', err);
              callback({ data: [], recordsTotal: 0, recordsFiltered: 0 });
            });
          },

          deferRender: true,
          paging: true,
          pageLength: 10,
          lengthMenu: [
            [10, 25, 50, 100, 1000, 10000],
            [10, 25, 50, 100, '1,000', '10,000']
          ],
          // ordering: false,
          ordering: true,
          serverSide: true,
          processing: true,
          // responsive: true,
          scrollX: true,
          select: true,
          fixedHeader: true,
          fixedColumns: {
              start: 5
          },
          search: {
            // @ts-ignore: idk
            return: true
          },
          searchBuilder: { enterSearch: true },
          layout: {
            top2Start: 'searchBuilder',
            topEnd: ['search'],
            top1Start: {
              buttons: [ 'colvis',
                {
                  extend: 'copy',
                  exportOptions: { orthogonal: 'export' }
                },
                {
                  extend: 'csv',
                  exportOptions: { orthogonal: 'export' }
                },
                {
                  extend: 'excel',
                  exportOptions: { orthogonal: 'export' }
                }]
            }
          },
          language: {
            searchBuilder: {
              clearAll: "Clear custom search filters"
            }
          }
        }}>
      </DataTable>
    </div>
  );
};

export default MyDataTable;

