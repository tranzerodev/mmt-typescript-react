import AWS from 'aws-sdk';

import { writeFile } from './lib/fs';

const s3 = new AWS.S3({ region: 'us-west-2' });

const portalArg = process.argv
  .filter(arg => arg.includes('--portal='))
  .map(arg => {
    const portalArgParts = arg.split('=');
    if (portalArgParts.length > 1) {
      return portalArgParts[1].trim().toLowerCase();
    }

    return '';
  });

/**
 * Creates application bundles from the source files.
 */
function setup() {
  if (!portalArg) {
    console.info(
      'Skipping portal config setup because no portal arg specified',
    );
    return Promise.resolve();
  }
  console.info('Setup config file for portal', portalArg);
  const params = {
    Bucket: 'lightout-portal',
    Key: `configs/${portalArg}/portalConfig.json`,
  };

  return s3
    .getObject(params)
    .promise()
    .then(result =>
      writeFile('src/portalConfig/portalConfig.json', result.Body.toString()),
    )
    .catch(err =>
      console.error('Did not setup portal config file', err.message),
    );
}

export default setup;
