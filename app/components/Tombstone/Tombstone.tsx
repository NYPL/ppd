
import styles from './Tombstone.module.scss';

interface Props {
  Display_Name: string;
  Display_Date: string;
  Title: string;
  Medium: string;
}

export const Tombstone = ({ Display_Name, Display_Date, Title, Medium}: Props) => {
  return (
    <div className={ styles['tombstone'] }>
      <div>
        <p className={ styles['tombstone-name'] }>{ Display_Name }</p>
        <p className={ styles['tombstone-date'] }>{ Display_Date }</p>
      </div>
      <p className={ styles['tombstone-title'] }>{ Title }</p>
      <p className={ styles['tombstone-medium'] }>{ Medium }</p>
    </div>
  );
};

export default Tombstone;

