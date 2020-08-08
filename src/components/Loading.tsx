import React from 'react';
import PropTypes, { string } from 'prop-types';
import { MoonLoader } from 'react-spinners';
import { Skeleton } from '@material-ui/lab';

export const Spinner = (props: any) => (
  <MoonLoader sizeUnit="px" color="#000" {...props} />
);

type LoadingPropTypes = {
  message: string;
  cover: boolean;
};

export const SpinnerContainer = ({
  message,
  cover,
  ...spinnerProps
}: LoadingPropTypes) => (
  <LoadingContainer message={message} cover={cover}>
    <Spinner {...spinnerProps} />
  </LoadingContainer>
);

SpinnerContainer.propTypes = {
  message: PropTypes.string,
  cover: PropTypes.bool,
};
SpinnerContainer.defaultProps = { message: null, cover: false };

const loadingContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
};

const coverLoadingContainerStyle: React.CSSProperties = {
  ...loadingContainerStyle,
  background: 'rgba(0, 0, 0, 0.4)',
  height: '100%',
  left: 0,
  padding: 0,
  position: 'absolute',
  top: 0,
  width: '100%',
};

const LoadingContainer: React.FC<LoadingPropTypes> = ({
  children,
  message = null,
  cover = false,
}) => (
  <div style={cover ? coverLoadingContainerStyle : loadingContainerStyle}>
    {message && <div style={{ paddingBottom: '10px' }}>{message}</div>}
    {children}
  </div>
);

export default Spinner;

const RadioOptionContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '6px',
  width: '140px',
};

type RadioGroupLoadingPropTypes = {
  numRows: number;
};

export const RadioGroupLoading: React.FC<RadioGroupLoadingPropTypes> = ({
  numRows = 3,
}) => (
  <div>
    {[...Array(numRows).keys()].map(k => (
      <div key={k} style={RadioOptionContainerStyle}>
        <Skeleton variant="circle" width={28} height={28} />
        <Skeleton variant="text" width={100} height={28} />
      </div>
    ))}
  </div>
);
