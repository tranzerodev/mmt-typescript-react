const registerStyles = {
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
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
  form: {
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
  link: {
    cursor: 'pointer',
    color: '#546e7a',
  },
  policyError: {
    width: '100%',
    margin: '0 8px',
  },
  checkboxWrapper: {
    margin: 0,
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
  gridContainer: {
    '& >.MuiGrid-item': {
      '@media (max-width: 599px)': {
        paddingTop: 0,
        paddingBottom: 0,
      },
    },
  },
};

export default registerStyles;
