import { Options, OptionKey } from '../store/options/types';

const ITEM = 'ITEM';

export default class OptionUtils {
  options: Options;

  constructor(options: Options) {
    this.options = options;
  }

  GetDmaItemsByIds(dmaIds: string[]) {
    return this.getOptionPropertyFromValues(dmaIds, 'dmas', ITEM);
  }

  GetDmaNames(dmaIds: string[]) {
    return this.getOptionPropertyFromValues(dmaIds, 'dmas', 'name');
  }

  GetEndpointTypeItemsByIds(endpointTypeIds: string[]) {
    return this.getOptionPropertyFromValues(endpointTypeIds, 'types', ITEM);
  }

  GetEndpointTypeNames(endpointTypeIds: string[]) {
    return this.getOptionPropertyFromValues(endpointTypeIds, 'types', 'Name');
  }

  GetCategoryItems(categoryValues: string[], valueType = 'id') {
    return this.getOptionPropertyFromValues(
      categoryValues,
      'categories',
      ITEM,
      valueType,
    );
  }

  GetPerformanceItemsByIds(performanceModIds: string[]) {
    return this.getOptionPropertyFromValues(
      performanceModIds,
      'performanceModules',
      ITEM,
    );
  }

  getOptionPropertyFromValues(
    values: string[],
    optionType: OptionKey,
    property: string,
    valueKey = 'id',
  ) {
    const optionValues = this.options[optionType];
    if (!optionValues.length) {
      return null;
    }

    if (property === ITEM) {
      return optionValues.filter((optionItem: any) =>
        values.includes(optionItem[valueKey]),
      );
    }
    if (values && values.length) {
      return values.map(val => {
        const propertyValues = optionValues.find(
          (field: any) => field[valueKey] === val,
        );
        if (propertyValues && property in propertyValues) {
          return propertyValues[property];
        }
        return null;
      });
    }
    return null;
  }
}
