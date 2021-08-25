import { useAppAction } from '@state/hooks';
import { userLogin } from './AuthThunks';

export const useAuthLogin = () => useAppAction(userLogin);
