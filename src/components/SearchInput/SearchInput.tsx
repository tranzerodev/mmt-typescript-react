import * as React from 'react';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { Paper, Box, InputBase } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme: Theme) => ({
  search: {
    flexGrow: 1,
    height: 42,
    padding: theme.spacing(0, 2),
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    marginRight: theme.spacing(2),
  },
  searchInput: {
    flexGrow: 1,
  },
}));

function SearchInput({
  handleChange,
  searchLabel = '',
  placeholderPrefix = 'Search',
  width = '500px',
}: {
  handleChange: (value: string) => void;
  searchLabel?: string;
  placeholderPrefix?: string;
  width?: string;
}) {
  const classes = useStyles();

  const handleKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event && event.target) {
      return handleChange(event.target.value);
    }
    return handleChange('');
  };
  return (
    <Box width={width} display="flex">
      <Paper className={classes.search} elevation={2}>
        <SearchIcon className={classes.searchIcon} />
        <InputBase
          className={classes.searchInput}
          placeholder={`${placeholderPrefix} ${searchLabel}`}
          onChange={handleKeyChange}
          id="search-resources"
        />
      </Paper>
    </Box>
  );
}

export default SearchInput;
