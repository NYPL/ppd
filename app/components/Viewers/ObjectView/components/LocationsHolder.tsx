
import styles from './LocationsHolder.module.scss';

//  TODO  reduce duplication with ConstituentHolder
//  TODO  there's a color in the CSS than needs to be parameterized

interface CardProps {
  location: ObjectsXLocationsRecord;
}

export const LocationsCard = ({ location }: CardProps) => {
  const {
    Location_Type,
    Location_Active,
    Location_String
  } = location;

  return (
    <div className={ styles['card'] }>
      <div className={ styles['left'] }>
        <div className={ styles['location-label'] }>{
          Location_Active === 0
            ? `${Location_Type} (inactive)`
            : Location_Type
        }</div>
      </div>
      <div className={ styles['right'] }>
        <div className="title">
          { Location_String }
        </div>
      </div>
    </div>
  );
};


interface Props {
  payload: Array<ObjectsXLocationsRecord>;
}


export const LocationsHolder = ({ payload }: Props) => {

  //  TODO  have to add a key (in Exhibitions, too)
  const locCards = payload.map(i => <LocationsCard location={ i } />);

  return (
    <div className={ styles['header-and-holder'] }>
      <div className={ styles['header'] }>Locations</div>
      <div className={ styles['holder'] }>
        { locCards }
      </div>
    </div>
  );
};

