import { Action } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { PackagesState } from './packages/types';
import { OptionsState } from './options/types';
import { CampaignsState } from './campaigns/types';
import { ExperiencesState } from './experiences/types';
import { UiState } from './ui/types';
import { UsersState } from './users/types';
import { ClientsState } from './clients/types';
import { UserState } from './user/types';
import { DataState } from './data/types';
import { SettingsState } from './settings/types';
import { MetricsState } from './metrics/types';
import { FilesState } from './files/types';

export interface RootState {
  campaigns: CampaignsState;
  // creatives,
  endpoints: any;
  experiences: ExperiencesState;
  metrics: MetricsState;
  packages: PackagesState;
  options: OptionsState;
  user: UserState;
  users: UsersState;
  clients: ClientsState;
  ui: UiState;
  data: DataState;
  settings: SettingsState;
  files: FilesState;
  // runtime,
}

export type AppThunkAction<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action
>;

export type AppThunkDispatch = ThunkDispatch<RootState, unknown, Action>;
