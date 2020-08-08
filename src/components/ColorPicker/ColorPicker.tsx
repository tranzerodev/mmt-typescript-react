import React from 'react';
import { SketchPicker } from 'react-color';
import { makeStyles } from '@material-ui/styles';

const useColorPickerStyles = makeStyles({
  color: ({ colorHex }) => ({
    width: '36px',
    height: '14px',
    borderRadius: '2px',
    backgroundColor: `${colorHex}`,
  }),
  swatch: {
    padding: '5px',
    background: '#fff',
    borderRadius: '1px',
    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
    display: 'inline-block',
    cursor: 'pointer',
  },
  popover: {
    position: 'absolute',
    zIndex: '2',
  },
  cover: {
    position: 'fixed',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
  },
});

interface ColorPickerProps {
  onUpdate: (colorHex: string) => void;
  colorHex: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ colorHex, onUpdate }) => {
  const [displayColorPicker, setDisplayColorPicker] = React.useState(false);
  const [color, setColor] = React.useState(colorHex);
  const classes = useColorPickerStyles({ colorHex: color });

  React.useEffect(() => {
    setColor(colorHex);
  }, [colorHex]);
  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleChange = (selectedColor: any) => {
    onUpdate(selectedColor.hex);
    setColor(selectedColor);
  };

  return (
    <div>
      <div
        className={classes.swatch}
        onClick={handleClick}
        onKeyDown={handleClick}
        role="button"
        tabIndex={0}
      >
        <div className={classes.color} />
      </div>
      {displayColorPicker ? (
        <div className={classes.popover}>
          <div
            className={classes.cover}
            onClick={handleClose}
            onKeyDown={handleClick}
            role="button"
            tabIndex={0}
            aria-label="Pick color"
          />
          <SketchPicker color={color} onChange={handleChange} />
        </div>
      ) : null}
    </div>
  );
};

export default ColorPicker;
