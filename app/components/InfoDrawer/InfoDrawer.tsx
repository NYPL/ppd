
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
        <p><a href="https://docs.google.com/forms/d/e/1FAIpQLSeovdY7AoC1rUxzZgaCVqe_tBMEWdZGeB1OQyjIQm2zrlHljQ/viewform" target="_blank">Link to feedback form</a></p>
      </DrawerBody>
    </Drawer>
  );
};

export default SettingsDrawer;

