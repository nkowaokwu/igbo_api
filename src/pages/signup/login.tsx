import React from 'react';
import { useRouter } from 'next/router';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import Image from 'next/image';
import { Box, Button } from '@chakra-ui/react';
import { auth } from '../../services/firebase';
import getAWSAsset from '../utils/getAWSAsset';
import { getDeveloper, putDeveloper } from '../APIs/DevelopersAPI';

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider);
  GoogleAuthProvider.credentialFromResult(result);
  return result.user;
};

const Login = () => {
  const router = useRouter();

  const handleSignIn = async () => {
    const user = await signInWithGoogle();
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
      <Box className="flex flex-col justify-center items-center space-y-3 w-full" flex="10">
        <Button
          variant="outline"
          width="full"
          onClick={handleSignIn}
          py="6"
          mb="0"
          borderColor="gray.300"
          borderWidth="1px"
          leftIcon={
            <Image
              src={getAWSAsset('/icons/google.svg')}
              alt="Google icon"
              width="16"
              height="16"
            />
          }
        >
          Continue with Google
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
