import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Box } from '@material-ui/core';
import { PerformanceCard } from '../PerformanceCards';
import PerformanceCardData from '../../constants/performanceConsts';
import { userPropType } from '../../store/user/reducers';
import { openAuthModal } from '../../store/ui/actions';

function PerformanceTab({
  onUpdate,
  openSignupModal,
  supportedPerfModules,
  performanceModules,
  user,
}) {
  const [rows, setRows] = useState(3);

  const handledToggled = (performanceCardKey, event) => {
    const existingModule = performanceModules.find(
      m => m.id === performanceCardKey,
    );
    let newModules = performanceModules.slice();
    if (user.isUnAuth) {
      openSignupModal();
    }

    // const existingModule = newModules.filter(m => m.id === performanceCardKey).length > 0;
    if (event.target.checked) {
      if (existingModule && 'selected' in existingModule) {
        newModules = newModules.filter(m => m.id !== performanceCardKey);
        newModules.push({
          ...existingModule,
          selected: true,
        });
      } else {
        newModules.push({
          id: performanceCardKey,
        });
      }
    } else {
      newModules = newModules.filter(m => m.id !== performanceCardKey);
      if (existingModule && 'selected' in existingModule) {
        newModules.push({
          ...existingModule,
          selected: false,
        });
      }
    }

    onUpdate({
      performanceModules: newModules,
    });
  };

  const handleModuleUpdated = (performanceCardKey, moduleData) => {
    let newModules = performanceModules.slice();
    const moduleIsSetup =
      newModules.filter(m => m.id === performanceCardKey).length > 0;
    if (moduleIsSetup) {
      newModules = newModules.filter(m => m.id !== performanceCardKey);
    }
    newModules.push({
      id: performanceCardKey,
      data: moduleData,
      selected: true,
    });

    onUpdate({
      performanceModules: newModules,
    });
  };

  const renderPerformanceCard = (card, perfCard) => {
    const { id, key, requiresSetup, SetupComponent } = card;
    const { Name, Description } = perfCard;
    const perfModule = performanceModules.find(
      m => m.id === key || m.id === id,
    );
    let selected = false;
    let moduleData = {};
    if (perfModule) {
      selected = true;
      moduleData = perfModule.data || {};
      if ('selected' in perfModule) {
        selected = perfModule.selected;
      }
    }

    let setupComponent = null;
    if (SetupComponent) {
      setupComponent = (
        <SetupComponent
          {...moduleData}
          moduleUpdated={data => handleModuleUpdated(card.key, data)}
        />
      );
    }

    return (
      <PerformanceCard
        key={key}
        title={Name}
        description={Description}
        isSelected={selected}
        requiresSetup={requiresSetup && !Object.keys(moduleData).length}
        toggleModule={event => handledToggled(key, event)}
        setupComponent={setupComponent}
      />
    );
  };

  const getPerformanceModules = rowNum => {
    const supportModuleIds = supportedPerfModules.map(m => m.id);
    const supportedModuleIdToObj = supportedPerfModules.reduce((res, mod) => {
      res[mod.id] = mod;
      return res;
    }, {});
    supportedPerfModules.forEach(m => m.id);
    return PerformanceCardData.filter(
      card =>
        card.row === rowNum && (!card.id || supportModuleIds.includes(card.id)),
    ).map(card => renderPerformanceCard(card, supportedModuleIdToObj[card.id]));
  };

  const renderComponent = () => (
    <div>
      {[...Array(rows).keys()].map(rowNum => (
        <Box
          key={`row${rowNum}`}
          width={1}
          display="flex"
          flexWrap="wrap"
          flexDirection="row"
        >
          {getPerformanceModules(rowNum)}
        </Box>
      ))}
    </div>
  );

  return renderComponent();
}

PerformanceTab.propTypes = {
  onUpdate: PropTypes.func.isRequired,
  openSignupModal: PropTypes.func.isRequired,
  supportedPerfModules: PropTypes.arrayOf(PropTypes.object),
  performanceModules: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
    }),
  ),
  user: userPropType.isRequired,
};

PerformanceTab.defaultProps = {
  performanceModules: [],
  supportedPerfModules: [],
};

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  openSignupModal: () => dispatch(openAuthModal('signUp')),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PerformanceTab);
