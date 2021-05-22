import React from 'react';
// import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Nav, { NavItem } from '@thesis-ui/nav';

import './l10n';
import * as Styled from './App.styled';

import Home from './containers/Home';

function App() {
  const { t } = useTranslation();

  return (
    <BrowserRouter>
      <Styled.Container>
        <Styled.NavBar>
          <Nav>
            <NavItem>
              {t('REGISTER')}
            </NavItem>

            <NavItem>
              {t('LOGIN')}
            </NavItem>

            <NavItem isSelected>
              {t('HOME')}
            </NavItem>
          </Nav>
        </Styled.NavBar>

        <Styled.Content>
          <Switch>
            <Route key="register" exact path="/register">
              Register
            </Route>

            <Route key="login" exact path="/login">
              Login
            </Route>

            <Route key="home" path="/">
              <Home />
            </Route>
          </Switch>
        </Styled.Content>
      </Styled.Container>
    </BrowserRouter>
  );
}

export default App;
