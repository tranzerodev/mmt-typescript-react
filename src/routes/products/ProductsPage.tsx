import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import Divider from '@material-ui/core/Divider';
import { Typography } from '@material-ui/core';
import ProductSummaryTable from '../../components/Products';
import {
  PageContent,
  FullCard,
  DenseCardContent,
  TableTitle,
  PageTitle,
} from '../../components/UI';
import { loadOptions } from '../../store/options/actions';
import * as ReduxType from '../../store/reduxTypes';

const mapStateToProps = (state: ReduxType.RootState) => ({
  endpointTypes: state.options.data.types,
  loadedProducts: state.options.loaded,
  isLoading: state.options.loading,
});

const mapDispatchToProps = (dispatch: ReduxType.AppThunkDispatch) => ({
  loadEndpointsByUser: () => dispatch(loadOptions()),
});

const connector = connect(
  mapStateToProps,
  mapDispatchToProps,
);

type PropsFromRedux = ConnectedProps<typeof connector>;

const ProductsPage: React.FC<PropsFromRedux> = props => {
  const { endpointTypes, loadedProducts, isLoading } = props;
  React.useEffect(() => {
    if (!loadedProducts && !isLoading) {
      props.loadEndpointsByUser();
    }
  }, []);
  return (
    <PageContent>
      <PageTitle title="Products" />
      <FullCard variant="outlined">
        <DenseCardContent>
          <ProductSummaryTable
            products={endpointTypes}
            loadedProducts={loadedProducts}
          />
        </DenseCardContent>
      </FullCard>
    </PageContent>
  );
};

export default connector(ProductsPage);
