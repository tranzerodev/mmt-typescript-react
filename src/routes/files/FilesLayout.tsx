import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, makeStyles } from '@material-ui/core';
import { PageContent } from '../../components/UI';
import { FilesSidebar } from '../../components/Files';
import { FilesTableLayout } from '../../components/Files/FilesTableLayout';
import * as ReduxType from '../../store/reduxTypes';
import * as UserUtils from '../../utils/UserUtils';

const useStyles = makeStyles(() => ({
  root: {
    height: '102%',
    display: 'flex',
    overflow: 'hidden',
    position: 'relative',
    margin: '-20px 0 0 1px',
  },
}));

export const FilesLayout: React.FC = () => {
  const classes = useStyles();
  const { user } = useSelector((state: ReduxType.RootState) => state);
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(UserUtils.IsClient(user));
  }, [user]);

  return (
    <>
      <PageContent noSpace>
        <Box className={classes.root}>
          {!isClient && <FilesSidebar />}
          <Box
            display="flex"
            flex={1}
            justifyContent="center"
            // ml={!isClient && shiftPageWithSidebar ? `-${fileDrawerWidth}px` : 0}
          >
            <FilesTableLayout />
          </Box>
        </Box>
      </PageContent>
    </>
  );
};
