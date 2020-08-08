import React, { useState } from 'react';
import { Box } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { useSelector } from 'react-redux';
import * as ReduxType from '../../store/reduxTypes';
import { Options } from '../../store/options/types';
import OptionsUtils from '../../utils/OptionsUtils';
import { Endpoint } from '../../store/endpoints/types';

interface PackageCategoryDetailsProps {
  data: Endpoint[];
}

interface Category {
  id: string;
  Name: string;
  Description: string;
  data: any;
}

const PackageCategoryDetails: React.FC<PackageCategoryDetailsProps> = ({
  data,
}) => {
  const [details, setDetails] = useState<Category[]>([]);

  const options = useSelector<ReduxType.RootState, Options>(
    state => state.options.data,
  );

  React.useEffect(() => {
    const optionUtils = new OptionsUtils(options);
    if (data && data.length) {
      const categoryIds = data.map(
        (endpoint: Endpoint) => endpoint.endpointCategory,
      );
      setDetails(optionUtils.GetCategoryItems(categoryIds || [], 'id'));
    }
  }, [options, data]);

  return (
    <Box>
      {details && details.length ? (
        details.map(({ id, Name, Description }) => (
          <Box
            key={id}
            width={500}
            p={0.75}
            borderRadius={10}
            mb={2.5}
            border={2}
          >
            <Box fontSize={20}>{Name}</Box>
            <Box>{Description}</Box>
          </Box>
        ))
      ) : (
        <Skeleton variant="rect" height={40} />
      )}
    </Box>
  );
};

export default PackageCategoryDetails;
