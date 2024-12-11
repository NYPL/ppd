
interface Props {
  exhPayload: ConstituentsRecord;
  exhxobjPayload: Array<ExhibitionsxobjectsRecord>;
}

export const ExhibitionView = ({ exhPayload, exhxobjPayload }: Props) => {
  return (
    <>
      <pre>{ JSON.stringify(exhPayload, null, 2) }</pre>
      <pre>{ JSON.stringify(exhxobjPayload, null, 2) }</pre>
    </>
  );
};

