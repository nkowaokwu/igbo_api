import React from 'react';
import { useRouter } from 'next/router';
import { signInWithPopup, GoogleAuthProvider, GithubAuthProvider, User } from 'firebase/auth';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { Box, Button } from '@chakra-ui/react';
import { auth } from '../../services/firebase';
import { getDeveloper, putDeveloper } from '../APIs/DevelopersAPI';

const googleProvider = new GoogleAuthProvider();
const gitHubProvider = new GithubAuthProvider();

export const signInWithGitHub = async () => {
  const result = await signInWithPopup(auth, gitHubProvider);
  GithubAuthProvider.credentialFromResult(result);
  return result.user;
};

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  GoogleAuthProvider.credentialFromResult(result);
  return result.user;
};

const loginConfigs = [
  {
    label: 'Continue with GitHub',
    Icon: FaGithub,
    callback: signInWithGitHub,
  },
  {
    label: 'Continue with Google',
    Icon: FcGoogle,
    callback: signInWithGoogle,
  },
];

const Login = () => {
  const router = useRouter();

  const handleSignIn = (signInMethod: () => Promise<User>) => async () => {
    const user = await signInMethod();
    try {
      await putDeveloper(user);
    } catch (err) {
      await getDeveloper(user.uid);
    } finally {
      router.push('/dashboard');
    }
  };

  return (
    <Box>
      <Box className="flex flex-col justify-center items-center space-y-3 w-full">
        {loginConfigs.map(({ label, Icon, callback }) => (
          <Button
            key={label}
            variant="outline"
            width="full"
            onClick={handleSignIn(callback)}
            py="6"
            mb="2"
            borderColor="gray.300"
            borderWidth="1px"
            leftIcon={<Icon />}
          >
            {label}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default Login;
