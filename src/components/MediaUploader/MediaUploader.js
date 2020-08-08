/* eslint-disable react/forbid-prop-types */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import AddIcon from '@material-ui/icons/Add';
import { styled, Box } from '@material-ui/core';
import grey from '@material-ui/core/colors/grey';
import getBlobDuration from 'get-blob-duration';
import { connect } from 'react-redux';
import { screenTypePropType } from '../../constants/creativeConsts';
import EndpointTypeUtils from '../../utils/endpointTypeUtils';
import { userPropType } from '../../store/user/reducers';
import { openAuthModal } from '../../store/ui/actions';

const UploadContentContainer = styled(Box)({
  border: `1px dashed ${grey[500]}`,
  width: '100%',
  height: '100%',
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  color: `1px dashed ${grey[500]}`,
  zIndex: 2,
  '&:hover': {
    cursor: 'pointer',
  },
});

const DropZoneComponent = styled(Dropzone)(({ theme, screentype }) => ({
  borderRadius: '3px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  width: `${EndpointTypeUtils.getContainerWidth(screentype)}`,
  '&:hover': {
    cursor: 'pointer',
  },
  '&:first-child': {
    marginRight: theme.spacing(2),
  },
}));

const HLine = styled(Box)(({ width, top, index, count }) => ({
  position: 'absolute',
  display: 'block',
  height: `${width}px`,
  width: '100%',
  top: `calc(${top}% - ${(width * (count - index - 1)) / count}px)`,
  background: '#eee',
}));

const VLine = styled(Box)(({ width, left, index, count }) => ({
  position: 'absolute',
  display: 'block',
  height: '100%',
  width: `${width}px`,
  background: '#eee',
  left: `calc(${left}% - ${(width * (count - index - 1)) / count}px)`,
}));

class MediaUploader extends Component {
  constructor() {
    super();
    this.state = {
      error: '',
    };
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length) {
      const error =
        rejectedFiles.length > 1 ? 'Only upload one file' : 'Invalid file type';
      this.setState({ error });
    } else if (!acceptedFiles.length) {
      return;
    }
    this.setState({ error: '' }, () => this.handleFilesAccepted(acceptedFiles));
  };

  promptContact = e => {
    const { user, openSignupModal } = this.props;
    if (user && user.isUnAuth) {
      e.preventDefault();
      openSignupModal();
    }
  };

  async handleFilesAccepted(acceptedFiles) {
    const { screenType, handleAdsUploaded } = this.props;
    const validVideos = [];
    await Promise.all(
      acceptedFiles
        .filter(acceptedFile => acceptedFile.type.startsWith('video'))
        .map(async video => {
          const videoLength = Math.round(await getBlobDuration(video.preview));
          if (
            screenType.spotLength.findIndex(
              validLength => Number(validLength) === videoLength,
            ) > -1
          )
            validVideos.push(video);
        }),
    );

    // validated accepted files
    const accpetedFilesWithFormant = acceptedFiles
      .filter(acceptedFile => !acceptedFile.type.startsWith('video'))
      .concat(validVideos)
      .map(item => ({
        file: item,
        format: `${screenType.Name}/${screenType.id}`,
      }));

    handleAdsUploaded(accpetedFilesWithFormant);
  }

  render() {
    const { error } = this.state;
    const { screenType, user } = this.props;
    const screenCountV = screenType.screenCountVertical;
    const screenCountH = screenType.screenCountHorizontal;
    const gapWidthHBar =
      screenType.resolutionHeight > 250
        ? (250 * screenType.pixelGapVertical) / screenType.resolutionHeight
        : screenType.pixelGapVertical;
    const gapWidthVBar =
      screenType.resolutionHeight > 250
        ? (250 * screenType.pixelGapHorizontal) / screenType.resolutionHeight
        : screenType.pixelGapHorizontal;
    return (
      <>
        {error && <div>{error}</div>}
        {!user.isUnAuth ? (
          <DropZoneComponent
            accept={`image/jpeg, image/png${
              screenType['Video Supported'] ? ', video/mp4' : ''
            }`}
            onDrop={this.onDrop}
            multiple
            screentype={screenType}
          >
            {screenCountV > 1 &&
              [...Array(screenCountV - 1).keys()].map(item => (
                <HLine
                  component="span"
                  top={(100 / screenCountV) * (item + 1)}
                  key={item}
                  index={item}
                  count={screenCountV}
                  width={gapWidthHBar}
                />
              ))}
            {screenCountH > 1 &&
              [...Array(screenCountH - 1).keys()].map(item => (
                <VLine
                  component="span"
                  left={(100 / screenCountH) * (item + 1)}
                  key={item}
                  index={item}
                  count={screenCountH}
                  width={gapWidthVBar}
                />
              ))}
            <UploadContentContainer>
              <AddIcon style={{ fontSize: 28, color: 'green' }} />
            </UploadContentContainer>
          </DropZoneComponent>
        ) : (
          <UploadContentContainer onClick={this.promptContact}>
            <AddIcon style={{ fontSize: 28, color: 'green' }} />
          </UploadContentContainer>
        )}
      </>
    );
  }
}

MediaUploader.propTypes = {
  handleAdsUploaded: PropTypes.func.isRequired,
  screenType: screenTypePropType.isRequired,
  user: userPropType.isRequired,
  openSignupModal: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  openSignupModal: () => dispatch(openAuthModal('signUp')),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MediaUploader);
