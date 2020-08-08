export default class QueryStringUtils {
  static updateQueryStringParameter(uri, key, value) {
    const re = new RegExp(`([?&])${key}=.*?(&|$)`, 'i');
    const separator = uri.indexOf('?') !== -1 ? '&' : '?';
    if (uri.match(re)) {
      return uri.replace(re, `$1${key}=${value}$2`);
    }

    return `${uri}${separator}${key}=${value}`;
  }

  static updateSearchStringParameters(search, key, value) {
    const re = new RegExp(`([?&])${key}=.*?(&|$)`, 'i');
    if (search.match(re)) {
      if (!value && value !== 0) {
        return search.replace(re, '$2');
      }

      return search.replace(re, `$1${key}=${value}$2`);
    }

    return search;
  }
}
