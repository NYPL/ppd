
import { PORT, API_PATH } from "@/lib/config";
import { ObjectView } from "@/app/components/Viewers/ObjectView/ObjectView";


interface Props {
  params: Promise<ContainsObjectId>;
}

export default async function Page({ params }: Props) {
  return params.
    then(({ objectid }) => {
      /*  HACK  I read that calling fetch on an internal API from a
       *        server component is an anti-pattern
       *        But it doesn't matter
       *        because I can't read
       */
    { /*  TODO  should it (really) read from 'main'? */ }
      return fetch(`http://localhost:${ PORT }/${ API_PATH }/main/${objectid}`);
    }).
    then(resp => resp.json()).
    then(resp => {
      return (
        <ObjectView mainAPIPayload={ resp } />
      );
    });
};

