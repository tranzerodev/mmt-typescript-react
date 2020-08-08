import { EndpointScreenType } from '../constants/dataTypes';

export default class EndpointTypeUtils {
  static getContainerWidth(screenType: EndpointScreenType) {
    if (screenType.autoWidth) {
      return 'fit-content';
    }

    if (screenType.resolutionHeight > 250) {
      return `${(screenType.resolutionWidth * 250) /
        screenType.resolutionHeight}px`;
    }

    return `${screenType.resolutionWidth}px`;
  }
}
