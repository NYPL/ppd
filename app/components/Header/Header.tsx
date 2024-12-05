// @ts-nocheck

import MyNavBar from '../NavBar/NavBar';
import styles from './Header.module.scss';


export const Header = ({ setSettingsOpen, setInfoOpen }) => {
  return (
    <header className={styles.header}>
      <MyNavBar setSettingsOpen={ setSettingsOpen } setInfoOpen={ setInfoOpen } />
    </header>
  );
};

export default Header;
