import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import './l10n';
import * as Styled from './App.styled';

function App() {
  const { t } = useTranslation();

  return (
    <BrowserRouter>
      <Styled.Container>
        <Styled.NavBar>
          Navbar
        </Styled.NavBar>

        <Styled.Content>
          <Switch>
            <Route key="register" exact path="/register">
              Register
            </Route>

            <Route key="login" exact path="/login">
              Login
            </Route>

            <Route key="recover-password" exact path="/recover-password">
              Pecover Password
            </Route>

            <Route key="unauthorized" exact path="/unauthorized">
              Unauthorized
            </Route>

            <Route key="home" path="/">
              Home
            </Route>
          </Switch>
        </Styled.Content>
      </Styled.Container>
    </BrowserRouter>
  );
}

export default App;
