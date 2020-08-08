import React, { ReactNode } from 'react';
import Button from '@material-ui/core/Button';
import CardHeader, { CardHeaderProps } from '@material-ui/core/CardHeader';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import blue from '@material-ui/core/colors/blue';
import {
  Box,
  styled,
  withStyles,
  WithStyles,
  makeStyles,
  createStyles,
  Typography,
} from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Link from '../Link';

export const CenterFlex = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export const LoadingContainer = styled(CenterFlex)({
  width: '100%',
  height: '100vh',
});

export const Flex = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const TableHeaderContainer = styled(Flex)({
  padding: '0 20px',
});

interface NewButtonProps {
  children?: React.ReactNode;
  className?: string;
  htmlId: string;
  onClick?: () => void;
}

export const NewButton = ({ children, htmlId, ...other }: NewButtonProps) => (
  <Button variant="contained" color="primary" id={htmlId} {...other}>
    {children}
  </Button>
);

interface NewLinkButtonProps {
  htmlId: string;
  children?: React.ReactNode;
  path: string;
}

export const NewLinkButton = ({
  path,
  htmlId,
  children,
}: NewLinkButtonProps) => (
  <Link to={path}>
    <NewButton htmlId={htmlId}>{children}</NewButton>
  </Link>
);

const cardActionHeaderStyles = {
  button: {
    color: blue[600],
    border: '1px solid rgba(25, 118, 210, 0.5)',
  },
  action: {
    margin: 0,
  },
};

interface CardActionHeaderProps
  extends WithStyles<typeof cardActionHeaderStyles> {
  cardHeaderProps: CardHeaderProps;
  children?: React.ReactNode;
}

export const CardActionHeader = withStyles(cardActionHeaderStyles)(
  ({ classes, cardHeaderProps, children }: CardActionHeaderProps) => (
    <CardHeader
      {...cardHeaderProps}
      action={children}
      classes={{ action: classes.action }}
    />
  ),
);

interface TitleProps {
  title: string;
}
export const PageTitle = ({ title }: TitleProps) => (
  <Box p={3} pl={0.375}>
    <Typography variant="h3">{title}</Typography>
  </Box>
);

export const TableTitle = ({ title }: TitleProps) => (
  <Box p={3}>
    <Typography variant="h4">{title}</Typography>
  </Box>
);

export const FullCard = styled(Card)({
  display: 'flex',
  flexDirection: 'column',
  flex: '1',
});

export const DenseCardContent = styled(CardContent)({
  padding: 0,
  flex: '1',
  '&:last-child': {
    paddingBottom: 0,
  },
});

// export const PageContent = styled(Box)(({ noSpace = false, theme }) => ({

// }));

const useStyles = makeStyles(theme =>
  createStyles({
    root: (props: PageContentProps) => ({
      display: 'flex',
      flexDirection: 'column',
      height: `calc(100vh - ${props.noSpace ? '84px' : '108px'})`,
      padding: props.noSpace ? 0 : theme.spacing(3),
      paddingTop: '84px',
      [theme.breakpoints.up('lg')]: {
        paddingLeft: props.noSpace ? '240px' : '260px',
      },
      [theme.breakpoints.down('md')]: {
        paddingLeft: props.noSpace ? 0 : theme.spacing(3),
      },
    }),
  }),
);

interface PageContentProps {
  noSpace?: boolean;
}

export const PageContent: React.FC<PageContentProps> = ({
  children,
  ...styleProps
}) => {
  const classes = useStyles(styleProps);
  return !styleProps.noSpace ? (
    <Box width={1} m="0 auto" maxWidth={1500} className={classes.root}>
      {children}
    </Box>
  ) : (
    <Box className={classes.root} width={1}>
      {children}
    </Box>
  );
};
