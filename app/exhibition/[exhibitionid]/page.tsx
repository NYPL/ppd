
import { PORT, API_PATH } from "@/lib/config";
import { ExhibitionView } from "@/app/components/Viewers/ExhibitionView/ExhibitionView";


interface Props {
  params: Promise<{ exhibitionid: string }>
}

export default async function Page({ params }: Props) {
  return params.
    then(({ exhibitionid }) => {
    { /*  HACK  I read that calling fetch on an internal API from a
       *        server component is an anti-pattern
       *        But it doesn't matter
       *        because I can't read
       */ }
    return Promise.all([
      fetch(`http://localhost:${ PORT }/${ API_PATH }/exhibition/${exhibitionid}`),
      fetch(`http://localhost:${ PORT }/${ API_PATH }/exhibition/${exhibitionid}/objects`)
      ])
    }).
    then(_ => Promise.all(_.map(i => i.json()))).
    then(([exhPayload, exhxobjPayload]) => {
      return (
        <ExhibitionView
          exhPayload={ exhPayload }
          exhxobjPayload={ exhxobjPayload }
        />
      );
    });
};



