import React, { useEffect, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { makeStyles, createStyles, Box } from '@material-ui/core';
import { ExperiencesParmas } from '../../store/experiences/types';
import { getExperiences } from '../../store/experiences/actions';
import { RootState } from '../../store/reduxTypes';

import { PageContent } from '../../components/UI';
import EXPERIENCES_SECTION from '../../constants/experienceConsts';
import Spinner from '../../components/Loading';
import PackagesFeed from '../../components/Experiences/PackagesFeed';

interface Model {
  loadingFeed: boolean;
  userId: string;
}

const useStyles = makeStyles(() =>
  createStyles({
    spinnerContainer: {
      display: 'flex',
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    feedsContainer: {
      width: '100%',
    },
  }),
);

const PackageFeedsPage = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [experiencesParmas] = useState<ExperiencesParmas[]>([
    {
      id: 0,
      title: 'For You',
      filterOptions: { horizontal: true, section: EXPERIENCES_SECTION.FOR_YOU },
    },
    {
      id: 1,
      title: 'Hyperlocal',
      filterOptions: {
        horizontal: true,
        section: EXPERIENCES_SECTION.HYPERLOCAL,
      },
    },
    {
      id: 2,
      title: 'by DMA',
      filterOptions: { horizontal: true, section: EXPERIENCES_SECTION.DMA },
    },
    {
      id: 3,
      title: 'by Audience',
      filterOptions: {
        horizontal: true,
        section: EXPERIENCES_SECTION.AUDIENCE,
      },
    },
    {
      id: 4,
      title: 'by Format',
      filterOptions: { horizontal: true, section: EXPERIENCES_SECTION.FORMAT },
    },
    {
      id: 5,
      title: 'Iconic',
      filterOptions: { horizontal: true, section: EXPERIENCES_SECTION.ICONIC },
    },
    {
      id: 6,
      title: 'Holidays',
      filterOptions: {
        horizontal: true,
        section: EXPERIENCES_SECTION.HOLIDAYS,
      },
    },
    {
      id: 7,
      title: 'Conferences',
      filterOptions: {
        horizontal: true,
        section: EXPERIENCES_SECTION.CONFERENCES,
      },
    },
    {
      id: 8,
      title: 'Shows',
      filterOptions: { horizontal: true, section: EXPERIENCES_SECTION.SHOWS },
    },
  ]);

  const stateModel = useSelector<RootState, Model>(state => ({
    userId: state.user.id,
    loadingFeed: state.experiences.loadingFeed,
  }));

  useEffect(() => {
    dispatch(getExperiences(stateModel.userId));
  }, [stateModel.userId]);

  return (
    <PageContent noSpace>
      {stateModel.loadingFeed ? (
        <Box className={classes.spinnerContainer}>
          <Spinner />
        </Box>
      ) : (
        <Box className={classes.feedsContainer}>
          {experiencesParmas.map(section => (
            <Box key={section.id}>
              <PackagesFeed {...section} />
            </Box>
          ))}
        </Box>
      )}
    </PageContent>
  );
};

export default PackageFeedsPage;
