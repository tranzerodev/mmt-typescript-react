/* eslint-disable @typescript-eslint/camelcase */
import express from 'express';
import { Logger } from 'aws-amplify';
import querystring from 'querystring';
import StripeUtils from './stripeUtils';
import portalConfig from '../../portalConfig';

const stripeConfig = require('../../config').stripe;

const router = express.Router();
const logger = new Logger('ProfileApi');

/**
 * POST /stripe/cardToken
 *
 * Create customer using a card token generate from the webapp
 */
router.post('/cardToken', async (req, res) => {
  const { email, token } = req.body;
  if (!email) {
    res.status(500).send({ error: 'Unknown user' });
  } else {
    StripeUtils.CreateCustomer(email, token)
      .then((customerId: string) => {
        res.send({ customerId });
      })
      .catch(error => {
        logger.error('unable to create card token', error);
        res.status(500).send(error);
      });
  }
});

/**
 * GET /stripe/oauthUrl
 *
 * Get oauth url for user
 */
router.get('/oauthUrl', async (req, res) => {
  console.info('Generating stripe oauth url for', req.query);
  const { id, businessName, email, country, next } = req.query;
  const params = {
    client_id: stripeConfig.clientId,
    redirect_uri: `${portalConfig.BaseAPIUrl}/users/stripe/token`,
    scope: 'read_write',
    response_type: 'code',
    state: JSON.stringify({
      paymentInfo: { id, businessName, ownerId: portalConfig.portalHeader },
      next,
    }),
    'stripe_user[business_name]': businessName,
    'stripe_user[business_type]': 'corporation',
    'stripe_user[email]': email,
    'stripe_user[url]': portalConfig.SignoutRedirectURL,
    'stripe_user[country]': country,
  };
  const capabilities =
    'suggested_capabilities[]=transfers&suggested_capabilities[]=card_payments';
  const stringQueryParams = querystring.stringify(params);
  res.send(`${stripeConfig.authorizeUri}?${stringQueryParams}&${capabilities}`);
});

export default router;
