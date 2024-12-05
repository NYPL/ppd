'use client';

import Drawer from 'rsuite/Drawer';
import DrawerHeader from 'rsuite/DrawerHeader';
import DrawerBody from 'rsuite/DrawerBody';
import DrawerTitle from 'rsuite/DrawerTitle';
import Button from 'rsuite/Button';

//  TODO  this
interface Props {
  settingsOpenP: boolean;
  setSettingsOpen: any;
  setDarkMode: any;
}

export const SettingsDrawer = ({ settingsOpenP, setSettingsOpen, setDarkMode }: Props) => {

  return (
    <Drawer size={ 'xs' } open={ settingsOpenP }  onClose={ () => setSettingsOpen(false) }>
      <DrawerHeader>
        <DrawerTitle>Settings</DrawerTitle>
      </DrawerHeader>
      <DrawerBody>
        { /* ewww */ }
        <p><b>Coming soon</b></p>
        <Button className="hidden" onClick={ () => setDarkMode((old: boolean) => !old) }>toggle mode</Button>
      </DrawerBody>
    </Drawer>
  );
};

export default SettingsDrawer;
