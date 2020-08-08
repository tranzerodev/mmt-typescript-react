const loginStyles = {
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
  icon: {
    backgroundImage: 'linear-gradient(180deg, #66bb6a 0%, #43a047 100%)',
    color: '#fff',
    borderRadius: 4,
    padding: 15,
    position: 'absolute',
    top: -32,
    left: 24,
    height: 35,
    width: 35,
  },
  content: {
    padding: '64px 32px 24px 32px',
  },
  media: {
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    padding: 24,
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    '@media (max-width: 1279px)': {
      display: 'none',
    },
  },
  loginForm: {
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
  spinnerLayout: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 15,
    marginTop: 15,
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

export default loginStyles;
