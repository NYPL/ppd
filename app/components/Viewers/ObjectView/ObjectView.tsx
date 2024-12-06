
import { ThumbnailHolder } from "./components/ThumbnailHolder";
import { Tombstone } from '../../Tombstone/Tombstone';
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { dbConstants } from "@/lib/db-constants";
import styles from './ObjectView.module.scss';

/*
 *  TODO  
 *
 *  this might get long... probably should extract some sub-components
 *
 */

type HeaderProps  = Readonly<ContainsChildren & ContainsClassName>;
type ContentProps = Readonly<ContainsChildren & ContainsClassName>;

export const Header = ({ className, children }: HeaderProps) => {
  return <div className={ className }>{ children }</div>;
};

export const Content = ({ className, children }: ContentProps) => {
  return <div className={ className }>{ children }</div>;
};


interface Props {
  mainAPIPayload: MainRecord;
}

export const ObjectView = ({ mainAPIPayload }: Props) => {
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
        <div className={ styles['tombstone-and-thumbnail'] }>
          <Tombstone
            Title={ Title }
            Display_Name={ Display_Name }
            Display_Date={ Display_Date }
            Medium={ Medium } />
          <ThumbnailHolder imageLink={ Link } />
        </div>
      </Content>
    </div>
  );
};

export default ObjectView;
