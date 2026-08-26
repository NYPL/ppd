'use client';

import { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import 'jquery';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import type { Config } from 'datatables.net-dt';
import type { DataTableRef } from 'datatables.net-react';
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

import style from './GenericDataTable.module.scss';

DataTable.use(DT);
DT.Buttons.jszip(jszip);


/**
 * A table-agnostic wrapper around datatables.net-react, in server-side
 * processing mode. It POSTs the DataTables request object to `ajaxUrl`
 * (a dtajax-style endpoint; see `pages/api/v1/main/dtajax`).
 *
 * If `searchModes` is given, a dropdown is rendered above the table and
 * the selected value is sent along with every request as
 * `globalSearchMode` (the first entry is the initial selection).
 * If it's omitted, no dropdown is rendered and the request body is the
 * unadorned DataTables request object.
 *
 * `options` is merged (shallowly, per top-level key) over the defaults
 * below, so callers can override e.g. `fixedColumns` without restating
 * the rest.
 **/

export interface SearchMode {
  value: string;
  label: string;
}

export interface GenericDataTableProps {
  ajaxUrl: string;
  columns: Config['columns'];
  id?: string;
  searchModes?: SearchMode[];
  searchModesLabel?: string;
  options?: Config;
}


export const GenericDataTable = ({
  ajaxUrl,
  columns,
  id,
  searchModes,
  searchModesLabel = 'Global search option:',
  options
}: GenericDataTableProps) => {

  const tableRef = useRef<DataTableRef>(null);
  // the ajax closure below is created once (at DataTable initialization),
  // so it reads the current mode through a ref, not through state
  const modeRef = useRef<string>(searchModes?.[0]?.value ?? '');
  const [mode, setMode] = useState(modeRef.current);

  const handleModeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    modeRef.current = e.target.value;
    setMode(e.target.value);
    tableRef.current?.dt()?.ajax.reload();
  };

  const defaultOptions: Config = {

    ajax: (data, callback) => {
      const body = searchModes
        ? { ...data, globalSearchMode: modeRef.current }
        : data;

      fetch(ajaxUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
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
    ordering: true,
    serverSide: true,
    processing: true,
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
  };

  return (
    <div>

      { searchModes &&
        <div className={ style['non-dt-search-options'] }>
          <label>
            { searchModesLabel }&nbsp;
            <select value={ mode } onChange={ handleModeChange }>
              { searchModes.map(({ value, label }) =>
                <option key={ value } value={ value }>{ label }</option>) }
            </select>
          </label>
        </div> }

      <DataTable
        ref={ tableRef }
        id={ id }
        className="display nowrap"
        columns={ columns }
        options={{ ...defaultOptions, ...options }}>
      </DataTable>
    </div>
  );
};

export default GenericDataTable;
