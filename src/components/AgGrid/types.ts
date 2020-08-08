import { Image } from '../../constants/dataTypes';

export interface LiveCheckRendererProps {
  value: boolean;
  handleClick: () => void;
}

export interface CampaignActionsRendererProps {
  data: {
    id: string;
    campaignName: string;
  };
  handleRemoveBtnClick: (data: any) => void;
}

export interface CampaignNameRendererProps {
  data: {
    id: string;
    campaignName: string;
    name: string;
    displayName: string;
  };
}

export interface InvoiceActionRendererProps {
  data: {
    hosted_invoice_url: string;
  };
}

export interface ActionsRendererProps {
  removeItem: (params: any) => void;
  params: any;
}

export interface ImageRendererProps {
  value: Image[];
}

export interface FilesActionsRendererProps {
  removeFile: (params: any) => void;
  params: any;
}
