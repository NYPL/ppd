
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
    <div className="card">
      <div className="title">
        { /*  NOTE  are we ready for links */ }
        <a href={ `/constituent/${Constituent_ID}` }>{ Display_Name }</a>
      </div>
      <div className="display-date">{ Display_Date }</div>
      <div className="role">{ role }</div>
    </div>
  );
};

interface Props {
  payload: Array<ConstituentsRecord & { role: string }>;
}

export const ConstituentsHolder = ({ payload }: Props) => {

  const conCards = payload.map(i => <ConstituentCard constituent={ i } />);

  return (
    <div className="constituents-holder">
      <h3>Constituents</h3>
      <div className="constituent-card">
        { conCards }
      </div>
    </div>
  );
};

