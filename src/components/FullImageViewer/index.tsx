import React, { Component } from 'react';
import { Dialog, IconButton } from '@material-ui/core';
import { Clear as ClearIcon } from '@material-ui/icons';
import withStyles from 'isomorphic-style-loader/withStyles';
import { Image } from '../../constants/dataTypes';
import s from './FullImageViewer.css';

import FullImageMainView from './FullImageMainView';
import FullImageCarousel from './FullImageCarousel';

interface FullImageViewerProps {
  images: Image[];
  activeImage: Image;
  onClose: () => void;
}

interface FullImageViewerState {
  selectedIndex: number;
}

class FullImageViewer extends Component<
  FullImageViewerProps,
  FullImageViewerState
> {
  // TODO: eslint error react/state-in-constructor while merging master
  /* eslint-disable react/state-in-constructor */
  readonly state = { selectedIndex: 0 };

  componentDidMount() {
    const { activeImage, images } = this.props;
    this.setState({ selectedIndex: images.indexOf(activeImage) });
    document.addEventListener('keydown', this.handleKeywordKeyPress, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeywordKeyPress, false);
  }

  handleKeywordKeyPress = (e: KeyboardEvent) => {
    if (e.keyCode === 37) {
      this.handleClickPrev();
    } else if (e.keyCode === 39) {
      this.handleClickNext();
    }
  };

  handleClickPrev = () => {
    const { selectedIndex } = this.state;
    const { images } = this.props;

    if (selectedIndex > 0) {
      this.setState({ selectedIndex: selectedIndex - 1 });
    } else {
      this.setState({ selectedIndex: images.length - 1 });
    }
  };

  handleClickNext = () => {
    const { selectedIndex } = this.state;
    const { images } = this.props;

    if (selectedIndex < images.length - 1) {
      this.setState({ selectedIndex: selectedIndex + 1 });
    } else {
      this.setState({ selectedIndex: 0 });
    }
  };

  handleChange = (index: number) => {
    this.setState({ selectedIndex: index });
  };

  render() {
    const { selectedIndex } = this.state;
    const { images, onClose } = this.props;

    return (
      <Dialog fullScreen open onClose={onClose}>
        <div className={s.root}>
          <div className={s.header}>
            <div className={s.headerWrap}>
              <IconButton onClick={onClose} aria-label="close">
                <ClearIcon />
              </IconButton>
            </div>
          </div>
          <div className={s.body}>
            <div>
              <div className={s.bodyContainer}>
                <FullImageMainView
                  imgSrc={
                    images[selectedIndex].thumbnails.full
                      ? images[selectedIndex].thumbnails.full.url
                      : images[selectedIndex].url
                  }
                  onClickPrev={this.handleClickPrev}
                  onClickNext={this.handleClickNext}
                />
                <FullImageCarousel
                  images={images}
                  activeIndex={selectedIndex}
                  onChange={this.handleChange}
                />
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    );
  }
}

export default withStyles(s)(FullImageViewer);
