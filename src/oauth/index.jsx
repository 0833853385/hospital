import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../common/redux/store';
import { setAuthenticated, clearAuthentication, setTokens, clearTokens } from './oauth.slice';
import './index.scoped.scss';
import { Button } from '@mui/material';

const getOauthGoogleUrl = () => {
  const { VITE_GOOGLE_CLIENT_ID, VITE_GOOGLE_AUTHORIZED_REDIRECT_URI } = import.meta.env;
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const options = {
    redirect_uri: VITE_GOOGLE_AUTHORIZED_REDIRECT_URI,
    client_id: VITE_GOOGLE_CLIENT_ID,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
  };
  const qs = new URLSearchParams(options);
  return `${rootUrl}?${qs.toString()}`;
};

const OAuthContainer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.oauth.isAuthenticated);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get('code');

      if (code) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_BASE_URL}/api/oauth/google/callback`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ code }),
            }
          );

          const data = await response.json();
          dispatch(
            setTokens({ access_token: data.access_token, refresh_token: data.refresh_token })
          );
          dispatch(setAuthenticated(true));
          navigate('/');
        } catch (error) {
          console.error('Error during OAuth callback:', error);
        }
      }
    };

    handleOAuthCallback();
  }, [location, navigate, dispatch]);

  const oauthURL = getOauthGoogleUrl();
  const logout = () => {
    dispatch(clearTokens());
    dispatch(clearAuthentication());
    window.location.reload();
  };

  return (
    <div className="login-signup m-auto w-50">
      <div className="form__container d-flex flex-column w-75 justify-content-center align-items-center">
        <h1 className="fw-bold mb-4">OAuth Google</h1>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Corporis alias harum ipsam
          labore numquam vitae ullam incidunt voluptatum, nisi, consequatur assumenda totam ab magni
          omnis distinctio, vero corrupti possimus facilis!
        </p>
        <div className="w-100">
          {isAuthenticated ? (
            <div className="text-center">
              <p>Xin chào, bạn đã login thành công</p>
              <Button variant="primary" onClick={logout}>
                Click để logout
              </Button>
            </div>
          ) : (
            <Button
              variant="contained"
              onClick={() => (window.location.href = oauthURL)}
              className="btn btn-primary w-100 mb-3"
            >
              Login with Google
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OAuthContainer;
