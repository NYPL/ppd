// @ts-nocheck

export const attemptToParseInt = (s: string): number => {
  const ret = parseInt(s)
  if (isNaN(ret)) throw new Error (`"${s}" is not an integer`);
  return ret;
};

export const addNewKeyValToColumnDefs = (colDefs: any, table: string, dataValue: string, key: string, val: any) => {
  const ind = colDefs[table].findIndex(i => i.data===dataValue);
  if (ind < 0) throw new Error(`no such field "${dataValue}"`);
  const old = colDefs[table][ind];
  old[key] = val;
  colDefs[table][ind] = old;
  return colDefs;
};

/*
 * Big ups to Mauricio van der Maesen for this one:
 * https://stackoverflow.com/a/43513777
 */
export const getParamsAsObject = (url: Url) => {
  const query = url.substring(url.indexOf('?') + 1);
  const re = /([^&=]+)=?([^&]*)/g;
  const decodeRE = /\+/g;

  const decode = (str: string) => {
    return decodeURIComponent(str.replace(decodeRE, " "));
  };

//  TODO  type this later

  const params: any = {};
  let e;
  while (e = re.exec(query)) {
    let k = decode(e[1]), v = decode(e[2]);
    if (k.substring(k.length - 2) === '[]') {
      k = k.substring(0, k.length - 2);
      (params[k] || (params[k] = [])).push(v);
    }
    else params[k] = v;
  }

  const assign = (obj: any, keyPath: any, value: any) => {
    const lastKeyIndex = keyPath.length - 1;
    for (let i = 0; i < lastKeyIndex; ++i) {
      const key = keyPath[i];
      if (!(key in obj))
        obj[key] = {}
      obj = obj[key];
    }
    obj[keyPath[lastKeyIndex]] = value;
  }

  for (let prop in params) {
    const structure = prop.split('[');
    if (structure.length > 1) {
      const levels: string[] = [];
      structure.forEach((item) => {
        const key = item.replace(/[?[\]\\ ]/g, '');
        levels.push(key);
      });
      assign(params, levels, params[prop]);
      delete(params[prop]);
    }
  }
  return params;
};

