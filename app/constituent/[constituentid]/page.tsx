
import { PORT, API_PATH } from "@/lib/config";
import { ConstituentView } from "@/app/components/Viewers/ConstituentView/ConstituentView";


interface Props {
  params: Promise<{ constituentid: string }>
}

export default async function Page({ params }: Props) {
  return params.
    then(({ constituentid }) => {
    { /*  HACK  I read that calling fetch on an internal API from a
       *        server component is an anti-pattern
       *        But it doesn't matter
       *        because I can't read
       */ }
    return Promise.all([
      fetch(`http://localhost:${ PORT }/${ API_PATH }/constituent/${constituentid}`),
      fetch(`http://localhost:${ PORT }/${ API_PATH }/constituent/${constituentid}/objects`)
      ])
    }).
    then(_ => Promise.all(_.map(i => i.json()))).
    then(([conPayload, conxobjPayload]) => {
      return (
        <ConstituentView
          conPayload={ conPayload }
          conxobjPayload={ conxobjPayload }
        />
      );
    });
};


