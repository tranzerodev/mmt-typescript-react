import React from 'react';
import Intercom from 'react-intercom';
import { userPropType } from '../../store/user/reducers';

const INTERCOM_APP_ID = 'emmvxuay';

const getNameFromAttributes = attributes => {
  let name = '';
  if (attributes.given_name) {
    name = attributes.given_name;
  }

  if (attributes.family_name) {
    if (name) {
      // add last name with a space
      name = `${name} ${attributes.family_name}`;
    } else {
      name = attributes.family_name;
    }
  }

  return name;
};

const getIntercomUserProps = user => {
  const intercomUserProps = {};
  const attributes = user.instance && user.instance.attributes;
  if (attributes && Object.keys(attributes).length) {
    Object.assign(intercomUserProps, {
      email: attributes.email,
      user_id: user.instance.username,
    });

    const name = getNameFromAttributes(attributes);
    if (name) {
      intercomUserProps.name = name;
    }

    if (attributes['custom:companyName']) {
      intercomUserProps.company = {
        company_id: user.instance.username, // set the company to user's id
        name: attributes['custom:companyName'],
      };
    }
  }

  return intercomUserProps;
};

const IntercomMessenger = ({ user }) => (
  <Intercom appID={INTERCOM_APP_ID} {...getIntercomUserProps(user)} />
);

IntercomMessenger.propTypes = { user: userPropType.isRequired };

export default IntercomMessenger;
