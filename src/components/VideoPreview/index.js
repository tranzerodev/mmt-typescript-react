/* eslint-disable jsx-a11y/media-has-caption */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const VideoFillContainer = styled.video`
  max-width: 100%;
  height: 100%;
  object-fit: fill;
`;

const unsupportedVideoMessage = "Your browser doesn't support embedded videos.";

class VideoPreview extends PureComponent {
  render() {
    const { url } = this.props;
    return (
      <VideoFillContainer key={url} loop autoPlay muted>
        <source src={url} type="video/mp4" />
        <p>{unsupportedVideoMessage}</p>
      </VideoFillContainer>
    );
  }
}

VideoPreview.propTypes = {
  url: PropTypes.string.isRequired,
};

export default VideoPreview;
