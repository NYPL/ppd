
import styles from './Tombstone.module.scss';

interface Props {
  Display_Name: string;
  Display_Date: string;
  Title: string;
  Medium: string;
  Dated: string;
  Credit_Line: string;
  Dimensions: string;
  Object_Number: string;
}

export const Tombstone = ({
  Display_Name, Display_Date, Title, Medium, Dated,
  Credit_Line, Dimensions
}: Props) => {

  //  TODO  this should be done elsewhere, right?!
  const dimensionsExcerpt = Dimensions.replace(/^.+?: (.+? in\.) \(.+$/, "$1");

  return (
    <div className={ styles['tombstone'] }>
      <div>
        <p className={ styles['tombstone-name'] }>{ Display_Name }</p>
        <p className={ styles['tombstone-con-date'] }>{ Display_Date }</p>
      </div>
      <div>
        <p className={ styles['tombstone-title'] }>{ Title }</p>
        <p className={ styles['tombstone-art-date'] }>{ Dated }</p>
      </div>
      <div>
        <p className={ styles['tombstone-medium'] }>{ Medium }</p>
        <p className={ styles['tombstone-dimensions'] }>{ dimensionsExcerpt }</p>
      </div>
      <div>
        <p className={ styles['tombstone-credit-line'] }>{ Credit_Line }</p>
        { /* <p className={ styles['tombstone-obj-number'] }>{ Object_Number }</p> */ }
      </div>

    </div>
  );
};

export default Tombstone;

