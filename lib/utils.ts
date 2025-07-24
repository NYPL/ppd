
export const attemptToParseInt = (s: string): number => {
  const ret = parseInt(s)
  if (isNaN(ret)) throw new Error (`"${s}" is not an integer`);
  return ret;
};

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
});

export const formatCurrency = (n: number | null): string => {
  return n ? formatter.format(n) : "";
}

export const clipStringAtLengthN = (s: string, n: number): string => {
  try {
    if (s.length > n)
      return `<span title="${s}">${s.slice(0, n-3)}...</span>`;
    return s;
  } catch(_) {
    return "";
  }
};

export const clipOnlyForDisplay = (n: number): DTRenderFunction => {
  return (data: string, type: DTOrthogonalType) => {
    if (type !== 'display')
      return data;
    return clipStringAtLengthN(data, n);
  }
};

export const redactOnlyForExport = (currency=false): DTRenderFunction => {
  return (data: any, type: DTOrthogonalType) => {
    if (type === 'display') {
      if (currency)
        return formatCurrency(data);
      return data;
    }
    return 'REDACTED';
  }
};

export const oidLinkOnlyForExport = (data: number, type: DTOrthogonalType) => {
  console.log({ type });
  if (type !== 'export')
    return data;
  return `https://ppd.nypl.org/object/${data}`;
};


export const addNewKeyValToColumnDefs = (colDefs: any, table: string, dataValue: string, key: string, val: any) => {
  // @ts-ignore
  const ind = colDefs[table].findIndex(i => i.data===dataValue);
  if (ind < 0) throw new Error(`no such field "${dataValue}"`);
  const old = colDefs[table][ind];
  old[key] = val;
  colDefs[table][ind] = old;
  return colDefs;
};

