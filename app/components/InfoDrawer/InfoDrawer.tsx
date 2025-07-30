
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
        <ul>
          <li><a href="https://docs.google.com/document/d/1Zj0p_SgewOElSbInat-wWMo_2wQEPclPfrWkB6RaeHo/edit?tab=t.0#heading=h.gi6j0c5opdd5" target="_blank">Link to staff user guide</a></li>
          <li><a href="https://drive.google.com/file/d/1jet6ClL9aa92XC7RXsqJ6sEFBJC5sEnU/view" target="_blank">Link to user guide cheatsheet</a></li>
          <li><a href="https://docs.google.com/forms/d/e/1FAIpQLSeovdY7AoC1rUxzZgaCVqe_tBMEWdZGeB1OQyjIQm2zrlHljQ/viewform" target="_blank">Link to feedback form</a></li>
        </ul>
      </DrawerBody>
    </Drawer>
  );
};

export default SettingsDrawer;

