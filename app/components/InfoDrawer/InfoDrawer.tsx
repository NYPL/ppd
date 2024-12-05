
import Drawer from 'rsuite/Drawer';
import DrawerHeader from 'rsuite/DrawerHeader';
import DrawerBody from 'rsuite/DrawerBody';
import DrawerTitle from 'rsuite/DrawerTitle';
import { Dispatch, SetStateAction } from 'react';

import packageInfo from '@/package.json';

//  TODO  this
interface Props {
  infoOpenP: boolean;
  setInfoOpen: Dispatch<SetStateAction<boolean>>;
}

export const SettingsDrawer = ({ infoOpenP, setInfoOpen }: Props) => {

  return (
    <Drawer size={ 'xs' } open={ infoOpenP }  onClose={ () => setInfoOpen(false) }>
      <DrawerHeader>
        <DrawerTitle>Info</DrawerTitle>
      </DrawerHeader>
      <DrawerBody>
        { /* eww */ }
        <p><b>Version</b>: { packageInfo['version'] }</p>
        <br/>
        <p><b>Link to feedback form:</b></p>
        <p><a href="https://docs.google.com/spreadsheets/d/1nOciQakZAkqvUcTBPxS7VGYipqKZEGlqi3kQJwcL_U4/">Feedback form</a></p>
      </DrawerBody>
    </Drawer>
  );
};

export default SettingsDrawer;

