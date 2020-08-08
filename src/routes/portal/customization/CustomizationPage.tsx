import React from 'react';
import Grid from '@material-ui/core/Grid';
import {
  CardContent,
  Box,
  Typography,
  CardMedia,
  Theme,
  TextField,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import {
  PageContent,
  FullCard,
  PageTitle,
  DenseCardContent,
} from '../../../components/UI';
import config from '../../../portalConfig';
import ColorPicker from '../../../components/ColorPicker/ColorPicker';

const useStyles = makeStyles((theme: Theme) => ({
  imagePreviwer: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    marginTop: '-30px',
  },
  imagePreviewerWrapper: {
    height: '100%',
    width: '100%',
    border: `1px dashed ${theme.palette.grey[300]}`,
    textAlign: 'left',
  },
  colorSelector: {
    paddingBottom: theme.spacing(1),
  },
  logo: {
    backgroundColor:
      config.assets.logoStyle.filter !== ''
        ? config.theme.palette.primary.main
        : '',
  },
  previewCard: {
    height: '300px',
    paddingBottom: theme.spacing(4),
  },
  edit: {
    position: 'relative',
    color: theme.palette.grey[600],
    cursor: 'pointer',
    zIndex: 2,
  },
  fullCard: {
    overflow: 'initial',
    marginBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
}));

const CustomizaitonPage = () => {
  const classes = useStyles();
  const [portalColor, setPortalColor] = React.useState<string>(
    config.theme.palette.primary.main,
  );

  return (
    <PageContent>
      <PageTitle title="Customization" />

      <FullCard className={classes.fullCard} variant="outlined">
        <DenseCardContent>
          <Grid container>
            <Grid item xs={4}>
              <Box p={4} pl={0.375}>
                <Typography variant="h4">Portal Name</Typography>
                <Typography variant="subtitle2">
                  The Portal Name is used in various places in the product and
                  email communication.
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
                      } of 30 characters used.`}
                      key="portal-name"
                      name="name"
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

      <FullCard className={classes.fullCard} variant="outlined">
        <DenseCardContent>
          <Grid container>
            <Grid item xs={4}>
              <Box p={4} pl={0.375} pr={0.375}>
                <Typography variant="h4">Portal Logo</Typography>
                <Typography variant="subtitle2">
                  The Portal Logo is used on the navigation bar and several
                  other places in the Portal to give your clients a customized
                  experience.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={8}>
              <Box p={2}>
                <FullCard>
                  <CardContent className={classes.previewCard}>
                    <Box
                      className={`${classes.imagePreviewerWrapper} ${
                        classes.logo
                      }`}
                    >
                      <Button
                        variant="text"
                        className={classes.edit}
                        size="small"
                        aria-label="edit"
                      >
                        Edit
                      </Button>
                      <CardMedia
                        className={classes.imagePreviwer}
                        component="img"
                        image={config.assets.logoMark.svgUrl}
                      />
                    </Box>
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
                <Typography variant="h4">Portal Icon</Typography>
                <Typography variant="subtitle2">
                  The Portal Icon is made to fit in squares. It used in places
                  where your full-sized logo does not fit, including for your
                  favicon.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={8}>
              <Box p={2}>
                <FullCard>
                  <CardContent className={classes.previewCard}>
                    <Box className={classes.imagePreviewerWrapper}>
                      <Button
                        variant="text"
                        className={classes.edit}
                        size="small"
                        aria-label="edit"
                      >
                        Edit
                      </Button>
                      <CardMedia
                        className={classes.imagePreviwer}
                        component="img"
                        image={config.assets.icon.imageUrl}
                      />
                    </Box>
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
                <Typography variant="h4">Primary Color</Typography>
                <Typography variant="subtitle2">
                  The Primary Color sets the color scheme of your portal. We
                  automatically use variants of your primary colors for forms,
                  tables, and buttons to ensure consistency.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={8}>
              <Box p={2}>
                <FullCard>
                  <CardContent>
                    <Typography variant="body1">
                      Choose your portal main color
                    </Typography>
                    <Typography variant="body2">
                      We recommend you use a dark color for the primary color.
                    </Typography>
                    <br />
                    <ColorPicker
                      onUpdate={(colorHex: string) => setPortalColor(colorHex)}
                      colorHex={portalColor}
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
                <Typography variant="h4">Authentication Picture</Typography>
                <Typography variant="subtitle2">
                  The Authentication Picture is used on the Log In and Sign Up
                  pages.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={8}>
              <Box p={2}>
                <FullCard>
                  <CardContent className={classes.previewCard}>
                    <Box className={classes.imagePreviewerWrapper}>
                      <Button
                        variant="text"
                        className={classes.edit}
                        size="small"
                        aria-label="edit"
                      >
                        Edit
                      </Button>
                      <CardMedia
                        className={classes.imagePreviwer}
                        component="img"
                        image={config.assets.authImage.signInUrl}
                      />
                    </Box>
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
                <Typography variant="h4">Social sharing image</Typography>
                <Typography variant="subtitle2">
                  When you share a link to your portal on social medial, an
                  image is usually shown in your post. This one will be used if
                  another relevant image cannot be found.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={8}>
              <Box p={2}>
                <FullCard>
                  <CardContent className={classes.previewCard}>
                    <Box className={classes.imagePreviewerWrapper}>
                      <Button
                        variant="text"
                        className={classes.edit}
                        size="small"
                        aria-label="edit"
                      >
                        Edit
                      </Button>
                      <CardMedia
                        className={classes.imagePreviwer}
                        component="img"
                        image={config.assets.socialShareImage.imageUrl}
                      />
                    </Box>
                  </CardContent>
                </FullCard>
              </Box>
            </Grid>
          </Grid>
        </DenseCardContent>
      </FullCard>
    </PageContent>
  );
};

export default CustomizaitonPage;
