const confirmSignInStyles = {
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
    padding: '32px 32px 24px 32px',
  },
  confirmForm: {
    marginTop: 24,
  },
  divider: {
    margin: '16px 0px',
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
  navigationActionsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  link: {
    cursor: 'pointer',
    color: '#546e7a',
  },
};

export default confirmSignInStyles;
