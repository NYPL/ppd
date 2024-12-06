
import MyNavBar from '../NavBar/NavBar';
import styles from './Header.module.scss';
import { Dispatch, SetStateAction } from 'react';

interface Props {
  setSettingsOpen: Dispatch<SetStateAction<boolean>>;
  setInfoOpen: Dispatch<SetStateAction<boolean>>;
}

export const Header = ({ setSettingsOpen, setInfoOpen }: Props) => {
  return (
    <header className={styles['header']}>
      <MyNavBar setSettingsOpen={ setSettingsOpen } setInfoOpen={ setInfoOpen } />
    </header>
  );
};

export default Header;
