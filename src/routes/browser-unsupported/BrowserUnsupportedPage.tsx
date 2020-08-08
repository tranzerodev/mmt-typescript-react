import React from 'react';
import { Button, Typography, Box, styled } from '@material-ui/core';

import { ErrorOutlineOutlined } from '@material-ui/icons';

const Container = styled(Box)({
  borderRadius: '8px',
  backgroundColor: 'whitesmoke',
  textAlign: 'center',
  padding: '15em 30em 15em 30em',
});

const ContainerInner = styled(Box)({
  borderRadius: '4px',
  backgroundColor: 'white',
  padding: '2em 12em 2em 12em',
});

const StyledErrorIcon = styled(ErrorOutlineOutlined)({
  fontSize: '90px',
});

const browserAlternatives = ['Google Chrome', 'Mozilla Firefox'];
const Text = styled(Typography)({ lineHeight: '1.5em', marginTop: '2em' });
const BrowserUnsupportedPage = () => (
  <Container>
    <ContainerInner>
      <StyledErrorIcon color="primary" />
      <Typography variant="h1" component="h1">
        Improve your experience
      </Typography>
      <Text variant="h3">
        You&apos;re using a web browser we don&apos;t use. Try one of these
        options to have a better experience on Lightout.
      </Text>

      <Box m={4} p={2}>
        {browserAlternatives.map(browserName => (
          <Button
            style={{ marginLeft: '1em' }}
            key={browserName}
            variant="outlined"
            color="primary"
          >
            {browserName}
          </Button>
        ))}
      </Box>
    </ContainerInner>
  </Container>
);

export default BrowserUnsupportedPage;
