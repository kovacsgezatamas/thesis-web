import { Box, Flex } from 'rebass';
import { useTranslation } from 'react-i18next';

import './l10n';
import * as Styled from './App.styled';

function App() {
  const { t } = useTranslation();

  return (
    <Styled.Container>
      <Styled.NavBar>
        Navbar
      </Styled.NavBar>

      <Styled.Content>
        Container
      </Styled.Content>
    </Styled.Container>
  );
}

export default App;
