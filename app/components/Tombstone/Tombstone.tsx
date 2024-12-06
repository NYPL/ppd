
import styles from './Tombstone.module.scss';

interface Props {
  Display_Name: string;
  Display_Date: string;
  Title: string;
  Medium: string;
}

export const Tombstone = ({ Display_Name, Display_Date, Title, Medium}: Props) => {
  return (
    <div className={ styles['tomb-stone'] }>
      <div>
        <p className={ styles['tomb-stone-name'] }>{ Display_Name }</p>
        <p className={ styles['tomb-stone-date'] }>{ Display_Date }</p>
      </div>
      <p className={ styles['tomb-stone-title'] }>{ Title }</p>
      <p className={ styles['tomb-stone-medium'] }>{ Medium }</p>
    </div>
  );
};

export default Tombstone;

