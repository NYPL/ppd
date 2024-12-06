'use client';

import Navbar from 'rsuite/Navbar';
import Nav from 'rsuite/Nav';
import NavItem from 'rsuite/NavItem';
import NavbarBrand from 'rsuite/NavbarBrand';
import { FaGear, FaCircleInfo } from "react-icons/fa6";
import { Dispatch, SetStateAction } from 'react';

import style from './NavBar.module.scss';


interface Props {
  setSettingsOpen: Dispatch<SetStateAction<boolean>>;
  setInfoOpen:     Dispatch<SetStateAction<boolean>>;
}

export const MyNavBar = ({ setSettingsOpen, setInfoOpen }: Props) => {
  return (
    <Navbar>
      <NavbarBrand className={ style['navBrandIconHolder'] } href="/"><img className={ style['navBrandIcon'] } src="/assets/images/nypl-viridian-circle-small.webp" /></NavbarBrand>
      <NavbarBrand href="/"><div className={ style['brandName'] }>Prints and Photographs Discovery</div></NavbarBrand>
      <Nav>
      </Nav>
      <Nav pullRight>
        <NavItem onClick={ () => setInfoOpen(true) } icon={ <FaCircleInfo /> }></NavItem>
        <NavItem onClick={ () => setSettingsOpen(true) } icon={ <FaGear /> }></NavItem>
      </Nav>
    </Navbar>
  );
};

export default MyNavBar;

