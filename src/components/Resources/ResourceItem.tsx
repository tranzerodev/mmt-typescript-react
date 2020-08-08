import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { blue } from '@material-ui/core/colors';
import moment from 'moment';
import UserAvatar from '../User/UserAvatar';
import { Resource } from '../../store/data/types';
import { User } from '../../store/users/types';
import { getFieldValue } from '../../utils/UserUtils';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      maxWidth: '100%',
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    cardContent: {
      marginTop: theme.spacing(1),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    avatar: {
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
    tags: {
      marginTop: theme.spacing(2),
    },
    tag: {
      backgroundColor: theme.palette.primary.main,
      color: 'white',
      padding: `${theme.spacing(0.5)}px ${theme.spacing(2)}px`,
      borderRadius: theme.shape.borderRadius,
      margin: theme.spacing(1),
      cursor: 'pointer',
      '&:first-child': {
        marginLeft: 0,
      },
    },
    ownerName: {
      color: blue[300],
    },
    resourceItemText: {
      color: '#25283c',
    },
  }),
);

const ResourceItem = ({
  resource: { fields },
  handleSelectTag,
  findOwner,
}: {
  resource: Resource;
  handleSelectTag: (value: string) => void;
  findOwner: (value: string) => User | undefined;
}) => {
  const classes = useStyles();
  const { title, lastModified, ownerEmail, tags, body } = fields;
  const owner = findOwner(ownerEmail);
  const userFullName = owner
    ? `${getFieldValue(owner, 'given_name')} ${getFieldValue(
        owner,
        'family_name',
      )}`
    : '';

  const avatar = owner ? getFieldValue(owner, 'picture') : '';
  console.info('Avatar url for user:', ownerEmail, avatar);

  return (
    <Card className={classes.root} variant="outlined">
      <CardHeader
        avatar={
          <UserAvatar
            avatarUrl={avatar}
            name={userFullName}
            showName={false}
            type="image"
          />
        }
        title={
          <Typography variant="h5" className={classes.resourceItemText}>
            {title}
          </Typography>
        }
        subheader={
          <Typography variant="body2" color="textSecondary" component="p">
            By <span className={classes.ownerName}>{userFullName}</span> |
            Updated {moment(lastModified).format('YYYY-MM-DD')}
          </Typography>
        }
      />
      <CardContent>
        <Typography
          variant="h5"
          component="p"
          className={classes.resourceItemText}
        >
          {body}
        </Typography>
        <Typography variant="body2" className={classes.tags} component="p">
          {tags.map((tag: string) => (
            <Typography
              key={tag}
              variant="body2"
              className={classes.tag}
              component="span"
              onClick={() => handleSelectTag(tag)}
            >
              {tag.toUpperCase()}
            </Typography>
          ))}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ResourceItem;
