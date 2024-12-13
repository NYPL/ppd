
import Drawer from 'rsuite/Drawer';
import DrawerHeader from 'rsuite/DrawerHeader';
import DrawerBody from 'rsuite/DrawerBody';
import DrawerTitle from 'rsuite/DrawerTitle';
import { Dispatch, SetStateAction } from 'react';

import packageInfo from '@/package.json';

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
        <p>Version: { packageInfo['version'] }</p>
        <br/>
        <p><a href="https://docs.google.com/spreadsheets/d/1nOciQakZAkqvUcTBPxS7VGYipqKZEGlqi3kQJwcL_U4/" target="_blank">Link to feeback form</a></p>
      </DrawerBody>
    </Drawer>
  );
};

export default SettingsDrawer;

