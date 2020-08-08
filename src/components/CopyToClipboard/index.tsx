import * as React from 'react';
import copy from 'clipboard-copy';
import Tooltip, { TooltipProps } from '@material-ui/core/Tooltip';

interface ChildProps {
  copy: (content: any) => void;
}

interface Props {
  tooltipProps?: Partial<TooltipProps>;
  children: (props: ChildProps) => React.ReactElement<any>;
}

/**
 * Render prop component that wraps element in a Tooltip that shows "Copied to clipboard!" when the
 * copy function is invoked
 */
const CopyToClipboard: React.FC<Props> = ({ tooltipProps, children }) => {
  const [showTooltip, setShowTooltip] = React.useState(false);

  const onCopy = (content: any) => {
    copy(content);
    setShowTooltip(true);
  };

  const handleOnTooltipClose = () => {
    setShowTooltip(false);
  };

  return (
    <Tooltip
      open={showTooltip}
      title="Copied to clipboard!"
      leaveDelay={1500}
      onClose={handleOnTooltipClose}
      {...tooltipProps || {}}
    >
      {children({ copy: onCopy }) as React.ReactElement<any>}
    </Tooltip>
  );
};

export default CopyToClipboard;
