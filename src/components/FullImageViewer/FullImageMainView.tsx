import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './FullImageMainView.css';

interface FullImageMainViewProps {
  imgSrc: string,
  onClickPrev: () => void,
  onClickNext: () => void,
}
class FullImageMainView extends Component<FullImageMainViewProps, {}> {

  render() {
    const { imgSrc, onClickPrev, onClickNext } = this.props;

    return (
      <div className={s.root}>
        <div className={s.wrap}>
          <div>
            <div className={`${s.arrowButton} ${s.leftArrow}`} onClick={onClickPrev}>
              <IconButton className={s.image}>
                <ArrowBackIosIcon />
              </IconButton>
            </div>

            <div className={`${s.arrowButton} ${s.rightArrow}`} onClick={onClickNext}>
              <IconButton className={s.image}>
                <ArrowForwardIosIcon />
              </IconButton>
            </div>
          </div>
          <img
            src={imgSrc}
            alt="main"
            className={s.mainImg}
            onClick={onClickNext}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(FullImageMainView);
