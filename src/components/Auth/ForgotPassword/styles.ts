const requireNewPasswordStyles = {
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
  divider: {
    margin: '16px 0px',
  },
  navigationActionsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  link: {
    cursor: 'pointer',
    color: '#546e7a',
  },
};

export default requireNewPasswordStyles;
