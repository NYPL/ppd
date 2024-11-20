'use client';

import Navbar from 'rsuite/Navbar';
import Nav from 'rsuite/Nav';
import NavItem from 'rsuite/NavItem';
import NavbarBrand from 'rsuite/NavbarBrand';
// import NavMenu from 'rsuite/NavMenu';
// import Link from 'next/Link';
import { FaGear } from "react-icons/fa6";

import style from './NavBar.module.scss';

// import Image from 'next/image';
// import nyplLogo from '@/public/assets/images/nypl-viridian-circle.png';


//  TODO  this
interface Props {
  setSettingsOpen: any;
}

// <NavItem as={Link} href="/">Home</NavItem>
// <NavMenu title="Tables">
//   <NavItem as={Link} href="/artists">Artist</NavItem>
//   <NavItem as={Link} href="/works">Work</NavItem>
// </NavMenu>

      // <NavbarBrand className={ style['navBrandIconHolder'] } href="/"><img className={ style['navBrandIcon'] } src="/assets/images/nypl-viridian-circle-small.webp" /></NavbarBrand>
      // <NavbarBrand className={ style['navBrandIconHolder'] } href="/"><img className={ style['navBrandIcon'] } src="/assets/images/nypl-viridian.png" /></NavbarBrand>
        // <img className={ style['navBrandIcon'] } src="/assets/images/nypl-viridian.png" />
        // <Image className={ style['navBrandIcon'] }
        //   src={ nyplLogo }
        //   alt="NYPL logo"
        //   width={60}
        //   height={60} />
export const MyNavBar = ({ setSettingsOpen }: Props) => {
  return (
    <Navbar>
      <NavbarBrand className={ style['navBrandIconHolder'] } href="/"><img className={ style['navBrandIcon'] } src="/assets/images/nypl-viridian-circle-small.webp" /></NavbarBrand>
      <NavbarBrand href="/"><div className={ style['brandName'] }>Prints and Photographs Discovery</div></NavbarBrand>
      <Nav>
      </Nav>
      <Nav pullRight>
        <NavItem onClick={ () => setSettingsOpen(true) } icon={ <FaGear /> }></NavItem>
      </Nav>
    </Navbar>
  );
};

export default MyNavBar;

