
import { ObjectCard } from "@/app/components/ObjectCard/ObjectCard";
import styles from './ConstituentView.module.scss';

interface Props {
  conPayload: ConstituentsRecord;
  conxobjPayload: Array<MainRecord>;    //  TODO  (not really)
}


export const ConstituentCard = ({ conPayload }: { conPayload: ConstituentsRecord }) => {
  return (
    <div className={ styles['constituent-card'] }>
      <span className={ styles['display-conid'] }>#{ conPayload.Constituent_ID }</span>
      <span className={ styles['display-name'] }>{ conPayload.Display_Name }</span>
      <span className={ styles['display-date'] }>{ conPayload.Display_Date }</span>
    </div>
  );
};

export const ConstituentView = ({ conPayload, conxobjPayload }: Props) => {

  const objCards = conxobjPayload.length ?
    conxobjPayload.map((i: MainRecord) => {
      return <ObjectCard payload={ i } includeArtistP={ false } includeRoleP={ true } />
    }) :
    <></>;

  return (
    <div className={ styles['constituent-view'] }>
      <div className={ styles['left'] }>
        <ConstituentCard conPayload={ conPayload } />
      </div>
      <div className={ styles['right'] }>
        <div className={ styles['obj-cards'] }>
          { objCards }
        </div>
      </div>
    </div>
  );
};

