import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  Box,
  Button,
  Grid,
  Divider,
  Theme,
  withStyles,
} from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import * as ReduxType from '../../store/reduxTypes';
import { loadOptions } from '../../store/options/actions';
import RegionMapList from '../PackageCampaign/RegionMapList';
import PackageRegionMap from '../PackageCampaign/PackageRegionMap';
import { Campaign } from '../../store/campaigns/types';
import { Package } from '../../store/packages/types';
import CampaignEdit from './CampaignPreference';
import PackageEdit from './PackagePreference';
import OptionsUtils from '../../utils/OptionsUtils';
import { Endpoint } from '../../store/endpoints/types';
import { SummaryDataType } from './CreateTypes';
import SummaryData from './SummaryData';

const styles = (theme: Theme) => ({
  stickyContainer: {
    position: 'fixed',
    width: '40%',
    top: '70px',
    [theme.breakpoints.down('md')]: {
      position: 'relative',
      width: '100%',
      top: 0,
    },
  },
});

const GridContainer = styled(Grid)({
  minHeight: 0,
});

const GridItem = styled(Grid)({
  padding: '0 20px',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
});

interface PreferenceTabProps {
  type: string;
  data: Campaign | Package;
  endpoints: Endpoint[];
  summaryData: SummaryDataType;
  onUpdate: (updatedFields: any) => void;
  onSubmit: () => void;
  classes?: any;
}

interface PreferenceTabState {
  isUploading: boolean;
}

const mapStateToProps = (state: ReduxType.RootState) => ({
  userId: state.user.id,
  loadedOptions: state.options.loaded,
  campaignOptions: state.options.data,
});

const mapDispatchToProps = (dispatch: ReduxType.AppThunkDispatch) => ({
  initializaCampaignOptions: () => dispatch(loadOptions()),
});

const connector = connect(
  mapStateToProps,
  mapDispatchToProps,
);

type PropsFromRedux = ConnectedProps<typeof connector>;

class PreferenceTab extends React.Component<
  PropsFromRedux & PreferenceTabProps,
  PreferenceTabState
> {
  constructor(props: PreferenceTabProps) {
    super(props);
    this.state = {
      isUploading: false,
    };
  }

  componentDidMount() {
    const { loadedOptions, initializaCampaignOptions } = this.props;
    if (!loadedOptions) {
      initializaCampaignOptions();
    }
  }

  toggleLoading = (value: boolean) => {
    this.setState({ isUploading: value });
  };

  handleSaveClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const { onSubmit } = this.props;
    onSubmit();
  };

  renderMap = () => {
    const { data, campaignOptions, type } = this.props;
    const isCampaignEntity = type === 'campaign';

    const optionUtils = new OptionsUtils(campaignOptions);
    const dmaIds = isCampaignEntity
      ? (data as Campaign).dmas
      : (data as Package).dmas;
    const dmaItems = optionUtils.GetDmaItemsByIds(dmaIds || []);
    return (
      <Box mt={2}>
        {data.regions && data.regions.length ? (
          <PackageRegionMap regions={data.regions || []} />
        ) : (
          <RegionMapList data={dmaItems || []} />
        )}
      </Box>
    );
  };

  render() {
    const {
      type,
      data,
      summaryData,
      campaignOptions,
      endpoints,
      onUpdate,
    } = this.props;
    const { isUploading } = this.state;
    const isCampaignEntity = type === 'campaign';
    const { classes } = this.props;

    return (
      <>
        <GridContainer container>
          <GridItem item md={6} xs={12}>
            {isCampaignEntity ? (
              <CampaignEdit
                onUpdate={onUpdate}
                data={data as Campaign}
                endpoints={endpoints}
                summaryData={summaryData}
                campaignOptions={campaignOptions}
              />
            ) : (
              <PackageEdit
                toggleLoading={this.toggleLoading}
                isUploading={isUploading}
                onUpdate={onUpdate}
                data={data as Package}
                endpoints={endpoints}
                summaryData={summaryData}
                campaignOptions={campaignOptions}
              />
            )}
          </GridItem>
          <GridItem item md={6} xs={12}>
            <Box className={classes.stickyContainer}>
              {this.renderMap()}
              <Divider />
              <SummaryData summaryData={summaryData} />
            </Box>
          </GridItem>
          <GridItem item xs={12}>
            <Box display="flex" justifyContent="center" py={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleSaveClicked}
                disableElevation
                disabled={!isCampaignEntity && isUploading}
                id="create-save"
              >
                Save
              </Button>
            </Box>
          </GridItem>
        </GridContainer>
      </>
    );
  }
}

export default connector(withStyles(styles)(PreferenceTab));
