import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import Slider from 'react-slick';
import { Image } from '../../constants/dataTypes';
import s from './FullImageCarousel.css';

const settings = {
  focusOnSelect: true,
  centerMode: false,
  infinite: false,
  slidesToShow: 3,
  swipeToSlide: true,
  speed: 150,
  arrows: false,
  responsive: [
    {
      breakpoint: 1128,
      settings: {
        slidesToShow: 5,
      },
    },
    {
      breakpoint: 744,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

interface FullImageCarouselProps {
  images: Image[];
  activeIndex: number;
  onChange: (index: number) => void;
}

class FullImageCarousel extends Component<FullImageCarouselProps, {}> {
  private slider!: Slider;
  static defaultProps = {
    activeIndex: 0,
  };

  componentDidUpdate(prevProps: FullImageCarouselProps) {
    if (prevProps.activeIndex !== this.props.activeIndex) {
      this.slider.slickGoTo(this.props.activeIndex);
    }
  }

  render() {
    const { images, activeIndex, onChange } = this.props;

    return (
      <div className={s.root}>
        <div className={s.slideImages}>
          <Slider
            ref={(slider: Slider) => (this.slider = slider)}
            {...settings}
          >
            {images.map((image: Image, index: number) => {
              const slideClassName = [s.slideItem];
              if (activeIndex === index) slideClassName.push(s.active);
              return (
                <div
                  key={image.id}
                  className={slideClassName.join(' ')}
                  onClick={() => onChange(index)}
                >
                  <img src={image.thumbnails.small.url} alt="slide" />
                </div>
              );
            })}
          </Slider>
        </div>
        <div className={s.slideInfo}>
          {activeIndex + 1} / {images.length}
        </div>
      </div>
    );
  }
}

export default withStyles(s)(FullImageCarousel);
