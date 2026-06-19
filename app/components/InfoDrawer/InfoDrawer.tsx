
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
        <br/>
        <p>Resources for updating PPD:</p>
        <ul>
          <li> <a target="_blank" href="https://docs.google.com/document/d/10eMvUxxdROmFmeqN4i2Qyg0fNijoGnOwxmb5vFB89AQ/edit?tab=t.dolb72vuyo5c"> Link to updating protocol </a> </li>
          <li> <a target="_blank" href="https://docs.google.com/spreadsheets/d/1qHL3zEDihrK9_-vlzBH9jXVokQ7b1wTCKyYGS0eNBmM/edit?gid=1237149006#gid=1237149006"> Link to PHG's ongoing log </a> </li>
          <li> <a target="_blank" href="https://docs.google.com/spreadsheets/d/1WNBStf1R9ITiw8wKkNoX_kbKB5iSFHyvZ491J2h4pG8/edit?gid=1237149006#gid=1237149006"> Link to PRN's ongoing log </a> </li>
          <li> <a target="_blank" href="https://docs.google.com/spreadsheets/d/1BEFP4ZFHNf1q70_sjdPmdLOjMXlavu27XIuD7V5jvTk/edit?gid=1327175105#gid=1327175105"> Link to constituent directory </a> </li>
        </ul>
      </DrawerBody>
    </Drawer>
  );
};

export default SettingsDrawer;

