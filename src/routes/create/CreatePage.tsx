import * as React from 'react';
import moment from 'moment';
import Typography from '@material-ui/core/Typography';
import { connect, ConnectedProps } from 'react-redux';
import { PreferenceTab } from '../../components/Create';
import { AllClientSelectValue } from '../../components/Create/ClientSelect';
import { PageContent, LoadingContainer } from '../../components/UI';
import { Spinner } from '../../components/Loading';
import { RouteContext } from '../../context';
import {
  createPackage,
  updatePackage as updatePackageAction,
  getPackagesForUser,
} from '../../store/packages/actions';
import {
  createCampaign,
  updateCampaign as updateCampaignAction,
  getCampaigns,
} from '../../store/campaigns/actions';
import { getEndpoints } from '../../store/endpoints/actions';
import { Package } from '../../store/packages/types';
import { Campaign } from '../../store/campaigns/types';
import { Endpoint, EndpointParam } from '../../store/endpoints/types';
import * as ReduxType from '../../store/reduxTypes';
import { DEFAULT_PERFORMACE_MODULES } from '../../constants/performanceConsts';

interface ParamProps {
  type: string;
  id: string;
}

const entityMonitoringFields = [
  'dmas',
  'regions',
  'endpointTypes',
  'startDate',
  'endDate',
];

const defaultClient = AllClientSelectValue;
const defaultStartDate = moment()
  .startOf('day')
  .format('MM/DD/YYYY');
const defaultEndDate = moment()
  .add(30, 'd')
  .endOf('day')
  .format('MM/DD/YYYY');

const initialCampaign: Campaign = {
  id: '',
  advertiserId: '',
  name: '',
  source: 'Lightout',
  status: '',
  campaignName: '',
  customer: defaultClient,
  createdDate: '',
  updatedDate: '',
  performanceModules: [],
  dmas: [],
  formats: [],
  endpointTypes: [],
  regions: [],
  budget: 0,
  hours: 0,
  startDate: defaultStartDate,
  endDate: defaultEndDate,
  creativeUrls: [],
  endpointIds: [],
};

const initialPackage: Package = {
  id: '',
  name: '',
  ownerId: '',
  live: false,
  section: '',
  dmas: [],
  customer: defaultClient,
  startDate: defaultStartDate,
  endDate: defaultEndDate,
  budget: 0,
  hours: 0,
  impressions: 0,
  categories: [],
  endpointTypes: [],
  performanceModules: DEFAULT_PERFORMACE_MODULES,
  regions: [],
  about: '',
  imagesPrimary: [],
  imagesSecondary: [],
  endpointIds: [],
};

const mapStateToProps = (state: ReduxType.RootState) => ({
  userId: state.user.id,
  campaigns: state.campaigns.data,
  packages: state.packages.items,
  endpoints: state.endpoints.items,
  loadedPackages: state.packages.loadedPackages,
  isPackagesLoading: state.packages.isLoading,
  updatingPackages: state.packages.updatingPackage,
  loadedCampaigns: state.campaigns.isListLoaded,
  isCampaignsLoading: state.campaigns.isLoading,
  updatingCampaigns: state.campaigns.updating,
});

const mapDispatchToProps = (dispatch: ReduxType.AppThunkDispatch) => ({
  newPackage: (newPackage: Package) => dispatch(createPackage(newPackage)),
  newCampaign: (newCampaign: Campaign) => dispatch(createCampaign(newCampaign)),
  updateCampaign: (updatedCampaign: Campaign) =>
    dispatch(updateCampaignAction(updatedCampaign)),
  updatePackage: (updatedPackage: Package) =>
    dispatch(updatePackageAction(updatedPackage)),
  loadEndpoints: (params: EndpointParam, isInitalItems: boolean) =>
    dispatch(getEndpoints(params, isInitalItems)),
  loadCampaignList: () => {
    dispatch(getCampaigns());
  },
  getPackages: () => dispatch(getPackagesForUser()),
});

const connector = connect(
  mapStateToProps,
  mapDispatchToProps,
);

type PropsFromRedux = ConnectedProps<typeof connector>;

