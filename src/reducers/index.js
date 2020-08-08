import { combineReducers } from 'redux';
import endpoints from '../store/endpoints/reducers';
import experiences from '../store/experiences/reducers';
import metrics from '../store/metrics/reducers';
import options from '../store/options/reducers';
import packages from '../store/packages/reducers';
import campaigns from '../store/campaigns/reducers';
import users from '../store/users/reducers';
import user from '../store/user/reducers';
import clients from '../store/clients/reducers';
import ui from '../store/ui/reducers';
import runtime from '../store/runtime/reducers';
import data from '../store/data/reducers';
import settings from '../store/settings/reducers';
import files from '../store/files/reducers';

export default combineReducers({
  campaigns,
  clients,
  endpoints,
  experiences,
  metrics,
  options,
  packages,
  users,
  user,
  ui,
  runtime,
  data,
  settings,
  files,
});
