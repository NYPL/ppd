
interface CardProps {
  exhibition: ExhibitionsRecord;
}

export const ExhibitionCard = ({ exhibition }: CardProps) => {
  const {
    Exhibition_ID,
    Title,
    Department,
    Display_Date,
  } = exhibition;

  return (
    <div className="exhibition-card">
      <div>{ Exhibition_ID }</div>
      <div className="title">
        { /*  NOTE  are we ready for links */ }
        <a href={ `/exhibition/${Exhibition_ID}` }>{ Title }</a>
      </div>
      <div className="display-date">{ Display_Date }</div>
      <div className="department">{ Department }</div>
    </div>
  );
};


interface Props {
  payload: Array<ExhibitionsRecord>;
}


export const ExhibitionsHolder = ({ payload }: Props) => {

  const exhCards = payload.map(i => <ExhibitionCard exhibition={ i } />);

  return (
    <>
      <h3>Exhibitions</h3>
      <div className="pp">
        { exhCards }
      </div>
    </>
  );
};

