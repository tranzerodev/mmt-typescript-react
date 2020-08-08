import { Auth } from 'aws-amplify';

export interface AutoSignInProps {
  username: string;
  password: string;
}

const autoSignIn = (userData: AutoSignInProps) => {
  const { username, password } = userData;
  const signIn = async () => {
    try {
      await Auth.signIn({
        username,
        password,
      });
      window.location.href = '/';
      return null;
    } catch (error) {
      return null;
    }
  };

  signIn();
};

export default autoSignIn;
