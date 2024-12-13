
import Drawer from 'rsuite/Drawer';
import DrawerHeader from 'rsuite/DrawerHeader';
import DrawerBody from 'rsuite/DrawerBody';
import DrawerTitle from 'rsuite/DrawerTitle';
import Button from 'rsuite/Button';
import { Dispatch, SetStateAction } from 'react';

interface Props {
  settingsOpenP:   boolean;
  setSettingsOpen: Dispatch<SetStateAction<boolean>>;
  setDarkMode:     Dispatch<SetStateAction<boolean>>;
}

export const SettingsDrawer = ({ settingsOpenP, setSettingsOpen, setDarkMode }: Props) => {

  return (
    <Drawer size={ 'xs' } open={ settingsOpenP }  onClose={ () => setSettingsOpen(false) }>
      <DrawerHeader>
        <DrawerTitle>Settings</DrawerTitle>
      </DrawerHeader>
      <DrawerBody>
        { /* ewww */ }
        <p>none, yet</p>
        <Button className="hidden" onClick={ () => setDarkMode((old: boolean) => !old) }>toggle mode</Button>
      </DrawerBody>
    </Drawer>
  );
};

export default SettingsDrawer;
