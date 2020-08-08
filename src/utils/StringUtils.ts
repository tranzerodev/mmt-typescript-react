export default class StringUtils {
  static RemoveSpaceFromString(value: string) {
    return value.replace(/ /gm, '');
  }
}
