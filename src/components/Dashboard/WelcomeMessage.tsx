import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { Box } from '@material-ui/core';
import moment from 'moment';
import { UserState as User } from '../../store/user/types';

type WelcomeMessageProps = {
  user: User;
};

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ user }) => {
  const getGreetingMessage = () => {
    const userAttributes = user && user.instance && user.instance.attributes;
    const firstName = userAttributes ? userAttributes.given_name : '';
    const hours = moment().hours();

    let timeMessage = '';
    if (hours < 12) {
      timeMessage = 'Morning';
    } else if (hours < 18) {
      timeMessage = 'Afternoon';
    } else {
      timeMessage = 'Evening';
    }

    return `Good ${timeMessage}${firstName ? `, ${firstName}` : ''}`;
  };

  const [message, setMessage] = useState(getGreetingMessage());

  useEffect(() => {
    const interval = setInterval(() => {
      setMessage(getGreetingMessage());
    }, 1000);
    return () => clearInterval(interval);
  }, [user, message]);

  return (
    <Box mb={2} id="welcome-message">
      <Typography component="h1" variant="h3" gutterBottom>
        {message}
      </Typography>
      <Typography variant="subtitle1">
        Here&apos;s what&apos;s happening
      </Typography>
    </Box>
  );
};

export default WelcomeMessage;
