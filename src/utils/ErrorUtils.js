import { Logger } from 'aws-amplify';

const logger = new Logger('ErrorUtils');

export default class ErrorUtils {
  static formatCampaignEditError(error) {
    let resultErrors = [];
    try {
      if (Array.isArray(error)) {
        resultErrors = error;
      } else if (typeof error === 'string') {
        resultErrors.push(error);
      } else {
        logger.error('Uncaught create error', error);
        resultErrors.push('Unknown error');
      }
    } catch (e) {
      logger.error('Uncaught create error', e);
      resultErrors.push('Unable to create campaign');
    }

    return resultErrors;
  }
}
