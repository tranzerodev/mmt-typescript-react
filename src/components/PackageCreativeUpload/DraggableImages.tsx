import React, { FC } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { makeStyles } from '@material-ui/styles';
import { createStyles } from '@material-ui/core';
import RemoveIcon from '@material-ui/icons/RemoveCircle';
import IconButton from '@material-ui/core/IconButton';
import arrayMove from 'array-move';
import { FileWithPreview } from 'react-dropzone';
import * as DataType from '../../constants/dataTypes';

const useStyles = makeStyles(() =>
  createStyles({
    item: {
      float: 'left',
      paddingLeft: 8,
      paddingRight: 8,
      paddingTop: 8,
      '& .content': {
        padding: '8px 12px',
        backgroundColor: '#ddd',
      },
    },
    container: {
      marginLeft: -8,
      marginRight: -8,
      whiteSpace: 'nowrap',
      '&:after': {
        content: '',
        clear: 'both',
        display: 'table',
      },
    },
    wrapper: {
      width: 500,
    },
  }),
);

interface DraggableImagesProps {
  ImgPreviewClass: string;
  ImgPreviewWrapperClass: string;
  imageDeleteBtnClass: string;
  images?: Array<DataType.Image | FileWithPreview>;
  handleImagesChange?: (images: DataType.Image[]) => void;
  progressValue?: number;
  isUploading?: boolean;
  value?: DataType.Image | FileWithPreview;
  handleRemoveImages?: (item: DataType.Image) => void;
  index?: number;
  classes: {
    item: string;
    container: string;
    wrapper: string;
  };
}

const SortableItem = SortableElement(
  ({
    value: item,
    isUploading,
    imageDeleteBtnClass,
    ImgPreviewClass,
    ImgPreviewWrapperClass,
    handleRemoveImages,
    classes,
  }: DraggableImagesProps) => (
    <div className={`${ImgPreviewWrapperClass} container ${classes.item}`}>
      {!isUploading && (
        <IconButton
          size="small"
          onClick={() => handleRemoveImages(item)}
          className={imageDeleteBtnClass}
        >
          <RemoveIcon fontSize="small" color="error" />
        </IconButton>
      )}
      <img
        className={ImgPreviewClass}
        src={item.url || item.preview}
        alt={item.filename || item.name}
      />
    </div>
  ),
);

const SortableList = SortableContainer((props: DraggableImagesProps) => {
  const { images, ...restProps } = props;
  if (!images) return <></>;

  const { classes } = restProps;
  return (
    <div className={classes.container}>
      {images.map((item: DataType.Image | FileWithPreview, index: number) => (
        <SortableItem
          key={item.url || item.preview}
          index={index}
          value={item}
          {...restProps}
        />
      ))}
    </div>
  );
});

const DraggableImages: FC<DraggableImagesProps> = ({
  images,
  handleImagesChange,
  ...otherProps
}) => {
  const { isUploading } = otherProps;
  const classes = useStyles();
  const onSortEnd = ({
    oldIndex,
    newIndex,
  }: {
    oldIndex: number;
    newIndex: number;
  }) => {
    handleImagesChange(arrayMove(images, oldIndex, newIndex));
  };

  const handleRemoveImages = (item: DataType.Image) => {
    if (!item || isUploading) return;

    handleImagesChange(images.filter(image => image.url !== item.url));
  };

  return (
    <div className={classes.wrapper}>
      <SortableList
        classes={classes}
        axis="xy"
        images={images}
        onSortEnd={onSortEnd}
        handleRemoveImages={handleRemoveImages}
        distance={1}
        {...otherProps}
      />
    </div>
  );
};

export default DraggableImages;
