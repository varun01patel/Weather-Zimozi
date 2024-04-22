import React, { useState } from 'react';
import { styled } from '@mui/system';
import {
  TextField,
  Button,
  Card,
  CardContent,
  Box,
  IconButton,
  InputAdornment,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../utils/firebase';

const StyledCard = styled(Card)({
  maxWidth: '400px',
  minWidth: '400px',
  padding: '40px',
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

const SignUp = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // Define validation schema using Yup
  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters long'),
  });

  // Submit handler
  const handleSubmit = (values, { setSubmitting }) => {
    console.log('Form values:', values);
    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        navigate('/login');
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setErrors(errorMessage);
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
          <Formik
            initialValues={{
              username: '',
              email: '',
              password: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <Typography variant="h4" align="center" gutterBottom>
                  Sign Up
                </Typography>
                <Field
                  as={InputField}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                />
                <ErrorMessage name="username" component="div" style={{ color: 'red' }} />
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
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <ErrorMessage name="password" component="div" style={{ color: 'red' }} />
                {errors && <Box color="error.main">{errors}</Box>}
                <SubmitButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isSubmitting}
                >
                  Sign Up
                </SubmitButton>
              </Form>
            )}
          </Formik>
          <Box
            onClick={() => navigate('/login')}
            sx={{ mt: '16px', cursor: 'pointer', textAlign: 'center' }}
          >
            <Typography variant="body2" color="text.secondary">
              Already have an account? Log In Now!!
            </Typography>
          </Box>
        </CardContent>
      </StyledCard>
    </Box>
  );
};

export default SignUp;