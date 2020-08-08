export const primaryColor = '#e1583d';
const textColor = '#25282c';

export const Container = {};

export const CenteredContainer = {
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  justifyContent: 'center',
};

export const NavBar = {
  position: 'relative',
  marginBottom: '20px',
  marginLeft: '-15px',
  marginRight: '-15px',
  border: '1px solid transparent',
  backgroundColor: '#f8f8f8',
  borderColor: '#e7e7e7',
};

export const NavRight = {
  textAlign: 'right',
};

export const Nav = {
  margin: '7.5px',
};

export const NavItem = {
  display: 'inline-block',
  padding: '10px 5px',
  lineHeight: '20px',
};

export const NavButton = {
  display: 'inline-block',
  padding: '6px 12px',
  marginTop: '8px',
  marginBottom: '8px',
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: '1.42857143',
  textAlign: 'center',
  whiteSpace: 'nowrap',
  verticalAlign: 'middle',
  touchAction: 'manipulation',
  cursor: 'pointer',
  userSelect: 'none',
  backgroundImage: 'none',
  border: '1px solid transparent',
  borderRadius: '4px',
  color: '#333',
  backgroundColor: '#fff',
  borderColor: '#ccc',
};

export const FormContainer = {
  textAlign: 'center',
};

export const FormSection = {
  marginBottom: '20px',
  backgroundColor: '#fff',
  textAlign: 'left',
  width: '400px',
  display: 'inline-block',
};

export const ErrorSection = {
  marginBottom: '20px',
  backgroundColor: '#F3CDCD',
  border: '1px solid #F3CDCD',
  borderRadius: '4px',
  textAlign: 'left',
};

export const SectionHeader = {
  color: '#fff',
  backgroundColor: primaryColor,
  borderColor: primaryColor,
  padding: '10px 15px',
  borderBottom: '1px solid transparent',
  borderTopLeftRadius: '3px',
  borderTopRightRadius: '3px',
  textAlign: 'center',
};

export const SectionFooter = {
  color: '#333',
  backgroundColor: '#f5f5f5',
  padding: '10px 15px',
  borderTop: '1px solid #ddd',
  borderTopLeftRadius: '3px',
  borderTopRightRadius: '3px',
};

export const SectionBody = {
  padding: '15px',
};

export const FormRow = {
  marginBottom: '15px',
};

export const ActionRow = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '15px',
};

export const Input = {
  display: 'block',
  width: '100%',
  height: '34px',
  padding: '6px 0',
  fontSize: '14px',
  lineHeight: '1.42857143',
  color: textColor,
  backgroundColor: '#fff',
  backgroundImage: 'none',
  border: 'none',
  borderBottom: '1px solid #ccc',
  boxSizing: 'border-box',
  transition: 'border-color ease-in-out .15s,box-shadow ease-in-out .15s',
  outline: 'none',
};

export const Button = {
  display: 'inline-block',
  padding: '6px 12px',
  marginBottom: '0',
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: '1.42857143',
  textAlign: 'center',
  whiteSpace: 'nowrap',
  verticalAlign: 'middle',
  touchAction: 'manipulation',
  cursor: 'pointer',
  userSelect: 'none',
  backgroundImage: 'none',
  border: '1px solid transparent',
  borderRadius: '4px',
  color: '#333',
  backgroundColor: '#fff',
  borderColor: '#ccc',
  width: '100px',
};

export const SignInButton = {
  position: 'relative',
  padding: '6px 12px 6px 44px',
  fontSize: '14px',
  textAlign: 'left',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: 'block',
  width: '100%',
  marginTop: '2px',
};

export const Space = {
  display: 'inline-block',
  width: '20px',
};

export const A = {
  color: '#007bff',
  cursor: 'pointer',
};

export const Pre = {
  overflow: 'auto',
  fontFamily: `Menlo,
                Monaco,
                Consolas,
                "Courier New",
                monospace`,
  display: 'block',
  padding: '9.5px',
  margin: '0 0 10px',
  fontSize: '13px',
  lineHeight: '1.42857143',
  color: '#333',
  wordBreak: 'break-all',
  wordWrap: 'break-word',
  backgroundColor: '#f5f5f5',
  border: '1px solid #ccc',
  borderRadius: '4px',
};

export const Col1 = {
  display: 'inline-block',
  width: '8.33333333%',
};

export const Col2 = {
  display: 'inline-block',
  width: '16.66666667%',
};

export const Col3 = {
  display: 'inline-block',
  width: '25%',
};

export const Col4 = {
  display: 'inline-block',
  width: '33.33333333%',
};

export const Col5 = {
  display: 'inline-block',
  width: '41.66666667%',
};

export const Col6 = {
  display: 'inline-block',
  width: '50%',
};

export const Col7 = {
  display: 'inline-block',
  width: '58.33333333%',
};

export const Col8 = {
  display: 'inline-block',
  width: '66.66666667%',
};

export const Col9 = {
  display: 'inline-block',
  width: '75%',
};

export const Col10 = {
  display: 'inline-block',
  width: '83.33333333%',
};

export const Col11 = {
  display: 'inline-block',
  width: '91.66666667%',
};

export const Col12 = {
  display: 'inline-block',
  width: '100%',
};

export const PickerButton = {
  backgroundColor: primaryColor,
  borderRadius: '25px',
  color: '#fff',
  height: '41px',
  width: '180px',
  fontSize: '19px',
  padding: '0',
};

export const PhotoImg = {
  height: '100px',
  objectFit: 'cover',
  objectPosition: 'top',
  width: '300px',
};

export const LoadingContainer = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '15px',
};

const Bootstrap = {
  primaryColor,
  container: Container,
  centeredContainer: CenteredContainer,

  navBar: NavBar,
  nav: Nav,
  navRight: NavRight,
  navItem: NavItem,
  navButton: NavButton,

  formContainer: FormContainer,
  formSection: FormSection,
  errorSection: ErrorSection,
  sectionHeader: SectionHeader,
  sectionBody: SectionBody,
  sectionFooter: SectionFooter,

  formRow: FormRow,
  actionRow: ActionRow,

  space: Space,

  signInButton: SignInButton,

  input: Input,
  button: Button,
  a: A,
  pre: Pre,

  col1: Col1,
  col2: Col2,
  col3: Col3,
  col4: Col4,
  col5: Col5,
  col6: Col6,
  col7: Col7,
  col8: Col8,
  col9: Col9,
  col10: Col10,
  col11: Col11,
  col12: Col12,

  pickerButton: PickerButton,
  photoImg: PhotoImg,
  loadingContainer: LoadingContainer,
};

export default Bootstrap;
