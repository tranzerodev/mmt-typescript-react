import PropTypes from 'prop-types';
import { Package } from '../packages/types';

export const PackagePropType = PropTypes.shape({});

export const LOAD_EXPERIENCES_REQUEST = 'LOAD_EXPERIENCES_REQUEST';
export const LOAD_EXPERIENCES_SUCCESS = 'LOAD_EXPERIENCES_SUCCESS';
export const LOAD_EXPERIENCES_FAILURE = 'LOAD_EXPERIENCES_FAILURE';

export interface ExperiencesState {
  items: Package[];
  loadingPackage?: boolean;
  loadingFeed: boolean;
  error?: string;
  feedInitialized: boolean;
}

export interface ExperiencesResponse {
  status: string;
  data: Package[];
}

export interface ExperiencesFilterOptions {
  featured?: string;
  horizontal: boolean;
  section: string;
}

export interface ExperiencesParmas {
  title: string;
  filterOptions: ExperiencesFilterOptions;
  id: number;
}

interface StartLoadExperiencesAction {
  type: typeof LOAD_EXPERIENCES_REQUEST;
}

interface LoadExperiencesDoneAction {
  type: typeof LOAD_EXPERIENCES_SUCCESS;
  experiences: Package[];
}

interface LoadExperiencesFailAction {
  type: typeof LOAD_EXPERIENCES_FAILURE;
  error: string;
}

export type ExperiencesActionTypes =
  | StartLoadExperiencesAction
  | LoadExperiencesDoneAction
  | LoadExperiencesFailAction;
