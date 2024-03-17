import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../../services/firebase';

const AuthManager = ({ children }: { children: any }) => {
  const router = useRouter();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [router, user]);

  return children;
};

export default AuthManager;
