import React, { useState } from 'react';
import { Column } from 'ag-grid-community';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import HelpIcon from '@material-ui/icons/Help';
import { Box, Tooltip, createStyles, makeStyles } from '@material-ui/core';
import HeaderTooltip from './HeaderTootip';

export interface HeaderCompParamsModel {
  column: Column;

  displayName: string;

  enableSorting: boolean;

  enableMenu: boolean;

  progressSort(multiSort: boolean): void;

  setSort(sort: string, multiSort?: boolean): void;

  showColumnMenu(menuButton: HTMLElement): void;

  api: any;
}

interface HeaderRenderProps extends HeaderCompParamsModel {
  tooltipDescription?: string[];
  menuIcon: string;
}

interface SortStatusModel {
  ascSort: string;
  descSort: string;
  noSort: string;
}

const useStyles = makeStyles(() =>
  createStyles({
    noMaxWidth: {
      maxWidth: 'none',
    },
  }),
);

const HeaderRender: React.FC<HeaderRenderProps> = props => {
  const {
    column,
    displayName,
    enableSorting,
    enableMenu,
    setSort,
    showColumnMenu,
    tooltipDescription = [],
    menuIcon,
  } = props;

  const initialSortStatus = {
    ascSort: 'inactive',
    descSort: 'inactive',
    noSort: 'inactive',
  };

  const classes = useStyles();

  const [sortStatus, setSortStatus] = useState<SortStatusModel>(
    initialSortStatus,
  );

  const [menuRef, setMenuRef] = useState<null | HTMLElement>();

  const onSortChanged = () => {
    setSortStatus({
      ascSort: column.isSortAscending() ? 'active' : 'inactive',
      descSort: column.isSortDescending() ? 'active' : 'inactive',
      noSort:
        !column.isSortAscending() && !column.isSortDescending()
          ? 'active'
          : 'inactive',
    });
  };

  React.useEffect(() => {
    column.addEventListener('sortChanged', onSortChanged);
    onSortChanged();
  }, []);

  const onMenuClicked = () => {
    if (menuRef) {
      showColumnMenu(menuRef);
    }
  };

  const menuContent = (
    <div
      ref={menuButton => {
        setMenuRef(menuButton);
      }}
      className="customHeaderMenuButton"
      onClick={onMenuClicked}
      onKeyDown={onMenuClicked}
      role="button"
      tabIndex={0}
    >
      <i className={`fa ${menuIcon}`} />
    </div>
  );

  const sortContent = (
    <>
      {sortStatus.ascSort === 'active' && <ArrowUpwardIcon />}
      {sortStatus.descSort === 'active' && <ArrowDownwardIcon />}
    </>
  );

  const handleSort = (event: React.MouseEvent<HTMLElement>) => {
    if (column.isSortAscending()) {
      setSort('desc', event.shiftKey);
      return;
    }
    if (column.isSortDescending()) {
      setSort('', event.shiftKey);
      return;
    }
    if (!column.isSortDescending() && !column.isSortAscending()) {
      setSort('asc', event.shiftKey);
    }
  };

  return (
    <Box onClick={handleSort} display="flex" alignItems="center">
      {enableMenu && menuContent}
      <Box mr={1}>{displayName}</Box>
      {enableSorting && sortContent}
      {tooltipDescription.length ? (
        <Tooltip
          classes={{ tooltip: classes.noMaxWidth }}
          title={<HeaderTooltip description={tooltipDescription} />}
        >
          <HelpIcon />
        </Tooltip>
      ) : null}
    </Box>
  );
};

export default HeaderRender;
