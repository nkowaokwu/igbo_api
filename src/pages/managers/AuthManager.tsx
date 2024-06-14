import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../services/firebase';

const AuthManager = ({ children }: { children: any }) => {
  const router = useRouter();
  const [user, isLoading] = useAuthState(auth);

  useEffect(() => {
    if (!user && !isLoading) {
      router.push('/signup');
    }
  }, [router, user, isLoading]);

  return children;
};

export default AuthManager;
