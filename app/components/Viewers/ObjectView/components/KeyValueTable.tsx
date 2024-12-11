
import styles from './KeyValueTable.module.scss';

interface Props {
  payload: MainRecord;
}

type MRKey = keyof MainRecord;

export const KeyValueTable = ({ payload }: Props) => {
  
  const makeRow = (k: any, v: any) => {
    return (
      <tr className={ styles['tr'] }>
        <td className={ styles['td'] }>{ k }</td>
        <td className={ styles['td'] }>{ v }</td>
      </tr>
    );
  };
  const allKeys = Object.keys(payload) as MRKey[];
  const rows = allKeys.
    filter(key => payload[key]).
    map(key => makeRow(key, payload[key]));

  return (
    <div className={ styles['key-value-holder'] }>
      <table className={ styles['table'] }>
        { rows }
      </table>
    </div>
  );
};
