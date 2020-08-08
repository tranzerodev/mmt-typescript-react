import React, { Component } from 'react';
import { Typography, Box, styled } from '@material-ui/core';
import PropTypes from 'prop-types';
import grey from '@material-ui/core/colors/grey';
import MediaUploader from '../MediaUploader/MediaUploader';
import MediaPreviewer from '../MediaPreviewer/MediaPreviewer';
import { screenTypePropType } from '../../constants/creativeConsts';

const UploaderContainer = styled(Box)({
  display: 'block',
});

const UploaderContent = styled(Box)(({ screentype }) => ({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
  color: grey[500],
  maxHeight: '250px',
  height: `${
    screentype.resolutionHeight < 250 ? screentype.resolutionHeight : 250
  }px`,
}));

class CreativeUploader extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const {
      handleAdsUploaded,
      handleCreativeFileRemoved,
      creativeUrls,
      creativeFiles,
      screenType,
      previewOnly,
    } = this.props;
    return (
      <UploaderContainer>
        {previewOnly ? null : (
          <>
            <Typography variant="h4">{screenType.name}</Typography>
            <Typography variant="h5" gutterBottom>
              Resolution: {screenType.resolutionWidth} x{' '}
              {screenType.resolutionHeight}
            </Typography>
          </>
        )}
        <UploaderContent screentype={screenType}>
          {previewOnly ? null : (
            <MediaUploader
              handleAdsUploaded={handleAdsUploaded}
              screenType={screenType}
            />
          )}
          <MediaPreviewer
            handleCreativeFileRemoved={handleCreativeFileRemoved}
            creativeUrls={creativeUrls}
            screenType={screenType}
            creativeFiles={creativeFiles}
          />
        </UploaderContent>
      </UploaderContainer>
    );
  }
}

CreativeUploader.propTypes = {
  handleAdsUploaded: PropTypes.func.isRequired,
  handleCreativeFileRemoved: PropTypes.func.isRequired,
  creativeUrls: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  ),
  creativeFiles: PropTypes.arrayOf(PropTypes.object),
  screenType: screenTypePropType.isRequired,
  previewOnly: PropTypes.bool,
};

CreativeUploader.defaultProps = {
  creativeUrls: [],
  creativeFiles: [],
  previewOnly: false,
};

export default CreativeUploader;
