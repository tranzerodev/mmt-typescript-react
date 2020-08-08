import * as React from 'react';
import { Box } from '@material-ui/core';

interface PackageSummaryProps {
  name: string;
  dmas: string[];
}

const PackageSummary: React.FC<PackageSummaryProps> = ({ name, dmas }) => (
  <>
    <Box pt={2.5} pb={1.25} display="flex">
      <Box
        component="span"
        pr={17.5}
        fontSize={35}
        lineHeight={1}
        minWidth={220}
      >
        {name}
      </Box>
    </Box>
    <Box>
      <Box>
        {dmas.map(dma => (
          <Box key={dma}>{dma}</Box>
        ))}
      </Box>
    </Box>
  </>
);

export default PackageSummary;
