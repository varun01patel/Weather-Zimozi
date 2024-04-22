import React from 'react';
import { styled } from '@mui/system';
import {
  TextField,
  Button,
  Card,
  CardContent,
  Box,
  Typography,
  Avatar,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../utils/firebase';
import { useState } from 'react';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const StyledCard = styled(Card)({
  maxWidth: '400px',
  padding: '40px',
  minWidth: '400px',
  borderRadius: '16px',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
});

const InputField = styled(TextField)({
  marginTop: '16px',
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: '#3f51b5',
    },
  },
});

const SubmitButton = styled(Button)({
  marginTop: '24px',
  backgroundImage: 'linear-gradient(to right, #3f51b5, #7986cb)',
  color: 'white',
  '&:hover': {
    backgroundImage: 'linear-gradient(to right, #7986cb, #3f51b5)',
  },
});

const Login = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState();
  const [isLoading, setIsLoading] = useState(false);

  // Define validation schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters long'),
  });

  // Submit handler
  const handleSubmit = (values, { setSubmitting }) => {
    setIsLoading(true);
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        localStorage.setItem('token', user.accessToken);
        navigate('/');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error);
        setErrors(errorMessage);
        setIsLoading(false);
      });
    setSubmitting(false);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="linear-gradient(45deg, #e0c3fc 0%, #8ec5fc 100%)"
      sx={{
        backgroundImage: 'linear-gradient(45deg, #e0c3fc 0%, #8ec5fc 100%)',
      }}
    >
      <StyledCard>
        <CardContent>
          <Avatar sx={{ m: '0 auto 16px', bgcolor: '#3f51b5' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h4" align="center" gutterBottom>
            Welcome Back
          </Typography>
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <Field
                  as={InputField}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  type="email"
                />
                <ErrorMessage name="email" component="div" style={{ color: 'red' }} />
                <Field
                  as={InputField}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="password"
                  label="Password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                />
                <ErrorMessage name="password" component="div" style={{ color: 'red' }} />
                {errors && <Box color="error.main">{errors}</Box>}
                <SubmitButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isSubmitting || isLoading}
                  endIcon={isLoading && <CircularProgress size={20} />}
                >
                  Sign In
                </SubmitButton>
              </Form>
            )}
          </Formik>
          <Box
            onClick={() => navigate('/signup')}
            sx={{ mt: '16px', cursor: 'pointer', textAlign: 'center' }}
          >
            <Typography variant="body2" color="text.secondary">
              Don't have an account? Sign Up Now!!
            </Typography>
          </Box>
        </CardContent>
      </StyledCard>
    </Box>
  );
};

export default Login;