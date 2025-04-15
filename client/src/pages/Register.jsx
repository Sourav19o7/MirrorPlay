import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../redux/slices/authSlice';
import AuthForm from '../components/auth/AuthForm';

const Register = () => {
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
  
  const handleRegister = (userData) => {
    dispatch(register(userData))
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
      type="register"
      title="Create Account"
      submitText="Sign Up"
      onSubmit={handleRegister}
      loading={loading}
      error={error}
    />
  );
};

export default Register;