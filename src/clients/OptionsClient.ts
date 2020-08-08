import { API } from 'aws-amplify';

type OptionTypes = 'categories' | 'dmas' | 'types';

interface OptionDataVal {
  id: string;
  fields: {};
}

interface OptionsResult {
  status: string;
  data: { [key in OptionTypes]: OptionDataVal[] };
}

export default class OptionsClient {
  static async getOptions() {
    const result: OptionsResult = await API.get(
      'LightoutApi',
      '/data/options',
      {},
    );
    const { data } = result;
    const options: { [key: string]: any } = {};
    Object.entries(data).forEach(([optionType, values]) => {
      const optionValues = values.map(val => ({ id: val.id, ...val.fields }));
      options[optionType] = optionValues;
    });

    return options;
  }
}
