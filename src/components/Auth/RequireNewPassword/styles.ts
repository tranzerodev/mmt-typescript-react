const requireNewPasswordStyles = {
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '@media (max-width: 992px)': {
      padding: '15px',
    },
  },
  container: {
    padding: 0,
  },
  card: {
    width: '960px',
    maxWidth: '100%',
    overflow: 'visible',
    display: 'flex',
    position: 'relative',
    '& > *': {
      flexGrow: 1,
      flexBasis: '50%',
      width: '50%',
    },
  },
  content: {
    padding: 32,
  },
  confirmForm: {
    marginTop: 24,
  },
  fields: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      flexGrow: 1,
    },
  },
  submitButton: {
    width: '100%',
    padding: '8px 16px',
  },
  buttonWrapper: {
    marginTop: 24,
  },
};

export default requireNewPasswordStyles;
