
import { ObjectCard } from "@/app/components/ObjectCard/ObjectCard";
import styles from './ExhibitionView.module.scss';

interface Props {
  exhPayload: ExhibitionsRecord;
  exhxobjPayload: Array<MainRecord>;    //  TODO  (not really)
}

export const ExhibitionCard = ({ exhPayload }: { exhPayload: ExhibitionsRecord }) => {
      // <span className={ styles['display-name'] }>{ exhPayload.Display_Name }</span>
      // <span className={ styles['display-date'] }>{ exhPayload.Display_Date }</span>
  return (
    <div className={ styles['exhibition-card'] }>
      { /* <span className={ styles['display-exhid'] }>#{ exhPayload.Exhibition_ID }</span> */ }
      <span className={ styles['title'] }>{ exhPayload.Title }</span>
      <span className={ styles['display-date'] }>{ exhPayload.Display_Date }</span>
      <span className={ styles['boiler-text'] }>{ exhPayload.Boiler_Text }</span>
      { /* <span className={ styles['remarks'] }>{ exhPayload.Remarks }</span> */ }
      { /* <span className={ styles['project-number'] }>{ exhPayload.Project_Number }</span> */ }
      { exhPayload.Sub_Title!=null ?
          <span className={ styles['sub-title'] }>{ exhPayload.Sub_Title }</span> :
          <></> }
    </div>
  );
};



export const ExhibitionView = ({ exhPayload, exhxobjPayload }: Props) => {

  const objCards = exhxobjPayload.length ?
    exhxobjPayload.map((i: MainRecord) => { return <ObjectCard payload={ i } /> }) :
    <></>;

  return (
    <div className={ styles['exhibition-view'] }>
      <div className={ styles['left'] }>
        <ExhibitionCard exhPayload={ exhPayload } />
      </div>
      <div className={ styles['right'] }>
        <div className={ styles['obj-cards'] }>
          { objCards }
        </div>
      </div>
    </div>
  );
};

