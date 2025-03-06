
import styles from './ExhibitionsHolder.module.scss';

//  TODO  reduce duplication with ConstituentHolder
//  TODO  there's a color in the CSS than needs to be parameterized

interface CardProps {
  exhibition: ExhibitionRecord;
}

export const ExhibitionCard = ({ exhibition }: CardProps) => {
  const {
    Exhibition_ID,
    Title,
    Department,
    Display_Date,
  } = exhibition;

  return (
    <div className={ styles['card'] }>
      <div className={ styles['left'] }>
        <div className={ styles['department'] }>{ Department }</div>
      </div>
      <div className={ styles['right'] }>
        <div className="title">
          { /*  NOTE  are we ready for links */ }
          <a className={ styles['exh-name-link'] } href={ `/exhibition/${Exhibition_ID}` }>{ Title }</a>
        </div>
        <div className="display-date">{ Display_Date }</div>
      </div>
    </div>
  //   <div className={ styles['card'] }>
  //     <div className="title">
  //       { /*  NOTE  are we ready for links */ }
  //       <a href={ `/exhibition/${Exhibition_ID}` }>{ Title }</a>
  //     </div>
  //     <div className="display-date">{ Display_Date }</div>
  //     <div className="department">{ Department }</div>
  //   </div>
  );
};


interface Props {
  payload: Array<ExhibitionRecord>;
}


export const ExhibitionsHolder = ({ payload }: Props) => {

  const exhCards = payload.map(i => <ExhibitionCard exhibition={ i } />);

  return (
    <div className={ styles['header-and-holder'] }>
      <div className={ styles['header'] }>Exhibitions</div>
      <div className={ styles['holder'] }>
        { exhCards }
      </div>
    </div>
  );
};

