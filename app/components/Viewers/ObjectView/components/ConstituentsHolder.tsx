
import styles from './ConstituentsHolder.module.scss';

//  TODO  reduce duplication with ExhibitionHolder
//  TODO  there's a color in the CSS than needs to be parameterized

interface CardProps {
  constituent: ConstituentsRecord & { role: string }
}

export const ConstituentCard = ({ constituent }: CardProps) => {
  const {
    Constituent_ID,
    Display_Name,
    Display_Date,
    role
  } = constituent;
  return (
    <div className={ styles['card'] }>
      <div className={ styles['left'] }>
        <div className={ styles['role'] }>{ role }</div>
      </div>
      <div className={ styles['right'] }>
        <div className="title">
          <a className={ styles['con-name-link'] } href={ `/constituent/${Constituent_ID}` }>{ Display_Name }</a>
        </div>
        <div className="display-date">{ Display_Date }</div>
      </div>
    </div>
  );
};

interface Props {
  payload: Array<ConstituentsRecord & { role: string }>;
}

export const ConstituentsHolder = ({ payload }: Props) => {

  const conCards = payload.map(i => <ConstituentCard constituent={ i } />);

  return (
    <div className={ styles['header-and-holder'] }>
      <div className={ styles['header'] }>Constituents</div>
      <div className={ styles['holder'] }>
        { conCards }
      </div>
    </div>
  );
};

