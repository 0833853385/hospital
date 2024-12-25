import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from '../../common/redux/store';
import { setAuthenticated, setUser, setTokens } from '../oauth.slice';

export default function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const access_token = searchParams.get('access_token');
    const refresh_token = searchParams.get('refresh_token');
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');
    if (access_token && refresh_token) {
      dispatch(setTokens({ access_token, refresh_token }));
      dispatch(setUser({ userId, email }));
      dispatch(setAuthenticated(true));
      navigate('/');
    }
  }, [searchParams, navigate, dispatch]);

  return <div>Login</div>;
}
