import React from 'react';
import { makeStyles, Button } from '@material-ui/core';
import { createStyles } from '@material-ui/core/styles';
import { Plus } from 'react-feather';
import { HTMLInputEvent } from '../../constants/dataTypes';

const useStyles = makeStyles(() =>
  createStyles({
    input: {
      display: 'none',
    },
  }),
);

interface UploadButtonProps {
  handleChange: (e: HTMLInputEvent | any) => void;
  isUploading?: boolean;
  htmlId: string;
  label: string;
}

export const UploadButton: React.FC<UploadButtonProps> = props => {
  const classes = useStyles();
  const { handleChange, isUploading, htmlId, label } = props;

  return (
    <>
      <input
        className={classes.input}
        id="icon-button-file"
        type="file"
        multiple
        onChange={handleChange}
      />
      {/* eslint-disable jsx-a11y/label-has-associated-control */}
      <label htmlFor="icon-button-file">
        <Button
          id={htmlId}
          aria-label="upload picture"
          variant="contained"
          color="primary"
          component="span"
          disabled={isUploading}
          startIcon={<Plus />}
        >
          {label}
        </Button>
      </label>
    </>
  );
};
