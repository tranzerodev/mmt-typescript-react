import React from 'react';
import styled from 'styled-components';

type TabBodyProps = {
  includePadding: boolean;
  includePaddingHorizontal: boolean;
};

const TabBody = styled.div`
  padding-top: ${(props: TabBodyProps) =>
    props.includePadding ? '30px' : '0'};
  padding-bottom: ${(props: TabBodyProps) =>
    props.includePadding ? '30px' : '0'};
  padding-left: ${(props: TabBodyProps) =>
    props.includePaddingHorizontal ? '30px' : '0'};
  padding-right: ${(props: TabBodyProps) =>
    props.includePaddingHorizontal ? '30px' : '0'};
`;

type TabPanelProps = {
  tabKey: string | number;
  selectedTab: string | number;
  disableSpace: boolean;
  horizontalSpace: boolean;
};

const TabPanel: React.FC<TabPanelProps> = ({
  children,
  tabKey,
  selectedTab,
  disableSpace = false,
  horizontalSpace = false,
}) =>
  tabKey === selectedTab ? (
    <TabBody
      includePadding={!disableSpace}
      includePaddingHorizontal={!disableSpace && horizontalSpace}
    >
      {children}
    </TabBody>
  ) : null;

export default TabPanel;
