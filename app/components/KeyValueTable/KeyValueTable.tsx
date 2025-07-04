
import styles from './KeyValueTable.module.scss';
import { formatCurrency } from '../../../lib/utils';


interface Props {
  payload: any;
}

export const KeyValueTable = ({ payload }: Props) => {
  
  //  TODO  no `any`
  const makeRow = (k: any, v: any) => {
    //  TODO  I feel like this is super-kludgey
    //        put in a different place
    if (k === "Value")
      v = formatCurrency(v);
    return (
      <tr className={ styles['tr'] }>
        <td className={ styles['td'] }>{ k }</td>
        <td className={ styles['td'] }>{ v }</td>
      </tr>
    );
  };
  const allKeys = Object.keys(payload) as string[];
  const rows = allKeys.
    filter(key => payload[key]).
    map(key => makeRow(key.replaceAll("_", " "), payload[key]));

  return (
    <div className={ styles['key-value-holder'] }>
      <table className={ styles['table'] }>
        { rows }
      </table>
    </div>
  );
};
