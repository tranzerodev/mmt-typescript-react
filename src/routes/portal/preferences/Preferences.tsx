import React from 'react';
import Grid from '@material-ui/core/Grid';
import { TextField, CardContent, Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import {
  PageContent,
  FullCard,
  PageTitle,
  DenseCardContent,
} from '../../../components/UI';
import config from '../../../portalConfig';

const useStyles = makeStyles(() => ({
  fullCard: {
    marginBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  contentSection: {
    height: 'fit-content',
  },
}));

const PreferencesPage = () => {
  const classes = useStyles();

  return (
    <PageContent>
      <PageTitle title="Preferences" />
      <div className={classes.contentSection}>
        <FullCard className={classes.fullCard} variant="outlined">
          <DenseCardContent>
            <Grid container>
              <Grid item xs={4}>
                <Box p={4} pl={0.375}>
                  <Typography variant="h4">
                    Title and Meta description
                  </Typography>
                  <Typography variant="subtitle2">
                    Title and description help you define how your portal shows
                    up on search engine
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={8}>
                <Box p={2}>
                  <FullCard>
                    <CardContent>
                      <TextField
                        inputProps={{
                          readOnly: true,
                        }}
                        value={config.Title}
                        autoFocus
                        fullWidth
                        type="text"
                        label="Portal Name"
                        helperText={`${
                          config.Title.length
                        } of 70 characters used.`}
                        key="portal-name"
                        name="name"
                        margin="normal"
                        variant="outlined"
                      />

                      <TextField
                        inputProps={{
                          readOnly: true,
                        }}
                        value={config.MetaDescription}
                        autoFocus
                        fullWidth
                        type="text"
                        multiline
                        rows={4}
                        placeholder="Enter a description to get better ranking on search engines like Google."
                        label="Meta description"
                        key="portal-meta-description"
                        name="meta-description"
                        margin="normal"
                        helperText={`${
                          config.MetaDescription.length
                        } of 350 characters used`}
                        variant="outlined"
                      />
                    </CardContent>
                  </FullCard>
                </Box>
              </Grid>
            </Grid>
          </DenseCardContent>
        </FullCard>

        <FullCard className={classes.fullCard} variant="outlined">
          <DenseCardContent>
            <Grid container>
              <Grid item xs={4}>
                <Box p={4} pl={0.375}>
                  <Typography variant="h4">Marketing Page URL</Typography>
                  <Typography variant="subtitle2">
                    The Marketing Page URL is the page that a user is redirected
                    to when they sign out or when they click <b>Back to Home</b>{' '}
                    on the log in screen.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={8}>
                <Box p={2}>
                  <FullCard>
                    <CardContent>
                      <TextField
                        inputProps={{
                          readOnly: true,
                        }}
                        value={config.SignoutRedirectURL}
                        autoFocus
                        fullWidth
                        type="text"
                        label="Redirection URL"
                        helperText={`${
                          config.SignoutRedirectURL.length
                        } of 70 characters used.`}
                        key="marketing-url"
                        name="marketing-url"
                        margin="normal"
                        variant="outlined"
                      />
                    </CardContent>
                  </FullCard>
                </Box>
              </Grid>
            </Grid>
          </DenseCardContent>
        </FullCard>
      </div>
    </PageContent>
  );
};

export default PreferencesPage;
