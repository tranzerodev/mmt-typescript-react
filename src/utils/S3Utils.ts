import AWS from 'aws-sdk';
import { Storage } from 'aws-amplify';
import portalConfig from '../portalConfig';

AWS.config.update({
  region: 'us-west-2',
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: portalConfig.AWS.Auth.identityPoolId,
  }),
});

const s3 = new AWS.S3({
  useAccelerateEndpoint: true,
});
const PortalBucketName = 'lightout-portal';
const publicImageKeyPrefix = 'public/images';

export interface S3AmplifyOptions {
  level?: string;
}

export default class S3Utils {
  static uploadAdCreative(
    userId: string,
    campaignName: string,
    fileWithType: { file: File; format: string },
  ) {
    const fileKey = `${userId}/${campaignName}/${fileWithType.format
      .split('/')[0]
      .replace(/\s/g, '')}/${fileWithType.file.name}`;

    return this.uploadFile(fileKey, fileWithType.file, {});
  }

  static uploadPackageAttachment(attachmentField: string, file: File) {
    const fileKey = `${attachmentField}/${file.name}`;

    return this.uploadFile(fileKey, file, { level: 'protected' });
  }

  static uploadFile(key: string, file: File, options: S3AmplifyOptions) {
    return Storage.put(key, file, {
      ...options,
      contentType: file.type,
    });
  }

  static getFile(key: string, options = {}) {
    return Storage.get(key, options);
  }

  static listFiles(path: string) {
    return Storage.list(path, { track: true });
  }

  static removeFile(key: string) {
    return Storage.remove(key);
  }

  static uploadPortalFile(
    file: File,
    fileKey: string,
  ): Promise<AWS.S3.ManagedUpload.SendData> {
    return new Promise((resolve, reject) => {
      s3.upload(
        {
          Bucket: PortalBucketName,
          Key: `${publicImageKeyPrefix}/${
            portalConfig.portalHeader
          }/${fileKey}`,
          Body: file,
        },
        (err, data) => {
          if (err) {
            reject(err);
          }

          resolve(data);
        },
      );
    });
  }
}
