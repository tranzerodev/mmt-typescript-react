import React from 'react';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import {
  Divider,
  Checkbox,
  ListItem,
  Box,
  Typography,
  makeStyles,
  createStyles,
  Theme,
  FormControl,
  FormControlLabel,
} from '@material-ui/core';
import { Endpoint } from '../../store/endpoints/types';
import { Package } from '../../store/packages/types';
import { Campaign } from '../../store/campaigns/types';
import { CREATE_CAMPAIGN_FLOW } from '../../constants/stringConsts';

interface AutoSizerProps {
  height: number;
  width: number;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    checkboxContainer: { marginLeft: 0 },
    endpointListItem: {
      paddingLeft: 0,
    },
    evenRow: { backgroundColor: theme.palette.background.default },
    oddRow: {},
  }),
);

interface EndpointListSelectionProps {
  endpoints: Endpoint[];
  data: Campaign | Package;
  onUpdate: (updatedFields: any) => void;
}
const EndpointListSelection: React.FC<EndpointListSelectionProps> = ({
  endpoints,
  onUpdate,
  data,
}) => {
  const classes = useStyles();

  const handleEndpointSelectionChanged = (event: any, ep: Endpoint) => {
    const { checked } = event.target;
    onUpdate({
      endpointIds: checked
        ? data.endpointIds.concat([ep.endpointId])
        : data.endpointIds.filter((eid: string) => ep.endpointId !== eid),
    });
  };

  const renderEndpointCheckboxItem = (props: ListChildComponentProps) => {
    const { index, style } = props;

    return (
      <ListItem
        className={classes.endpointListItem}
        style={style}
        key={index}
        button
      >
        <FormControlLabel
          control={
            <Checkbox
              className={classes.checkboxContainer}
              onChange={(_: any) => {
                handleEndpointSelectionChanged(_, endpoints[index]);
              }}
              edge="start"
              color="default"
              checked={data.endpointIds.includes(endpoints[index].endpointId)}
            />
          }
          label={`${endpoints[index].externalId} ${
            endpoints[index].groupSize !== undefined &&
            endpoints[index].groupSize > 1
              ? `(${endpoints[index].groupSize} Displays)`
              : ''
          }`}
        />
      </ListItem>
    );
  };

  return (
    <FormControl margin="normal" fullWidth>
      <Typography variant="h6">Endpoints</Typography>
      <Box pt={1}>
        {!endpoints || endpoints.length === 0 ? (
          <Typography variant="body1">
            {CREATE_CAMPAIGN_FLOW.ENDPOINT_LIST_PLACEHOLDER}
          </Typography>
        ) : (
          <>
            <FormControlLabel
              className={classes.checkboxContainer}
              control={
                <Checkbox
                  onChange={(event: any) =>
                    onUpdate({
                      endpointIds: event.target.checked
                        ? endpoints.map((e: Endpoint) => e.endpointId)
                        : [],
                    })
                  }
                  edge="start"
                  color="default"
                  checked={endpoints.length === data.endpointIds.length}
                  indeterminate={
                    data.endpointIds.length > 0 &&
                    endpoints.length !== data.endpointIds.length
                  }
                />
              }
              label="Select All"
            />
            <Divider />
            <Box height={300}>
              <AutoSizer>
                {({ height, width }: AutoSizerProps) => (
                  <List
                    height={height}
                    itemSize={40}
                    itemCount={endpoints.length}
                    width={width}
                  >
                    {renderEndpointCheckboxItem}
                  </List>
                )}
              </AutoSizer>
            </Box>
          </>
        )}
      </Box>
    </FormControl>
  );
};

export default EndpointListSelection;
