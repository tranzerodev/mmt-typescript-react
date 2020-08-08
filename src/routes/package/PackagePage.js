import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Box } from '@material-ui/core';
import { PackagesClient } from '../../clients';
import { RouteContext } from '../../context';
import PackageCampaign from '../../components/PackageCampaign';
import Spinner from '../../components/Loading';
import OptionsUtils from '../../utils/OptionsUtils';
import { PageContent } from '../../components/UI';

function PackagePage({ reservingPackage, updating, loadedOptions, options }) {
  const { query } = useContext(RouteContext);
  const [packageItem, setPackageItem] = useState({ id: query.id });

  const loadFromQueryParams = async () => {
    if (!query.id || !loadedOptions) {
      // dont load package if required info is not available
      return;
    }

    const result = await PackagesClient.getPackageDetails(query.id);
    const { item, endpoints } = result;

    const optionUtils = new OptionsUtils(options);
    const dmaItems = optionUtils.GetDmaItemsByIds(item.dmas || []);

    const productItems = optionUtils.GetEndpointTypeItemsByIds(
      item.endpointTypes || [],
    );

    const categoryItems = optionUtils.GetCategoryItems(
      item.categories || [],
      'name',
    );

    const performanceMods = item.performanceModules || [];
    const performanceModItems = performanceMods.map(perfModId =>
      options.performanceModules.find(
        perfModItem => perfModItem.id === perfModId,
      ),
    );

    const dates = {
      startDate: item.startDate,
      endDate: item.endDate,
    };

    const price = item.budget;

    setPackageItem({
      ...item,
      categories: categoryItems,
      DMA: dmaItems,
      Performance: performanceModItems,
      Dates: dates,
      Price: price,
      EndpointTypes: productItems,
      Endpoints: endpoints,
    });
  };

  useEffect(() => {
    loadFromQueryParams();
  }, [loadedOptions]);

  const content =
    reservingPackage || updating ? (
      <Box width={1} display="flex" justifyContent="center" alignItems="center">
        <Spinner />
      </Box>
    ) : (
      <PackageCampaign
        campaignId={query.campaignId}
        packageItem={packageItem}
      />
    );
  return <PageContent noSpace>{content}</PageContent>;
}

PackagePage.propTypes = {
  reservingPackage: PropTypes.bool.isRequired,
  updating: PropTypes.bool.isRequired,
  options: PropTypes.shape({
    categories: PropTypes.array,
    types: PropTypes.array,
    dmas: PropTypes.array,
    performanceModules: PropTypes.array,
  }).isRequired,
  loadedOptions: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  reservingPackage: state.campaigns.reservingPackage,
  updating: state.campaigns.updating,
  options: state.options.data,
  loadedOptions: state.options.loaded,
});

export default connect(
  mapStateToProps,
  null,
)(PackagePage);
