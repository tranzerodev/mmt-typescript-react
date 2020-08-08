import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Geosuggest from 'react-geosuggest';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './AddressSuggest.css';

class AddressSuggest extends Component {
  static propTypes = {
    clearOnSelect: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
  };

  static defaultProps = { clearOnSelect: false };

  onSuggestSelect = suggest => {
    if (!suggest) {
      return;
    }

    this.props.onSubmit(suggest);
    if (this.props.clearOnSelect) {
      this.geoSuggest.clear();
    }
  };

  render() {
    return (
      <Geosuggest
        ref={el => {
          this.geoSuggest = el;
        }}
        className={s.searchContainer}
        inputClassName={s.input}
        suggestsClassName={s.suggest}
        suggestsHiddenClassName={s.hiddenSuggest}
        suggestItemClassName={s.suggestItem}
        suggestItemActiveClassName={s.activeSuggestItem}
        placeholder="Enter Address"
        country="us"
        onSuggestSelect={this.onSuggestSelect}
      />
    );
  }
}

export default withStyles(s)(AddressSuggest);
