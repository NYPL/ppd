// @ts-nocheck

import MyNavBar from '../NavBar/NavBar';
import styles from './Header.module.scss';


export const Header = ({ setSettingsOpen }) => {
  return (
    <header className={styles.header}>
      <MyNavBar setSettingsOpen={ setSettingsOpen } />
    </header>
  );
};

export default Header;
