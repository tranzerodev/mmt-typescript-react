import express from 'express';
import { Logger } from 'aws-amplify';

const secure = require('../../config').isProd;

const router = express.Router();
const logger = new Logger('ProfileApi');

/**
 * POST /profile/session
 * create httpOnly cookie that stores accessToken
 */
router.post('/session', async (req, res) => {
  // set header that sets a secure cookie for user sessions verification
  // this endpoint is not called when a user is not logged in
  const data = req.body;
  if (!data.accessToken) {
    logger.error('unable to verify session from request data', data);
    // verify that access token is legit
    res.status(500).send('Invalid session');
  } else {
    res.cookie('app-session', data.accessToken, {
      httpOnly: true,
      secure,
    });
    res.send('Ok');
  }
});

export default router;
