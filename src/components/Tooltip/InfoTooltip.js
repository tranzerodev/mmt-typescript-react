import React from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import InfoIcon from '@material-ui/icons/Info';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './InfoTooltip.css';

const InfoTooltip = ({ name, text }) => (
  <OverlayTrigger
    overlay={
      <Tooltip id={name}>
        <div className={s.infoTooltip}>{text}</div>
      </Tooltip>
    }
    placement="top"
  >
    <div className={s.iconContainer}>
      <InfoIcon style={{ fontSize: 16 }} />
    </div>
  </OverlayTrigger>
);

InfoTooltip.propTypes = {
  name: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default withStyles(s)(InfoTooltip);
