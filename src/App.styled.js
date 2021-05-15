import styled from 'styled-components';
import { Box, Flex } from 'rebass';

const Container = styled(Flex).attrs(() => ({
  'data-test-id': 'APP_CONTAINER',
}))`
  height: 100%;
  min-height: 100%;
  overflow: hidden;
`;

const NavBar = styled(Box).attrs(() => ({
  'data-test-id': 'APP_NAV_BAR',
}))`
  width: 150px;
`;

const Content = styled(Flex).attrs(() => ({
  'data-test-id': 'APP_CONTENT',
}))`
  flex: 1 1 100px;
`;

export { Container, NavBar, Content }
