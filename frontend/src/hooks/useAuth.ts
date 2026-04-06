import { useAppSelector } from '@/store/hooks';

export const useAuth = () => {
  const { user, token, isAuthenticated, isHydrated } = useAppSelector((state) => state.auth);

  return {
    user,
    token,
    isAuthenticated,
    isHydrated,
    isGuest: !isAuthenticated,
  };
};
