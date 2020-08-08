const videoExtensions = ['mp4'];

export default class UrlUtils {
  static getExtensionFromFileUrl(url) {
    return url
      .split(/#|\?/)[0]
      .split('.')
      .pop()
      .trim();
  }

  static isVideoUrl(url) {
    const extension = this.getExtensionFromFileUrl(url);
    return videoExtensions.includes(extension);
  }
}
