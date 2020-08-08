import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import PackagesCard from '../PackagesCard';
import {
  ExperiencesState,
  ExperiencesParmas,
} from '../../../store/experiences/types';
import { Package } from '../../../store/packages/types';

import { RootState } from '../../../store/reduxTypes';

interface Model {
  experiences: ExperiencesState;
}

const useStyles = makeStyles(theme =>
  createStyles({
    arrowDisabled: {
      visibility: 'hidden',
      pointerEvents: 'none',
    },
    arrowClass: {
      cursor: 'pointer',
    },
    horizontalContainer: {
      position: 'relative',
    },
    packagesSection: {
      paddingBottom: theme.spacing(6),
    },
    featureSectionTitle: {
      marginBottom: theme.spacing(3),
      marginLeft: theme.spacing(2) + 15,
    },
    feedContainer: {
      display: 'flex',
      overflowX: 'auto',
    },
    cardContainer: {
      flex: '0 1 0',
      paddingLeft: theme.spacing(2) + 15,
      paddingRight: theme.spacing(3),
    },
    container: {
      display: 'grid',

      /* define the number of grid columns */
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      margin: '-10px',
    },
  }),
);

const PackagesFeed = (props: ExperiencesParmas) => {
  const classes = useStyles();
  const stateModel = useSelector<RootState, Model>(state => ({
    experiences: state.experiences,
  }));
  const { title, filterOptions } = props;
  const { section } = filterOptions;

  const getFilteredExperiences = () => {
    const { items } = stateModel.experiences;
    return (
      items &&
      items.filter(experience =>
        section ? section === experience.section : true,
      )
    );
  };

  const packageCards = (packages: Package[]) =>
    packages.map(p => (
      <Box key={p.id} className={classes.cardContainer}>
        <PackagesCard {...p} />
      </Box>
    ));

  const horizontalFeed = (packages: Package[]) => (
    <Box className={classes.feedContainer}>{packageCards(packages)}</Box>
  );

  const feed = (packages: Package[]) => (
    <Box className={classes.container}>{packageCards(packages)}</Box>
  );

  const renderExperienceSection = () => {
    const filteredExperiences = getFilteredExperiences();

    if (!filteredExperiences.length) {
      return null;
    }

    return (
      <Box className={classes.packagesSection}>
        <Typography variant="h2" className={classes.featureSectionTitle}>
          {title}
        </Typography>
        <Box>
          {filterOptions.horizontal
            ? horizontalFeed(filteredExperiences)
            : feed(filteredExperiences)}
        </Box>
      </Box>
    );
  };

  return <>{renderExperienceSection()}</>;
};

export default PackagesFeed;
