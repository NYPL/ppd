'use client';

import { useState } from 'react';
import { CustomProvider } from 'rsuite';
import * as my from './components/Header/Header';
import SettingsDrawer from './components/SettingsDrawer/SettingsDrawer';
import InfoDrawer from './components/InfoDrawer/InfoDrawer';
import { Container, Header, Content, Footer } from 'rsuite';


export const SettingsProvider = ({ children }: ContainsChildren) => {

  const [settingsOpenP, setSettingsOpen]  = useState(false);
  const [infoOpenP,     setInfoOpen]      = useState(false);
  const [darkModeP,     setDarkMode]      = useState(false);

  return (
    <CustomProvider theme={ darkModeP ? 'dark' : 'light' }>
      <Container>
        <Header>
          <my.Header setSettingsOpen={ setSettingsOpen } setInfoOpen={ setInfoOpen } />
            <InfoDrawer
              infoOpenP={ infoOpenP }
              setInfoOpen={ setInfoOpen } />
            <SettingsDrawer
              settingsOpenP={ settingsOpenP }
              setSettingsOpen={ setSettingsOpen }
              setDarkMode={ setDarkMode } />
        </Header>
        <Content>
          { children }
        </Content>
        <Footer></Footer>
      </Container>
    </CustomProvider>
  );
}

export default SettingsProvider;
