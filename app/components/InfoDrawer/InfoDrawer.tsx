
import Drawer from 'rsuite/Drawer';
import DrawerHeader from 'rsuite/DrawerHeader';
import DrawerBody from 'rsuite/DrawerBody';
import DrawerTitle from 'rsuite/DrawerTitle';
import { Dispatch, SetStateAction } from 'react';

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
        pp
      </DrawerBody>
    </Drawer>
  );
};

export default SettingsDrawer;

