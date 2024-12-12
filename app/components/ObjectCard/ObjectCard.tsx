
import styles from './ObjectCard.module.scss';

interface Props {
  payload: MainRecord;
  includeArtistP?: boolean;
  includeRoleP?: boolean;
}

//  TODO  make more flexible (e.g. `incudeArtistP`.... but a config object?

export const ObjectCard = ({ payload, includeArtistP=true, includeRoleP=false }: Props) => {
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
        { includeRoleP ?
            <div className={ styles['role'] }>
              <span>{ payload.Role }</span>
            </div> : <></> }
        <div className={ styles['left-right'] }>
          <div className={ styles['pseudo-tombstone'] }>
            <div className={ styles['title'] }>
              <a className={ styles['obj-name-link'] } href={ `/object/${payload.Object_ID}` }>
                { payload.Title }
              </a>
            </div>
            { includeArtistP ?
                <div className={ styles['artist-and-display-date'] }>
                  <div className={ styles['artist'] }>
                    { payload.Display_Name }
                  </div>
                  <div className={ styles['display-date'] }>
                    ({ payload.Display_Date })
                  </div>
                </div> :
                <></> }
            <div className={ styles['dated'] }>{ payload.Dated }</div>
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
