
import { ObjectCard } from "@/app/components/ObjectCard/ObjectCard";
import styles from './ExhibitionView.module.scss';


interface Props {
  exhPayload: ExhibitionsRecord;
  exhxobjPayload: Array<MainRecord>;
}

export const ExhibitionCard = ({ exhPayload }: { exhPayload: ExhibitionsRecord }) => {
  return (
    <div className={ styles['exhibition-card'] }>
      <span className={ styles['title'] }>{ exhPayload.Title }</span>
      <span className={ styles['display-date'] }>{ exhPayload.Display_Date }</span>
      <span className={ styles['boiler-text'] }>{ exhPayload.Boiler_Text }</span>
      { exhPayload.Sub_Title!=null ?
          <span className={ styles['sub-title'] }>{ exhPayload.Sub_Title }</span> :
          <></> }
    </div>
  );
};

export const ExhibitionView = ({ exhPayload, exhxobjPayload }: Props) => {

  const objCards = exhxobjPayload.length ?
    exhxobjPayload.map((i) => { return <ObjectCard payload={ i } /> }) :
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

