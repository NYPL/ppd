
import { ThumbnailHolder }           from "../../ThumbnailHolder/ThumbnailHolder";
import { ConstituentsHolder }        from "./components/ConstituentsHolder";
import { ExhibitionsHolder }         from "./components/ExhibitionsHolder";
import { LocationsHolder }           from "./components/LocationsHolder";
import { KeyValueTable }             from "@/app/components/KeyValueTable/KeyValueTable";
import { Tombstone }                 from '../../Tombstone/Tombstone';
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { dbConstants }               from "@/lib/db-constants";
import styles                        from './ObjectView.module.scss';


type HeaderProps  = Readonly<ContainsChildren & ContainsClassName>;
type ContentProps = Readonly<ContainsChildren & ContainsClassName>;

export const Header = ({ className, children }: HeaderProps) => {
  return <div className={ className }>{ children }</div>;
};

export const Content = ({ className, children }: ContentProps) => {
  return <div className={ className }>{ children }</div>;
};


interface Props {
  mainAPIPayload:       MainRecord;
  exhibitionsPayload:   Array<ExhibitionRecord>;
  constituentsPayload:  Array<ConstituentRecord & { role: string }>;
  locationsPayload:     Array<ObjectsXLocationsRecord>;
}

export const ObjectView = ({
    mainAPIPayload, exhibitionsPayload,
    constituentsPayload, locationsPayload
  }: Props) => {
  const {
    Object_ID,
    Object_Number,
    Title,
    Link,
    Display_Name,
    Display_Date,
    Medium
  } = mainAPIPayload;

  const prevOutOfBoundsP = (Object_ID-1) < dbConstants.main.min;
  const nextOutOfBoundsP = (Object_ID+1) > dbConstants.main.max;

  const cons = constituentsPayload.length > 0 ?
    <ConstituentsHolder payload={ constituentsPayload } /> :
    <></>;

  const exhs = exhibitionsPayload.length > 0 ?
    <ExhibitionsHolder payload={ exhibitionsPayload } /> :
    <></>;

  const locs = locationsPayload.length > 0 ?
    <LocationsHolder payload={ locationsPayload } /> :
    <></>;

  return (
    <div id="object-view" className={ styles['object-view'] }>
      <Header className={ styles['header'] ?? "" }>
        <span className={ styles['object-number'] }>{ Object_Number }</span>
        <div className={ styles['oid-and-arrows'] }>
          <span className=''>{ `id: ${Object_ID}` }</span>
          <div className={ styles['header-arrows'] }>
            <div>
              <a className={ !prevOutOfBoundsP ? styles['header-angle-links'] : styles['disabled-angle-links'] }
                 href={ !prevOutOfBoundsP ? `${ Object_ID-1 }` : '#' }>
                <FaAngleLeft />
              </a>
            </div>
            <div>
              <a className={ !nextOutOfBoundsP ? styles['header-angle-links'] : styles['disabled-angle-links'] }
                 href={ !nextOutOfBoundsP ? `${ Object_ID+1 }` : '#' }>
                <FaAngleRight />
              </a>
            </div>
          </div>
        </div>
      </Header>
      <Content className={ styles['content'] ?? "" }>
        <div className={ styles['left'] }>
          <Tombstone
            Title={ Title ?? "(no title)" }
            Display_Name={ Display_Name ?? "(no display name)" }
            Display_Date={ Display_Date ?? "(no display date)" }
            Medium={ Medium ?? "(no medium)" } />
          { cons }
          { exhs }
          { locs }
        </div>
        <div className={ styles['right'] }>
          { Link ?
              <ThumbnailHolder imageLink={ Link } /> :
              <></> }
          <KeyValueTable payload={ mainAPIPayload } />
        </div>
      </Content>
    </div>
  );
};

export default ObjectView;
