import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withStyles, styled } from '@material-ui/core/styles';
import { IconButton, Box, SvgIcon } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import { ArrowForward, Clear, GetApp } from '@material-ui/icons';
import { Edit as EditIcon, Navigation as NavigationIcon } from 'react-feather';
import Link from '../Link';
import { Image } from '../../constants/dataTypes';
import * as UserUtils from '../../utils/UserUtils';
import * as ReduxType from '../../store/reduxTypes';
import {
  ImageRendererProps,
  LiveCheckRendererProps,
  CampaignActionsRendererProps,
  CampaignNameRendererProps,
  ActionsRendererProps,
  InvoiceActionRendererProps,
  FilesActionsRendererProps,
} from './types';
import { ClientTableRowModal } from '../../store/clients/types';

const StyledImageRendererContainer = styled(Box)({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const ImageRenderer = ({ value = [] }: ImageRendererProps) => (
  <StyledImageRendererContainer>
    {value.map((img: Image, idx: number) => (
      <img
        key={`${img.id}`}
        src={img.thumbnails ? img.thumbnails.small.url : img.url}
        alt={`${img.id} ${idx}`}
        width="45%"
      />
    ))}
  </StyledImageRendererContainer>
);

const GreenCheckbox = withStyles({
  root: {
    color: green.A200,
    '&$checked': {
      color: green.A400,
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color="default" {...props} />);

export const LiveCheckRenderer: React.FC<LiveCheckRendererProps> = ({
  value = false,
  handleClick,
}: LiveCheckRendererProps) => {
  const [checked, setChecked] = useState(value);

  const handleCheckboxClicked = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setChecked(event.target.checked);
    if (event.target.checked) {
      handleClick();
    }
  };

  return <GreenCheckbox checked={checked} onChange={handleCheckboxClicked} />;
};

const mapStateToCampaignActionProps = (state: ReduxType.RootState) => ({
  user: state.user,
});

export const CampaignActionRenderer = connect(mapStateToCampaignActionProps)(
  ({ data, user, handleRemoveBtnClick }: CampaignActionsRendererProps) => {
    const campaignId = data.campaignName || data.id;
    let path = `/create?id=${campaignId}&type=campaign`;
    if (UserUtils.IsClient(user)) {
      path = `/package?id=${data.packageId}&campaignId=${campaignId}`;
    }
    return (
      <>
        <Link to={path}>
          <IconButton size="small">
            <SvgIcon>
              <EditIcon />
            </SvgIcon>
          </IconButton>
        </Link>
        <IconButton size="small" onClick={() => handleRemoveBtnClick(data)}>
          <Clear />
        </IconButton>
      </>
    );
  },
);

interface ClientActionsRendererProps {
  data: ClientTableRowModal;
  handleClickRemove: (data: ClientTableRowModal) => void;
  handleClickEdit: (data: ClientTableRowModal) => void;
  handleClickInvite?: (data: ClientTableRowModal) => void;
}

export const ClientActionRenderer = connect(mapStateToCampaignActionProps)(
  ({
    data,
    handleClickRemove,
    handleClickEdit,
    handleClickInvite,
  }: ClientActionsRendererProps) => (
    <>
      <IconButton size="small" onClick={() => handleClickEdit(data)}>
        <SvgIcon>
          <EditIcon />
        </SvgIcon>
      </IconButton>
      <IconButton size="small" onClick={() => handleClickRemove(data)}>
        <Clear />
      </IconButton>
      {data.status !== 'Active' && handleClickInvite && (
        <IconButton size="small" onClick={() => handleClickInvite(data)}>
          <SvgIcon>
            <NavigationIcon />
          </SvgIcon>
        </IconButton>
      )}
    </>
  ),
);

export const CampaignNameRenderer = ({ data }: CampaignNameRendererProps) => (
  <Link
    to={`/create-ad?name=${data.campaignName || data.id}&step=edit_campaign`}
  >
    {data.displayName || data.name}
  </Link>
);

export const ActionsRenderer = ({
  removeItem,
  params,
}: ActionsRendererProps) => {
  const url = window.location;
  const baseUrl = `${url.protocol}//${url.host}`;
  return (
    <>
      <Link to={`/create?id=${params.data.id}&type=package`}>
        <IconButton size="small">
          <SvgIcon>
            <EditIcon />
          </SvgIcon>
        </IconButton>
      </Link>

      <IconButton size="small" onClick={removeItem}>
        <Clear />
      </IconButton>
      {/* <CopyToClipboard>
        {({ copy }) => (
          <IconButton
            size="small"
            onClick={() => copy(`${baseUrl}/package?id=${params.data.id}`)}
          >
            <SvgIcon><ShareLinkIcon /></SvgIcon>
          </IconButton>
        )}
      </CopyToClipboard> */}
      <IconButton
        size="small"
        onClick={() =>
          window.open(`${baseUrl}/package?id=${params.data.id}`, '_blank')
        }
      >
        <ArrowForward />
      </IconButton>
    </>
  );
};

export const InvoiceActionRenderer = ({ data }: InvoiceActionRendererProps) => (
  <IconButton
    size="small"
    onClick={() => window.open(data.hosted_invoice_url, '_blank')}
  >
    <ArrowForward />
  </IconButton>
);

export const FilesActionsRenderer = ({
  removeFile,
  params,
}: FilesActionsRendererProps) => (
  <>
    <a target="_blank" rel="noopener noreferrer" href={params.data.fileUrl}>
      <IconButton size="small">
        <GetApp />
      </IconButton>
    </a>
    <IconButton size="small" onClick={removeFile}>
      <Clear />
    </IconButton>
  </>
);
