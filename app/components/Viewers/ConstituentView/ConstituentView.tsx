
interface Props {
  conPayload: ConstituentsRecord;
  conxobjPayload: Array<ConstituentsxobjectsRecord>;
}

export const ConstituentView = ({ conPayload, conxobjPayload }: Props) => {
  return (
    <>
      <pre>{ JSON.stringify(conPayload, null, 2) }</pre>
      <pre>{ JSON.stringify(conxobjPayload, null, 2) }</pre>
    </>
  );
};

