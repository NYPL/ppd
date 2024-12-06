
import { ThumbnailHolder } from "./components/ThumbnailHolder";
import { Tombstone } from '../../Tombstone/Tombstone';
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import styles from './ObjectView.module.scss';

/*
 *  TODO  
 *
 *  this might get long... probably should extract some sub-components
 *
 */

interface HeaderProps {
  className: string;
  //  TODO  NO!
  children: any;
}

export const Header = ({ className, children }: HeaderProps) => {
  return <div className={ className }>{ children }</div>;
};

interface ContentProps {
  className: string;
  //  TODO  NO!
  children: any;
}

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

  return (
    <div id="object-view" className={ styles['object-view'] }>
      <Header className={ styles['header'] ?? "" }>
        <span className={ styles['object-number'] }>{ Object_Number }</span>
        <div className={ styles['oid-and-arrows'] }>
          <span className=''>{ `id: ${Object_ID}` }</span>
          <div className={ styles['header-arrows'] }>
            <div>
              <a className={ styles['header-angle-links'] } href={ `${ Object_ID-1 }` }> <FaAngleLeft /> </a>
            </div>
            <div>
              <a className={ styles['header-angle-links'] } href={ `${ Object_ID+1 }` }> <FaAngleRight /> </a>
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