const CreatePage: React.FC<PropsFromRedux> = ({
  packages,
  campaigns,
  endpoints,
  newPackage,
  newCampaign,
  loadedPackages,
  isPackagesLoading,
  loadedCampaigns,
  isCampaignsLoading,
  updateCampaign,
  updatePackage,
  updatingPackages,
  updatingCampaigns,
  loadEndpoints,
  getPackages,
  loadCampaignList,
}) => {
  const { query } = React.useContext(RouteContext);
  const { type, id } = query as ParamProps;
  const isCampaignEntity = type === 'campaign';

  let packageItemId: string | undefined;

  const [itemFound, setItemFound] = React.useState(true);
  const [campaign, setCampaign] = React.useState(initialCampaign);
  const [campaignPackage, setPackage] = React.useState(initialPackage);

  React.useEffect(() => {
    if (endpoints.length > 0) {
      let endpointIds = [];
      if (id) {
        endpointIds = endpoints
          .filter((e: Endpoint) => e.assignedTo && e.assignedTo.includes(id))
          .map((e: Endpoint) => e.endpointId);

        if (isCampaignEntity) {
          setCampaign({ ...campaign, ...{ endpointIds } });
        } else {
          setPackage({
            ...campaignPackage,
            ...{ endpointIds },
          });
        }
      }
    }
  }, [endpoints]);

  const handlePackageEndpoints = (record: Package) => {
    if (!record) return;
    const { dmas, regions, endpointTypes } = record;
    const startDate = moment(new Date(record.startDate)).format();
    const endDate = moment(new Date(record.endDate)).format();
    const params = {
      dmas,
      regions,
      endpointTypes,
      startDate,
      endDate,
    };
    const isRequiredParams =
      (dmas.length || regions.length) && endpointTypes.length;
    loadEndpoints(params, isRequiredParams === 0);
  };
  const handlePackageUpdated = (updatedFields: Package) => {
    const updatingFields = Object.keys(updatedFields);
    const isImageUpdate = updatingFields.includes('imagesPrimary');
    const updatingItem = { ...campaignPackage, ...updatedFields };
    if (isImageUpdate) {
      let images = updatedFields.imagesPrimary;
      const secondImages = updatedFields.imagesSecondary;
      if (secondImages && secondImages.length > 0) {
        images = [...images, ...updatedFields.imagesSecondary];
      }
      if (images && images.length > 0) {
        const primaryImage = images[0];
        if (primaryImage !== undefined) {
          setPackage({
            ...updatingItem,
            imagesPrimary: [primaryImage],
            imagesSecondary: images.slice(1),
          });
        }
      }
    }
    if (
      entityMonitoringFields.some((monitoringField: string) =>
        updatingFields.includes(monitoringField),
      )
    ) {
      handlePackageEndpoints(updatingItem);
    }
  };

  const handleCampaignEndpoints = (record: Campaign) => {
    if (!record) return;
    const { dmas, regions, endpointTypes } = record;
    const startDate = moment(new Date(record.startDate)).format();
    const endDate = moment(new Date(record.endDate)).format();
    const params = { dmas, regions, endpointTypes, startDate, endDate };
    const isRequiredParams =
      (dmas.length || regions.length) && endpointTypes.length;
    loadEndpoints(params, isRequiredParams === 0);
  };

  const handleCampaignUpdated = (updatedFields: Campaign) => {
    const updatingItem = { ...campaign, ...updatedFields };
    const updatingFields = Object.keys(updatedFields);
    if (
      entityMonitoringFields.some((monitoringField: string) =>
        updatingFields.includes(monitoringField),
      )
    ) {
      handleCampaignEndpoints(updatingItem);
    }
    setCampaign(updatingItem);
  };

  React.useEffect(() => {
    // if there is an Id in params try to find item
    if (id) {
      if (isCampaignEntity) {
        const existingCampaign = campaigns.find(
          (c: Campaign) => (c.campaignName || c.id) === id,
        );
        if (existingCampaign) {
          handleCampaignUpdated(existingCampaign);
          const { packageId } = existingCampaign;
          packageItemId = packageId;
        } else if (!loadedCampaigns && !isCampaignsLoading) {
          loadCampaignList();
        }
      } else {
        packageItemId = id;
        if (packages.length) {
          const existingPackage = packages.find(p => p.id === packageItemId);
          if (existingPackage) {
            setItemFound(true);
            handlePackageUpdated(existingPackage);
            return;
          }
        } else if (!loadedPackages && !isPackagesLoading) {
          setItemFound(false);
          getPackages();
          return;
        }
      }
      setItemFound(true);
    } else {
      loadEndpoints({} as EndpointParam, true);
    }
  }, [id, type, packages]);

  React.useEffect(() => {
    if (id && campaigns.length && isCampaignEntity) {
      const existingCampaign = campaigns.find(
        (c: Campaign) => (c.campaignName || c.id) === id,
      );
      if (existingCampaign) {
        setItemFound(true);
        handleCampaignUpdated(existingCampaign);
        const { packageId } = existingCampaign;
        packageItemId = packageId;
      } else {
        setItemFound(false);
      }
    }
  }, [campaigns]);

  const handleSubmit = () => {
    if (!isCampaignEntity) {
      if (!id && campaignPackage) {
        newPackage(campaignPackage);
      } else if (id && campaignPackage) {
        updatePackage(campaignPackage);
      }
    } else if (!id && campaign) {
      newCampaign(campaign);
    } else if (id && campaign) {
      updateCampaign(campaign);
    }
  };

  const getSummaryData = () => {
    const summaryData = {
      numEndpoints: 0,
      numScreens: 0,
      totalHours: 0,
      availableHours: 0,
      impressions: 0,
      CPH: 0,
      CPM: 0,
    };

    const endpointIds = isCampaignEntity
      ? campaign.endpointIds
      : campaignPackage.endpointIds;

    const endpointIdSelected: Record<string, boolean> = {};
    endpointIds.forEach(i => {
      endpointIdSelected[i] = true;
    });

    const itemHours = isCampaignEntity ? campaign.hours : campaignPackage.hours;
    const itemBudget = isCampaignEntity
      ? campaign.budget || 0
      : campaignPackage.budget;

    let aggregatedImpressionRate = 0;
    let aggregatedTotalHours = 0;
    let aggregatedAvailableHours = 0;
    let aggregatedNumEndpoints = 0;
    let aggregatedNumScreens = 0;
    endpoints.forEach((e: Endpoint) => {
      if (!endpointIdSelected[e.endpointId]) {
        return;
      }

      aggregatedTotalHours += e.totalHours;
      aggregatedAvailableHours += e.availableHours;
      aggregatedImpressionRate += e.hourlyImpressions;
      aggregatedNumEndpoints += 1;
      aggregatedNumScreens += e.groupSize || 1;
    });
    const avgHourlyImpressionRate = aggregatedImpressionRate / endpoints.length;
    const aggregatedImpressions = avgHourlyImpressionRate * itemHours;

    summaryData.numEndpoints = aggregatedNumEndpoints;
    summaryData.numScreens = aggregatedNumScreens;
    summaryData.CPH = !itemHours ? 0 : itemBudget / itemHours;
    summaryData.CPM = !aggregatedImpressions
      ? 0
      : itemBudget / (aggregatedImpressions / 1000);
    summaryData.impressions = aggregatedImpressions;
    summaryData.totalHours = aggregatedTotalHours;
    summaryData.availableHours = aggregatedAvailableHours;
    return summaryData;
  };

  if (updatingPackages || updatingCampaigns) {
    return (
      <LoadingContainer>
        <Spinner />
      </LoadingContainer>
    );
  }

  const content = !itemFound ? (
    <Typography variant="h6">Item not found</Typography>
  ) : (
    <PreferenceTab
      type={type}
      data={isCampaignEntity ? campaign : campaignPackage}
      endpoints={endpoints}
      onUpdate={isCampaignEntity ? handleCampaignUpdated : handlePackageUpdated}
      onSubmit={handleSubmit}
      summaryData={getSummaryData()}
    />
  );

  return <PageContent>{content}</PageContent>;
};

export default connector(CreatePage);
