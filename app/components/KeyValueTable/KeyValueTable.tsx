
import styles from './KeyValueTable.module.scss';

interface Props {
  payload: any;
}

type MRKey = keyof MainRecord;

export const KeyValueTable = ({ payload }: Props) => {
  
  //  TODO  no `any`
  const makeRow = (k: any, v: any) => {
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
