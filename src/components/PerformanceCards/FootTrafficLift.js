import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@material-ui/core';
import { Delete as DeleteIcon } from 'react-feather';
import { loadMapScript } from '../../utils/MapUtils';
import s from './FootTrafficLift.css';
import { AddressSuggest } from '../TextBox';

const helpMessage = `This module requires you to tell us the addresses where you want to track uplift in footfall traffic.`;

function FootTrafficLift({ locations, moduleUpdated }) {
  const { isLoaded } = loadMapScript();

  const handleAddressEntered = addressSuggest => {
    const { label, placeId, location } = addressSuggest;
    // first get location from previous data that doesn't include the new entered address
    const newLocations = locations.filter(l => l.label !== label);
    newLocations.push({
      label,
      placeId,
      location,
    });
    moduleUpdated({ locations: newLocations });
  };

  const removeLocation = label => {
    const newLocations = locations.filter(l => l.label !== label);
    moduleUpdated({ locations: newLocations });
  };

  const renderComponent = () => (
    <>
      <div className={s.helpMessage}>{helpMessage}</div>
      <AddressSuggest onSubmit={handleAddressEntered} clearOnSelect />
      <List classes={{ root: s.addressList }}>
        {locations.map(({ label, placeId }) => (
          <ListItem key={placeId} classes={{ root: s.addressItem }}>
            <ListItemText primary={label} />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => removeLocation(label)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </>
  );

  return isLoaded ? renderComponent() : null;
}

FootTrafficLift.propTypes = {
  locations: PropTypes.arrayOf(PropTypes.object),
  moduleUpdated: PropTypes.func.isRequired,
};

FootTrafficLift.defaultProps = {
  locations: [],
};

export default withStyles(s)(FootTrafficLift);
