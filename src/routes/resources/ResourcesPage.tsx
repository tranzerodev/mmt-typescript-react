import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Box, Grid } from '@material-ui/core';
import { PageContent, PageTitle } from '../../components/UI';
import { RouteContext } from '../../context';
import * as ReduxType from '../../store/reduxTypes';
import { Resources, useResourceForm } from '../../components/Resources';
import SearchInput from '../../components/SearchInput/SearchInput';
import Tags from '../../components/Resources/Tags';
import { User } from '../../constants/dataTypes';
import { saveResources } from '../../store/data/actions';
import { initialResource } from '../../store/data/reducers';
import { FormModal } from '../../components/Modals';

interface ResourcesPageQueryParams {
  tag: string;
  q: string;
}

const mapStateToProps = (state: ReduxType.RootState) => ({
  userId: state.user.id,
  resources: state.data.resources,
  resourceUsers: state.data.resourceUsers,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type EmailtoUserMap = Record<string, User>;

const emptyEmailToUserMap: EmailtoUserMap = {};

const ResourcesPage: React.FC<PropsFromRedux> = ({
  resources,
  resourceUsers,
}) => {
  const { query } = React.useContext(RouteContext);
  const { tag, q }: ResourcesPageQueryParams = query as any;

  const [renderingResources, setRenderingResources] = React.useState(resources);
  const [keyword, setKeyword] = React.useState(q || '');
  const [searchingTag, setSearchingTag] = React.useState(
    tag || 'top questions',
  );

  const [emailToUserMap, setEmailToUserMap] = React.useState(
    emptyEmailToUserMap,
  );

  React.useEffect(() => {
    const emailToUser = emptyEmailToUserMap;
    resourceUsers.forEach((user: User) => {
      user.Attributes.forEach(att => {
        if (att.Name === 'email') {
          emailToUser[att.Value] = user;
        }
      });
    });
    setEmailToUserMap(emailToUser);
  }, [resourceUsers]);

  const findOwner = (email: string) => {
    if (!resourceUsers) return;
    // eslint-disable-next-line consistent-return
    return emailToUserMap[email];
  };

  React.useEffect(() => {
    let records = resources;
    if (searchingTag) {
      records = records.filter(resource =>
        resource.fields.tags.includes(searchingTag),
      );
    }

    if (keyword) {
      records = records.filter(
        resource =>
          resource.fields.title.includes(keyword) ||
          resource.fields.tags.join(' ').includes(keyword) ||
          resource.fields.body.includes(keyword),
      );
    }

    setRenderingResources(records);
  }, [keyword, searchingTag]);

  const handleSearchChange = (value: string) => {
    setKeyword(value);
  };

  const handleSelectTag = (value: string) => {
    if (value) setSearchingTag(value);
  };

  const availableTags = () => {
    if (resources.length === 0) return [];
    let tags: string[] = [];
    resources.forEach(resource => {
      tags = [...tags, ...resource.fields.tags];
    });

    return [...new Set(tags)];
  };

  return (
    <PageContent>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <PageTitle title="Resources" />
        <Box display="flex" justifyContent="space-between">
          <Box mr={4}>
            <SearchInput handleChange={handleSearchChange} />
          </Box>
          <FormModal
            initialFormValue={initialResource}
            entityName="Resource"
            saveAction={saveResources}
            useFormHook={useResourceForm}
            newButton
          />
        </Box>
      </Grid>
      <Tags
        tags={availableTags()}
        handleSelectTag={handleSelectTag}
        selectedTag={searchingTag}
      />
      <Resources
        resources={renderingResources}
        handleSelectTag={handleSelectTag}
        findOwner={findOwner}
      />
    </PageContent>
  );
};

export default connector(ResourcesPage);
