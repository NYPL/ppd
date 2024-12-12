
import styles from './ObjectCard.module.scss';

interface Props {
  payload: MainRecord;
}

export const ObjectCard = ({ payload }: Props) => {
  const thumbnailp = payload.Link!=null ?
    <div className={ styles['thumbnail-holder'] }>
      { /*  TODO  should I use another image components e.g. Image, etc...? */ }
      <a href={ payload.Link } target="_blank">
        <img className={ styles['img'] } src={ payload.Link }/>
      </a>
    </div> :
    <></>;

  return (
    <div className={ styles['object-card'] }>
      <div className={ styles['left'] }>
        <div className={ styles['role'] }>
          <span>{ payload.Role }</span>
        </div>
        <div className={ styles['left-right'] }>
          <div className={ styles['pseudo-tombstone'] }>
            <div className={ styles['title'] }>
              <a className={ styles['obj-name-link'] } href={ `/object/${payload.Object_ID}` }>
                { payload.Title }
              </a>
            </div>
            <div className={ styles['display-date'] }>{ payload.Dated }</div>
            { payload.Medium!=null ?
                <div className={ styles['display-medium'] }>{ payload.Medium }</div> :
                <div></div> }
          </div>
        </div>
      </div>
      { /*  HACK  TERRIBLE! Adapt ThumbnailHolder! That's why you moved it */ }
      <div className={ styles['right'] }>
        { thumbnailp }
      </div>
    </div>
  );
};
