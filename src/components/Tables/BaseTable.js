import React, { PureComponent } from 'react';
import ReactTable from 'react-table';
import treeTableHOC from 'react-table/lib/hoc/treeTable';
import ReactTableCss from 'react-table/react-table.css';
import withStyles from 'isomorphic-style-loader/withStyles';

const TreeTable = treeTableHOC(ReactTable);

class BaseTable extends PureComponent {
  render() {
    return <TreeTable {...this.props} />;
  }
}

export default withStyles(ReactTableCss)(BaseTable);
