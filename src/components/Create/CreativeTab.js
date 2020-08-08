import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import CreativeUploader from '../CreativeUploader/CreativeUploader';

/**
 * do not delete temporary, because it is used in PackageCampaign module
 * TODO: move this prop to package campaign module - this should be done
 * in a seperate PR
 */
export const SubTitle = `Upload the images and videos you would like to utilize for the campaign. Each file should be less than 10 MB in size and videos must be in .MP4 format.`;

const MediaContainer = styled.div`
  display: flex;
  margin-top: var(--default-space);
  margin-bottom: 12px;
`;

const generalAssetType = {
  id: 'general',
  Name: 'General',
  videoSupported: true,
  screenCountHorizontal: 1,
  screenCountVertical: 1,
  resolutionHeight: 180,
  autoWidth: true,
  pixelGapHorizontal: 0,
  pixelGapVertical: 0,
};

class CreativeTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      creativeFiles: props.creativeFiles,
      creativeUrls: props.creativeUrls,
      deletedUrls: [],
      screenTypes: [],
    };
  }

  componentDidMount() {
    const { screenTypes } = this.props;
    this.convertScreenTypes(screenTypes);
  }

  componentDidUpdate(prevProps) {
    const { screenTypes } = this.props;
    if (prevProps.screenTypes.length !== screenTypes.length)
      this.convertScreenTypes(screenTypes);
  }

  convertScreenTypes = screenTypes => {
    this.setState({
      screenTypes: screenTypes.map(screenType => ({
        id: screenType.id,
        name: screenType.Name,
        videoSupported: screenType['Video Supported'],
        spotLength: screenType['Spot Length'],
        screenCountHorizontal: screenType['Screen Count - Horizontal'],
        screenCountVertical: screenType['Screen Count - Vertical'],
        resolutionHeight: screenType['Resolution - Height'],
        resolutionWidth: screenType['Resolution - Width'],
        loopLength: screenType['Loop Length'],
        dimensionHeight: screenType['Dimension - Height'],
        dimensionWidth: screenType['Dimension - Width'],
        pixelGapHorizontal: screenType['Pixel Gap - Horizontal'],
        pixelGapVertical: screenType['Pixel Gap - Vertical'],
      })),
    });
  };

  handleAdsUploaded = newFiles => {
    const { onUpdate } = this.props;
    let { creativeFiles } = this.state;
    const existingUnreplacedFiles = creativeFiles.filter(
      f =>
        newFiles.findIndex(
          newFile =>
            newFile.file.name === f.file.name && newFile.format === f.format,
        ) < 0,
    );
    creativeFiles = existingUnreplacedFiles.concat(newFiles);
    this.setState({ creativeFiles });
    onUpdate({ creativeFiles });
  };

  handleCreativeFileRemoved = file => {
    const { onUpdate } = this.props;
    const { creativeUrls } = this.state;
    let { deletedUrls, creativeFiles } = this.state;
    if (file.isUploaded) {
      const newDeletedUrl = creativeUrls.find(creativeUrl =>
        file.url.includes(creativeUrl.url),
      );
      if (newDeletedUrl) {
        const existingUnreplacedUrls = deletedUrls.filter(
          u => u.url !== newDeletedUrl.url,
        );
        deletedUrls = existingUnreplacedUrls.concat(newDeletedUrl);
        this.setState({ deletedUrls });
        this.setState({
          creativeUrls: creativeUrls.filter(
            creativeUrl => !file.url.includes(creativeUrl.url),
          ),
        });
        onUpdate({ deletedUrls });
      }
    } else {
      creativeFiles = creativeFiles.filter(
        creativeFile => creativeFile.file.preview !== file.url,
      );
      this.setState({ creativeFiles });
      onUpdate({ creativeFiles });
    }
  };

  renderComponent = () => {
    const { creativeFiles, creativeUrls, screenTypes } = this.state;
    const generalCreatives = creativeUrls.filter(
      c => !c.format || c.format === 'General/general',
    );

    return (
      <>
        {screenTypes.map(screenType => (
          <MediaContainer key={screenType.id}>
            <CreativeUploader
              handleAdsUploaded={this.handleAdsUploaded}
              handleCreativeFileRemoved={this.handleCreativeFileRemoved}
              creativeUrls={creativeUrls.filter(urlWithFormat =>
                urlWithFormat.format
                  ? urlWithFormat.format.split('/')[1] === screenType.id
                  : false,
              )}
              creativeFiles={creativeFiles.filter(
                urlWithFormat =>
                  urlWithFormat.format.split('/')[1] === screenType.id,
              )}
              screenType={screenType}
            />
          </MediaContainer>
        ))}
        <MediaContainer>
          <CreativeUploader
            handleAdsUploaded={this.handleAdsUploaded}
            handleCreativeFileRemoved={this.handleCreativeFileRemoved}
            creativeUrls={generalCreatives}
            creativeFiles={creativeFiles.filter(
              urlWithFormat =>
                urlWithFormat.format.split('/')[1] === generalAssetType.id,
            )}
            screenType={generalAssetType}
            previewOnly
          />
        </MediaContainer>
      </>
    );
  };

  render() {
    return this.renderComponent();
  }
}

CreativeTab.propTypes = {
  onUpdate: PropTypes.func.isRequired,
  creativeFiles: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  ),
  creativeUrls: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  ),
  screenTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

CreativeTab.defaultProps = {
  creativeFiles: [],
  creativeUrls: [],
};

export default CreativeTab;
