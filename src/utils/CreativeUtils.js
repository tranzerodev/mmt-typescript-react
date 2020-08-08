const minCreativeHeight = 100;
const minCreativeWidth = 300;
const requiredImageRatio = 3.0;
const assetRatioThreshold = 0.5; // the allowed difference in absolute ratio
const maxFileSize = 1024 * 1024 * 10;
const maxVideoDuration = 8.9;

const isCreativeInValid = (height, width) => {
  const imgRatio = width / height;
  return (
    height < minCreativeHeight ||
    width < minCreativeWidth ||
    Math.abs(requiredImageRatio - imgRatio) > assetRatioThreshold
  );
};

const getDimensionErrMessage = creativeType => `
${creativeType} does not meet the dimension requirements so it has been cropped.
`;

export const validateImage = imageFile =>
  new Promise(resolve => {
    const image = new Image();
    image.onload = () => {
      const { height, width } = image;
      const error = isCreativeInValid(height, width)
        ? getDimensionErrMessage('Image')
        : null;
      resolve({ isValid: true, error });
    };

    image.src = imageFile.preview;
  });

export const validateVideo = videoFile =>
  new Promise(resolve => {
    const video = document.createElement('Video');
    video.onloadeddata = () => {
      const height = video.videoHeight;
      const width = video.videoWidth;
      let error = null;
      if (video.duration > maxVideoDuration) {
        error = 'Video is too long';
      } else if (isCreativeInValid(height, width)) {
        error = getDimensionErrMessage('Video');
      }

      resolve({ isValid: true, error });
    };

    video.src = videoFile.preview;
    video.load();
  });

export const validateCreative = creative => {
  if (creative.size > maxFileSize) {
    return Promise.resolve({
      isValid: false,
      error: 'File is too large. Please upload a file under 10 MB',
    });
  }

  if (!creative.preview) {
    // eslint-disable-next-line no-param-reassign
    creative.preview = URL.createObjectURL(creative);
  }

  if (creative.type.startsWith('video')) {
    return validateVideo(creative);
  }

  return validateImage(creative);
};
