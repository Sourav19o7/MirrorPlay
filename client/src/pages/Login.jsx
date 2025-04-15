import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../redux/slices/authSlice';
import AuthForm from '../components/auth/AuthForm';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(state => state.auth);
  
  React.useEffect(() => {
    // Clear any previous errors
    dispatch(clearError());
    
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [dispatch, navigate, isAuthenticated]);
  
  const handleLogin = (credentials) => {
    dispatch(login(credentials))
      .unwrap()
      .then(() => {
        navigate('/dashboard');
      })
      .catch(() => {
        // Error is handled in the reducer
      });
  };
  
  return (
    <AuthForm
      type="login"
      title="Sign In"
      submitText="Sign In"
      onSubmit={handleLogin}
      loading={loading}
      error={error}
    />
  );
};

export default Login;