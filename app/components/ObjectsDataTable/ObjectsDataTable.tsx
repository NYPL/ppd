'use client';

import { API_PATH } from "@/lib/config";
import columnDefs   from "@/lib/column-definitions";
import GenericDataTable from "../GenericDataTable/GenericDataTable";
import type { GenericDataTableProps, SearchMode } from "../GenericDataTable/GenericDataTable";

/**
 * the PPD-specific instantiation of GenericDataTable: it derives the
 * dtajax endpoint URL and column definitions from `tableName`, and
 * looks up any per-table extras (search modes, option overrides) below
 **/

interface PerTableConfig {
  id: string;
  searchModes?: SearchMode[];
  options?: GenericDataTableProps['options'];
}

const perTableConfig: Partial<Record<TableName, PerTableConfig>> = {

  main: {
    id: 'main-table',
    // these correspond to main's FTS5 tables in ppd.db
    searchModes: [
      { value: 'classic',        label: 'Classic' },
      { value: 'ftglobal',       label: '*Enhanced* global' },
      { value: 'fttitles',       label: '*Enhanced* title' },
      { value: 'ftconstituents', label: '*Enhanced* constituents' }
    ]
  },

  constituents: {
    id: 'constituents-table',
    // no FTS5 tables (yet), so no searchModes
    options: {
      fixedColumns: { start: 1 }
    }
  }

};


export const PpdDataTable = ({ tableName }: { tableName: TableName }) => {
  const config = perTableConfig[tableName];
  return (
    <GenericDataTable
      key={ tableName }
      id={ config?.id }
      ajaxUrl={ `/${API_PATH}/${tableName}/dtajax` }
      columns={ columnDefs[tableName] }
      searchModes={ config?.searchModes }
      options={ config?.options }
    />
  );
};

export default PpdDataTable;

