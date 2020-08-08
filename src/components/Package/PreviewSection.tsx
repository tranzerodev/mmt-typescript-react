import React, { FunctionComponent, useState } from 'react';
import { ButtonBase, Box } from '@material-ui/core';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import HorizontalScroll from 'react-scroll-horizontal';
import useStyles from './styles';
import FullImageViewer from '../FullImageViewer';
import { Package } from '../../store/packages/types';
import { Image } from '../../constants/dataTypes';

interface PreviewSectionProps {
  packageItem: Package;
}

const PreviewSection: FunctionComponent<PreviewSectionProps> = ({
  packageItem,
}) => {
  const [activeImage, setActiveImage] = useState(null);
  const primaryImages: Image[] = packageItem.imagesPrimary || [];
  const secondaryImages: Image[] = packageItem.imagesSecondary || [];
  const classes = useStyles({
    itemsPerRow: Math.ceil(secondaryImages.length / 2),
  });

  const openImageViewer = (image: any = null) => {
    setActiveImage(image);
  };

  const closeImageViewer = () => {
    setActiveImage(null);
  };

  const renderImageCard = (image: Image, containerClass: any) => {
    const imgOptions: any = {};

    let previewUrl = image.url;
    if (image.thumbnails && image.thumbnails.large) {
      previewUrl = image.thumbnails.large.url;
    }

    if (previewUrl) {
      imgOptions.style = {
        backgroundImage: `url(${previewUrl})`,
      };
    }

    return (
      <div key={previewUrl}>
        <ButtonBase onClick={() => openImageViewer(image)}>
          <div className={containerClass} {...imgOptions} />
        </ButtonBase>
      </div>
    );
  };

  return (
    <div className={classes.root}>
      <div className={classes.primaryImages}>
        {primaryImages.map((im: any) =>
          renderImageCard(im, classes.bigImageContainer),
        )}
      </div>
      <Box className={classes.secondaryImagesContainer}>
        <HorizontalScroll reverseScroll>
          {[
            <div key="secondary-images" className={classes.secondaryImages}>
              {secondaryImages.map((im: any) =>
                renderImageCard(im, classes.secondaryImageContainer),
              )}
            </div>,
          ]}
        </HorizontalScroll>
      </Box>

      {activeImage && (
        <FullImageViewer
          onClose={closeImageViewer}
          activeImage={activeImage}
          images={primaryImages.concat(secondaryImages)}
        />
      )}
    </div>
  );
};

export default PreviewSection;
