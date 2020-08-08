import { makeStyles, createStyles } from '@material-ui/core/styles';

interface PreviewSectionStyleProps {
  itemsPerRow: number;
}

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
      height: '340px',
      overflowX: 'hidden',
    },
    bigImageContainer: {
      backgroundColor: 'black',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      height: '340px',
      width: '417px',
      cursor: 'pointer',
    },
    secondaryImageContainer: {
      height: '160px',
      width: '320px',
      cursor: 'pointer',
      backgroundColor: 'black',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
    },
    primaryImages: {
      '& > div': {
        marginRight: 'var(--default-space)',
      },
    },
    secondaryImages: {
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'wrap',
      marginTop: 'var(--default-space-neg)',
      marginLeft: 'var(--default-space-neg)',
      '& > div': {
        marginTop: 'var(--default-space)',
        marginLeft: 'var(--default-space)',
      },
    },
    secondaryImagesContainer: (props: PreviewSectionStyleProps) => ({
      width: `${props.itemsPerRow * 320 - 1}px`,
    }),
  }),
);

export default useStyles;
