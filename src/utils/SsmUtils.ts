import AWS from 'aws-sdk';

const ssm = new AWS.SSM({ region: 'us-west-2', credentials: undefined });

export default class SsmUtils {
  static GetDecryptedParameters(paramNames: string[]) {
    const params = {
      Names: paramNames,
      WithDecryption: true,
    };

    return new Promise((resolve, reject) => {
      ssm.getParameters(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.Parameters);
        }
      });
    });
  }
}
