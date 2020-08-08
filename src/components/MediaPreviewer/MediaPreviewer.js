import differenceWith from 'lodash/differenceWith';
import isEqual from 'lodash/isEqual';
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import CancelIcon from '@material-ui/icons/Cancel';
import { styled, Box, CardMedia } from '@material-ui/core';
import grey from '@material-ui/core/colors/grey';
import IconButton from '@material-ui/core/IconButton';
import VideoPreview from '../VideoPreview';
import { S3Utils, UrlUtils } from '../../utils';
import EndpointTypeUtils from '../../utils/endpointTypeUtils';
import {
  publicKeyCreativeUrls,
  screenTypePropType,
} from '../../constants/creativeConsts';

const MediaConatiner = styled(Box)({
  display: 'flex',
  height: '100%',
});

const MediaCard = styled(Box)(({ screenType, theme }) => ({
  marginLeft: theme.spacing(2),
  height: '100%',
  minWidth: '100px',
  width: EndpointTypeUtils.getContainerWidth(screenType),
  backgroundColor: grey[300],
  border: `1px dashed ${grey[500]}`,
  borderRadius: '3px',
  position: 'relative',
}));

const PreviewImg = styled(CardMedia)({
  '&': {
    height: '100%',
    maxWidth: '100%',
  },
});

const CloseButton = styled(Box)({
  position: 'absolute',
  top: '-10px',
  right: '-10px',
  zIndex: 1,
  background: 'white',
  borderRadius: '50%',
});

const CloseIcon = styled(IconButton)({
  '&&': {
    margin: 0,
    padding: 0,
  },
});

const HLine = styled(Box)(({ width, top }) => ({
  position: 'absolute',
  display: 'block',
  height: `${width}px`,
  width: '100%',
  top: `calc(${top}% - ${width / 3}px)`,
  background: '#eee',
}));

const VLine = styled(Box)(({ left, width }) => ({
  position: 'absolute',
  display: 'block',
  height: '100%',
  width: `${width}px`,
  background: '#eee',
  left: `calc(${left}% - ${width / 3}px)`,
}));

class MediaPreviewer extends Component {
  constructor() {
    super();
    this.state = {
      loadedCreatives: [],
    };
  }

  componentDidMount() {
    const { creativeUrls } = this.props;
    this.generateFullCreativeUrls(creativeUrls, true);
  }

  componentDidUpdate(prevProps) {
    const prevUrls = prevProps.creativeUrls;
    const { creativeUrls } = this.props;
    if (creativeUrls.length > prevUrls.length)
      this.generateFullCreativeUrls(
        differenceWith(creativeUrls, prevUrls, isEqual),
        true,
      );
    else if (creativeUrls.length < prevUrls.length)
      this.generateFullCreativeUrls(
        differenceWith(prevUrls, creativeUrls, isEqual),
        false,
      );
  }

  generateFullCreativeUrls = (urls, isAddMode) => {
    const { screenType } = this.props;
    const { loadedCreatives } = this.state;
    const formattedUrls = urls.map(u =>
      typeof u === 'string'
        ? {
            url: u,
            format: `${screenType.Name}/${screenType.id}`,
          }
        : u,
    );
    if (isAddMode) {
      Promise.all(
        formattedUrls.map(async urlWithFormat => ({
          url: publicKeyCreativeUrls[urlWithFormat.url]
            ? publicKeyCreativeUrls[urlWithFormat.url]
            : await S3Utils.getFile(urlWithFormat.url),
        })),
      ).then(data => {
        this.setState({
          loadedCreatives: loadedCreatives.concat(data),
        });
      });
    } else {
      this.setState({
        loadedCreatives: loadedCreatives.filter(
          loadedCreative =>
            formattedUrls.findIndex(url =>
              loadedCreative.url.includes(url.url),
            ) < 0,
        ),
      });
    }
  };

  handleRemovePreviewFile = file => {
    const { handleCreativeFileRemoved } = this.props;
    handleCreativeFileRemoved(file);
  };

  renderCreative = ({
    url,
    file,
    screenCountH,
    screenCountV,
    gapWidthH,
    gapWidthV,
  }) => {
    const { screenType } = this.props;
    const baseCreativeUrl = url && url.split('?')[0];
    const isVideo =
      (file && file.type.startsWith('video')) ||
      (baseCreativeUrl && UrlUtils.isVideoUrl(baseCreativeUrl));

    const previewUrl = (file && file.preview) || url;
    const isUploaded = !!url;

    return (
      <MediaCard screenType={screenType}>
        <CloseButton>
          <CloseIcon
            aria-label="delete"
            size="small"
            onClick={() =>
              this.handleRemovePreviewFile({
                isUploaded,
                url: previewUrl,
                screenType,
              })
            }
          >
            <CancelIcon style={{ fontSize: 18, color: 'red' }} />
          </CloseIcon>
        </CloseButton>
        {screenCountV > 1 &&
          [...Array(screenCountV - 1).keys()].map(item => (
            <HLine
              component="span"
              top={(100 / screenCountV) * (item + 1)}
              key={item}
              width={gapWidthH}
            />
          ))}
        {screenCountH > 1 &&
          [...Array(screenCountH - 1).keys()].map(item => (
            <VLine
              component="span"
              left={(100 / screenCountH) * (item + 1)}
              key={item}
              width={gapWidthV}
            />
          ))}
        {isVideo ? (
          <VideoPreview url={previewUrl} />
        ) : (
          <PreviewImg
            component="img"
            src={previewUrl}
            title={file && file.name}
          />
        )}
      </MediaCard>
    );
  };

  render() {
    const { loadedCreatives } = this.state;
    const { creativeFiles, screenType } = this.props;
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
        <MediaConatiner>
          {loadedCreatives.map(creativeUrl => (
            <Fragment key={creativeUrl.url}>
              {this.renderCreative({
                url: creativeUrl.url,
                screenCountH,
                screenCountV,
                gapWidthH: gapWidthHBar,
                gapWidthV: gapWidthVBar,
              })}
            </Fragment>
          ))}
          {creativeFiles.map(file => (
            <Fragment key={file.file.name}>
              {this.renderCreative({
                file: file.file,
                screenCountH,
                screenCountV,
                gapWidthH: gapWidthHBar,
                gapWidthV: gapWidthVBar,
              })}
            </Fragment>
          ))}
        </MediaConatiner>
      </>
    );
  }
}

MediaPreviewer.propTypes = {
  handleCreativeFileRemoved: PropTypes.func.isRequired,
  creativeUrls: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  ),
  creativeFiles: PropTypes.arrayOf(PropTypes.object),
  screenType: screenTypePropType.isRequired,
};

MediaPreviewer.defaultProps = {
  creativeUrls: [],
  creativeFiles: [],
};

export default MediaPreviewer;
