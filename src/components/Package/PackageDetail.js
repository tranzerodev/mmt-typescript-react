import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Skeleton } from '@material-ui/lab';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      marginBottom: '20px',
    },
  }),
);

const PackageDetail = ({ id, label, value }) => {
  const classes = useStyles();
  const renderDetails = () => {
    if (!value) {
      return null;
    }

    if (typeof value === 'string') {
      return value.split('\n').map((str, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <Typography variant="h5" key={`about_line_${i}`}>
          {str}
        </Typography>
      ));
    }
    return value;
  };

  const renderSkeleton = packageLabel => {
    if (packageLabel && packageLabel === 'Map') {
      return <Skeleton variant="rect" height={200} />;
    }

    return <Skeleton variant="rect" height={40} />;
  };

  return (
    <Grid key={id} container classes={{ root: classes.root }}>
      <Grid xs={2} item>
        <Typography variant="h4">{label}</Typography>
      </Grid>
      <Grid xs={10} item>
        {renderDetails() || renderSkeleton(label)}
      </Grid>
    </Grid>
  );
};

PackageDetail.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.node,
  ]),
};

PackageDetail.defaultProps = { value: '' };

export default PackageDetail;
