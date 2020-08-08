import * as React from 'react';
import moment from 'moment';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import * as DataType from '../../constants/dataTypes';
import NameInput from './NameInput';
import DateRangePicker from './DateRangePicker';
import ProductsSelect from './ProductsSelect';
import DmasSelect from './DmasSelect';
import PerfModulesSelect from './PerfModulesSelect';
import PriceInput from './PriceInput';
import HoursSelect from './HoursSelect';
import { Campaign } from '../../store/campaigns/types';
import { Options } from '../../store/options/types';
import CompanySelection from '../Client/CompanySelection';
import EndpointSelectionList from './EndpointSelectionList';
import { Endpoint } from '../../store/endpoints/types';

const dateFormat = 'MM/DD/YYYY';
const defaultStartDate = moment()
  .startOf('day')
  .format(dateFormat);
const defaultEndDate = moment()
  .add(30, 'd')
  .endOf('day')
  .format(dateFormat);

type CampaignEditProps = {
  data: Campaign;
  summaryData: {
    numEndpoints: number;
    availableHours: number;
    totalHours: number;
    impressions: number;
    CPH: number;
    CPM: number;
  };
  campaignOptions: Options;
  endpoints: Endpoint[];
  onUpdate: (updatedFields: any) => void;
};

const CampaignEdit: React.FC<CampaignEditProps> = props => {
  const { data, summaryData, campaignOptions, onUpdate, endpoints } = props;

  const isMoving = data.source === 'Moving Endpoints';
  const { dmas: dmaOptions = [], types: productOptions = [] } =
    campaignOptions || {};
  const pModules =
    data.performanceModules && data.performanceModules.length
      ? (data.performanceModules as Array<
          DataType.CampaignPerformanceModule
        >).map((item: DataType.CampaignPerformanceModule) => item.id)
      : [];

  const handleSourceChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    onUpdate({ source: event.target.value as string });
  };

  const campaignSource = (
    <Select
      labelId="select-type-label"
      value={data.source}
      onChange={handleSourceChange}
    >
      <MenuItem value="Lightout">Lightout</MenuItem>
      <MenuItem value="External">External</MenuItem>
    </Select>
  );

  return (
    <>
      <NameInput
        label="Campaign Name"
        value={data.name}
        fieldName="name"
        onUpdate={onUpdate}
      />
      <FormControl margin="normal" fullWidth>
        <InputLabel id="select-type-label">Campaign Source</InputLabel>
        {campaignSource}
      </FormControl>
      <CompanySelection
        onUpdate={onUpdate}
        selectedClient={data.customer}
        fieldName="customer"
        labelValue="Client"
      />
      <DateRangePicker
        startDateField="startDate"
        endDateField="endDate"
        startValue={moment(
          !data.startDate
            ? new Date(defaultStartDate)
            : new Date(data.startDate),
          dateFormat,
        )}
        endValue={moment(
          !data.endDate ? new Date(defaultEndDate) : new Date(data.endDate),
          dateFormat,
        )}
        onUpdate={onUpdate}
      />
      <ProductsSelect
        productOptions={productOptions}
        values={data.endpointTypes || []}
        fieldName="endpointTypes"
        isMoving={isMoving}
        onUpdate={onUpdate}
      />
      <DmasSelect
        dmaOptions={dmaOptions}
        values={data.dmas || []}
        fieldName="dmas"
        onUpdate={onUpdate}
      />
      <EndpointSelectionList
        endpoints={endpoints}
        data={data}
        onUpdate={onUpdate}
      />
      <PerfModulesSelect
        entityType="campaign"
        values={pModules || []}
        fieldName="performanceModules"
        onUpdate={onUpdate}
      />
      <PriceInput price={data.budget} fieldName="budget" onUpdate={onUpdate} />
      <HoursSelect
        selectedHours={data.hours}
        availableHours={summaryData.availableHours}
        totalHours={summaryData.totalHours}
        onUpdate={onUpdate}
        fieldName="hours"
      />
    </>
  );
};

export default CampaignEdit;
