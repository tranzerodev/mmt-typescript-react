import Stripe from 'stripe';

const stripeConfig = require('../../config').stripe;

class StripeUtils {
  static CreateCustomer(email: string, source: string): Promise<string> {
    const stripe = new Stripe(stripeConfig.secretKey);

    return new Promise((resolve, reject) => {
      stripe.customers.create({ email, source }, (err, customer) => {
        if (err) {
          reject(err);
        } else {
          resolve(customer.id);
        }
      });
    });
  }
}

export default StripeUtils;
