import * as React from 'react';
import Dropzone, { FileWithPreview } from 'react-dropzone';
import { createStyles, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import { S3Utils } from '../../utils';
import * as DataType from '../../constants/dataTypes';
import DraggableImages from './DraggableImages';

const useStyles = makeStyles(theme =>
  createStyles({
    DropZoneWrapper: {
      marginTop: '10px',
      padding: theme.spacing(1),
      borderWidth: '2px',
      borderRadius: '2px',
      borderColor: '#ccc',
      borderStyle: 'dashed',
      background: '#eee',
    },
    VerticalList: {
      listStyleType: 'none',
      display: 'table-row',
    },
    VerticalItem: {
      display: 'table-cell',
      padding: '5px',
    },
    ImgPreview: {
      width: '100px',
      height: '100px',
    },
    centered: {
      textAlign: 'center',
    },
    imgPreviewWrapper: {
      position: 'relative',
      '&:hover button': {
        display: 'initial',
      },
    },
    imageDeleteBtn: {
      position: 'absolute',
      top: 0,
      right: 0,
      display: 'none',
    },
  }),
);

const PackageCreativeDir = 'package_creatives';

interface AttachmentUpload {
  url: string;
}

type AttachmentField = Record<string, AttachmentUpload[]>;

interface PackageCreativeUploadProps {
  packageCreativeType: string;
  onUpdate: (imageAttachements: AttachmentField) => void;
  images: DataType.Image[];
  isUploading: boolean;
  toggleLoading: (value: boolean) => void;
}

const PackageCreativeUpload: React.FC<PackageCreativeUploadProps> = ({
  images,
  packageCreativeType,
  onUpdate,
  isUploading,
  toggleLoading,
}) => {
  const classes = useStyles();
  const [attachments, setAttachments] = React.useState([] as DataType.Image[]);
  const [progressValue, setProgressValue] = React.useState(0);
  const [files, setFiles] = React.useState([] as FileWithPreview[]);

  React.useEffect(() => {
    setFiles([]);
    onUpdate({ [packageCreativeType]: attachments });
  }, [attachments]);

  const onDrop = async (acceptedFiles: FileWithPreview[]) => {
    const totalFiles = acceptedFiles.length;
    setFiles(acceptedFiles);
    toggleLoading(true);
    let currentUploadedFiles = 0;
    const randomId = Math.random()
      .toString(36)
      .substr(2, 9);
    const imageUrls = await Promise.all(
      acceptedFiles.map(async file => {
        const uploadResult = await S3Utils.uploadPortalFile(
          file,
          `${PackageCreativeDir}/${randomId}/${file.name}`,
        );

        currentUploadedFiles += 1;
        setProgressValue(Math.trunc((currentUploadedFiles * 100) / totalFiles));
        return {
          url: uploadResult.Location,
        };
      }),
    );
    setProgressValue(0);
    toggleLoading(false);
    setAttachments([...images, ...imageUrls]);
  };

  const renderPreview = () => {
    const renderingImages = [...images, ...files.flat()];
    const imagesSize = renderingImages.length;
    if (imagesSize === 0) return <></>;
    const isShowDescription = imagesSize > 1 && !isUploading;

    return (
      <>
        {isShowDescription && (
          <Typography variant="body2">
            Drag the images to change the order. The first image is the primary
            image and is given extra visibility.
          </Typography>
        )}
        <DraggableImages
          images={renderingImages}
          ImgPreviewWrapperClass={classes.imgPreviewWrapper}
          imageDeleteBtnClass={classes.imageDeleteBtn}
          ImgPreviewClass={classes.ImgPreview}
          handleImagesChange={setAttachments}
          progressValue={progressValue}
          isUploading={isUploading}
        />
      </>
    );
  };

  const renderDropZoneContent = () => {
    if (isUploading) {
      return (
        <>
          <Typography>Uploading...</Typography>
          <LinearProgress
            variant="determinate"
            value={progressValue}
            style={{ marginTop: 10 }}
          />
        </>
      );
    }
    return (
      <>
        <Typography>Drop images here for this package.</Typography>
        <Typography>or</Typography>
        <Button size="small" variant="contained" color="primary">
          Browse Files
        </Button>
      </>
    );
  };

  return (
    <>
      <div id="package-image-dropzone-parent">
        <Dropzone
          className={classes.DropZoneWrapper}
          onDrop={onDrop}
          accept="image/png, image/jpeg"
          multiple
        >
          <div className={classes.centered}>{renderDropZoneContent()}</div>
        </Dropzone>
      </div>

      {renderPreview()}
    </>
  );
};

export default PackageCreativeUpload;
