
import { ObjectCard } from "@/app/components/ObjectCard/ObjectCard";
import { KeyValueTable } from "@/app/components/KeyValueTable/KeyValueTable";
import styles from './ConstituentView.module.scss';

interface Props {
  conPayload: ConstituentsRecord;
  conxobjPayload: Array<MainRecord>;    //  TODO  (not really)
}

export const ConstituentView = ({ conPayload, conxobjPayload }: Props) => {

  const objCards = conxobjPayload.map((i: MainRecord) => {
    return <ObjectCard payload={ i } />
  });

  return (
    <div className={ styles['constituent-view'] }>
      <div className={ styles['left'] }>
        <KeyValueTable payload={ conPayload } />
      </div>
      <div className={ styles['right'] }>
        <div className={ styles['obj-cards'] }>
          { objCards }
        </div>
      </div>
    </div>
  );
};

