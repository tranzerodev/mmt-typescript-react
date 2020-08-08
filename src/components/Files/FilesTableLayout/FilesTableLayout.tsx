import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, Typography, Grid, Box } from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';
import SearchInput from '../../SearchInput/SearchInput';
import { FilesTable } from '.';
import { FullCard, DenseCardContent } from '../../UI';
import {
  saveUploadedFiles,
  getFiles,
  saveUserFiles,
} from '../../../store/files/actions';
import { FilesState, FileResponse } from '../../../store/files/types';
import { RootState } from '../../../store/reduxTypes';
import { HTMLInputEvent } from '../../../constants/dataTypes';
import {
  getClientIdFromOwnerId,
  getCompanyIdFromOwnerId,
  getFileNameFromFileKey,
} from '../helpers';
import * as UserUtils from '../../../utils/UserUtils';
/* eslint-disable @typescript-eslint/ban-ts-ignore */
// @ts-ignore
import { S3Utils } from '../../../utils';
/* eslint-disable @typescript-eslint/ban-ts-ignore */
// @ts-ignore
import { UploadButton } from '../../Buttons';
import portalConfig from '../../../portalConfig';
import { BUSINESS_MODE } from '../../../constants';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: '1500px',
      flexGrow: 1,
      overflow: 'hidden',
      padding: '25px 20px',
    },
    filesLabel: {
      marginBottom: theme.spacing(2),
    },
    toolbarContainer: {
      marginBottom: theme.spacing(3),
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    button: {
      minWidth: '263px',
    },
    input: {
      display: 'none',
    },
    uploader: {
      paddingTop: theme.spacing(2),
    },
    fullCard: {
      height: '88%',
    },
    denseContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  }),
);

export const FilesTableLayout = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [searchKey, setSearchKey] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isClient, setIsClient] = useState<boolean>(false);

  const filesState: FilesState = useSelector((state: RootState) => ({
    items: state.files.items,
    userItems: state.files.userItems,
    selectedClient: state.files.selectedClient,
    loading: state.files.loading,
    loaded: state.files.loaded,
  }));

  const { user } = useSelector((state: RootState) => state);

  const searchKeyChange = (value: string) => {
    setSearchKey(value);
  };

  const onchange = async (e: HTMLInputEvent | any) => {
    if (e.target && e.target.files) {
      const files = [...e.target.files];
      const isoDate = new Date().toISOString();
      const path = `files/${isoDate}`;

      setIsUploading(true);
      const filesPaths = await Promise.all(
        files.map(async (file: any) => {
          const filePath = `${path}/${file.name}`;
          return S3Utils.uploadFile(filePath, file, { level: 'protected' });
        }),
      );
      setIsUploading(false);
      const selectedClientId =
        filesState.selectedClient && filesState.selectedClient.clientId
          ? filesState.selectedClient.clientId
          : '';
      dispatch(saveUploadedFiles(filesPaths, selectedClientId));
    }
  };

  const mapAndGetFiles = (files: FileResponse[]) => {
    Promise.all(
      files.map(async file => {
        const { identityId, fields } = file;
        const fileName = getFileNameFromFileKey(fields.fileKey);

        return {
          ...file,
          fields: {
            ...fields,
            fileName,
            fileUrl: await S3Utils.getFile(fields.fileKey, {
              identityId,
            }),
          },
        };
      }),
    ).then((data: FileResponse[]) => {
      dispatch(saveUserFiles(data));
    });
  };

  useEffect(() => {
    dispatch(getFiles());
  }, []);

  useEffect(() => {
    setIsClient(UserUtils.IsClient(user));
  }, [user]);

  useEffect(() => {
    // Collecting client files
    if (isClient && filesState.loaded) {
      mapAndGetFiles(filesState.items);
    }

    // Collecting internal files
    if (!isClient && filesState.loaded && filesState.items.length > 0) {
      const filesStaged = filesState.items.filter(file => {
        if (portalConfig.businessMode === BUSINESS_MODE.B2B) {
          if (filesState.selectedClient.clientType === 'owner') {
            return (
              getClientIdFromOwnerId(file.ownerId) ===
                filesState.selectedClient.clientId &&
              getCompanyIdFromOwnerId(file.ownerId) ===
                filesState.selectedClient.clientId
            );
          }

          return (
            getCompanyIdFromOwnerId(file.ownerId) ===
            filesState.selectedClient.clientId
          );
        }

        return (
          getClientIdFromOwnerId(file.ownerId) ===
          filesState.selectedClient.clientId
        );
      });

      mapAndGetFiles(filesStaged);
    }
  }, [
    filesState.items,
    filesState.loaded,
    isClient,
    filesState.selectedClient.clientId,
  ]);

  return (
    <Box className={classes.root}>
      <Typography className={classes.filesLabel} variant="h2">
        Files
      </Typography>
      <Grid container className={classes.toolbarContainer}>
        <Grid item>
          <SearchInput handleChange={searchKeyChange} />
        </Grid>
        <Grid item>
          <Box className={classes.uploader}>
            <UploadButton
              handleChange={onchange}
              isUploading={isUploading}
              label="Upload Files"
              htmlId="upload-btn"
            />
          </Box>
        </Grid>
      </Grid>
      <FullCard variant="outlined" className={classes.fullCard}>
        <DenseCardContent className={classes.denseContent}>
          <FilesTable
            files={filesState.userItems}
            filesLoaded={filesState.loaded}
            isLoading={filesState.loading}
            searchKey={searchKey}
          />
        </DenseCardContent>
      </FullCard>
    </Box>
  );
};
