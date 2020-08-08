import React, { CSSProperties, useState } from 'react';
import {
  Button as MaterialBtn,
  ButtonProps,
  Box,
  CircularProgress,
  makeStyles,
  createStyles,
} from '@material-ui/core';

type Model = {
  htmlId: string;
  isLoading?: boolean;
  buttonWrapperClasses?: string;
  progressVariant?: 'determinate' | 'indeterminate' | 'static';
  progressColor?: 'primary' | 'secondary' | 'inherit';
  progressValue?: number;
  progressSize?: number;
  progressStyles?: CSSProperties;
  component?: string;
};

const useStyles = makeStyles(() =>
  createStyles({
    buttonWrapper: {
      position: 'relative',
    },
    buttonProgress: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
    },
  }),
);

const Button: React.FC<ButtonProps & Model> = props => {
  const [isAsyncClick, setIsAsyncClick] = useState<boolean>(false);

  const classes = useStyles();
  const {
    children,
    isLoading = false,
    buttonWrapperClasses,
    progressVariant = 'indeterminate',
    progressColor = 'primary',
    progressValue = 0,
    progressStyles,
    progressSize = 24,
    onClick,
    disabled,
    htmlId,
    component,
    ...rest
  } = props;

  // cases when we call async inside button click
  // e.g. onClick={async () => { await onClickHandler(); }}
  const onClickHandler = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    const click = onClick as any;
    if (!click || isAsyncClick) {
      return;
    }
    setIsAsyncClick(true);
    await click(event);
    setIsAsyncClick(false);
  };

  if (htmlId) {
    rest.id = htmlId;
  }

  return (
    <Box className={`${classes.buttonWrapper} ${buttonWrapperClasses}`}>
      <MaterialBtn
        {...rest}
        disabled={disabled || isLoading}
        onClick={e => onClickHandler(e)}
      >
        {children}
      </MaterialBtn>
      {isLoading && (
        <CircularProgress
          variant={progressVariant}
          color={progressColor}
          value={progressValue}
          style={{ ...progressStyles }}
          size={progressSize}
          className={classes.buttonProgress}
        />
      )}
    </Box>
  );
};

export default Button;
