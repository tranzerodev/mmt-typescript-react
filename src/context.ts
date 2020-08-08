import React from 'react';
import { createMuiTheme } from '@material-ui/core/styles';
import portalConfig from './portalConfig';
import typography from './theme/typography';
import overrides from './theme/overrides';

export interface ContextProps {
  pathname: string;
  query: {
    step?: string;
    tab?: string;
  };
  isMobile: boolean;
}

const RouteContext = React.createContext({
  pathname: '/',
  query: {},
  isMobile: false,
});

const CustomTheme = createMuiTheme({
  palette: portalConfig.theme.palette,
  typography,
  overrides,
});

export { CustomTheme, RouteContext };
