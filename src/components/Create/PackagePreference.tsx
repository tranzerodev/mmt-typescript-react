import * as React from 'react';
import moment from 'moment';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@material-ui/core';
import NameInput from './NameInput';
import DateRangePicker from './DateRangePicker';
import ProductsSelect from './ProductsSelect';
import DmasSelect from './DmasSelect';
import PerfModulesSelect from './PerfModulesSelect';
import PriceInput from './PriceInput';
import HoursSelect from './HoursSelect';
import { Package } from '../../store/packages/types';
import { Options } from '../../store/options/types';
import PackageCreativeUpload from '../PackageCreativeUpload/PackageCreativeUpload';
import SectionSelect from './SectionSelector';
import EndpointSelectionList from './EndpointSelectionList';
import CompanySelection from '../Client/CompanySelection';
import { AllClientSelectValue } from './ClientSelect';
import { Endpoint } from '../../store/endpoints/types';

const dateFormat = 'MM/DD/YYYY';
const defaultStartDate = moment()
  .startOf('day')
  .format(dateFormat);
const defaultEndDate = moment()
  .add(30, 'd')
  .endOf('day')
  .format(dateFormat);

type PackageEditProps = {
  data: Package;
  summaryData: {
    numEndpoints: number;
    availableHours: number;
    totalHours: number;
    impressions: number;
    CPH: number;
    CPM: number;
  };
  endpoints: Endpoint[];
  campaignOptions: Options;
  onUpdate: (updatedFields: any) => void;
  isUploading: boolean;
  toggleLoading: (value: boolean) => void;
};

const initialClientOptions = [
  {
    companyId: AllClientSelectValue,
    companyName: 'All',
  },
];

const proposalTypeEnabled = false;
const PackageEdit: React.FC<PackageEditProps> = props => {
  const {
    data,
    summaryData,
    endpoints,
    campaignOptions,
    onUpdate,
    toggleLoading,
    isUploading,
  } = props;

  const isMoving = data.source === 'Moving Endpoints';
  const { dmas: dmaOptions = [], types: productOptions = [] } =
    campaignOptions || {};
  const pModules =
    data.performanceModules && data.performanceModules.length
      ? data.performanceModules
      : [];

  const handleTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    onUpdate({ type: event.target.value as string });
  };

  const handleDesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = event;
    target.style.height = `${target.scrollHeight}px`;
    onUpdate({ about: event.target.value });
  };

  const packageType = (
    <Select
      labelId="select-type-label"
      value={data.type || 'Static Endpoints'}
      onChange={handleTypeChange}
    >
      <MenuItem value="Static Endpoints">Static Endpoints</MenuItem>
      <MenuItem value="Moving Endpoints">Moving Endpoints</MenuItem>
    </Select>
  );

  return (
    <>
      <NameInput
        htmlId="package-input-name"
        label="Proposal Name"
        value={data.name}
        fieldName="name"
        onUpdate={onUpdate}
      />
      {proposalTypeEnabled && (
        <FormControl margin="normal" fullWidth>
          <InputLabel id="select-type-label">Proposal Type</InputLabel>
          {packageType}
        </FormControl>
      )}
      <CompanySelection
        onUpdate={onUpdate}
        fieldName="customer"
        labelValue="Customer"
        defaultOptions={initialClientOptions}
        selectedClient={data.customer}
      />
      <SectionSelect
        htmlId="package-section"
        selectedCustomer={data.customer}
        selectedSection={data.section}
        onUpdate={onUpdate}
        fieldName="section"
      />
      <DateRangePicker
        startDateField="startDate"
        endDateField="End"
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
      <TextField
        id="package-input-description"
        label="Description"
        margin="normal"
        value={data.about}
        onChange={handleDesChange}
        multiline
        fullWidth
      />
      <FormControl margin="normal" fullWidth>
        <Typography variant="h6">Images</Typography>
        <PackageCreativeUpload
          images={[...data.imagesPrimary, ...data.imagesSecondary]}
          packageCreativeType="imagesPrimary"
          onUpdate={onUpdate}
          isUploading={isUploading}
          toggleLoading={toggleLoading}
        />
      </FormControl>
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
        entityType="package"
        values={pModules || []}
        fieldName="performanceModules"
        onUpdate={onUpdate}
      />
      <PriceInput
        htmlId="package-input-price"
        price={data.budget}
        fieldName="budget"
        onUpdate={onUpdate}
      />
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

export default PackageEdit;
