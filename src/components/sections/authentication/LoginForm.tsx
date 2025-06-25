import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import IconifyIcon from 'components/base/IconifyIcon';
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import paths from './../../../routes/path';
import { redirect } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from 'app/features/auth/authQuery';
// import { userDataLogin } from 'app/features/user/userSlice';
import Cookies from "js-cookie";

import { AppDispatch, persistor } from "app/store";
import { clearCredentials, setCredentials } from "app/features/auth/authSlice";

interface IFormInput {
  email: string;
  password: string;
}

const LoginForm = () => {
const dispatch = useDispatch()

// const user = useSelector()
  /**States */
  const navigate = useNavigate();
  const {pathname}= useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit } = useForm<IFormInput>();
  const url = import.meta.env.VITE_API_URL;
  /**Handlers */
  const handleClickShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  
  const [login, { isLoading }] = useLoginMutation();
  // const onSubmit: SubmitHandler<IFormInput> = async (data) => {
  //   try {
  //     const response = await axios.post(
  //       `${url}/admin/login`,
  //       data
  //     ).then((response)=>{
  //       if (response.data.token) {

  //         console.log(response)
          
  //         localStorage.setItem('token', response.data.token);
  //         toast.success('Sign-in successful, redirecting to dashboard...');
  //         dispatch(userDataLogin(response.data.token))
  
  //           navigate('/',{ replace: true, state: { from: 'previous-page' ,userData:response.data.data } });
      
  //       }
  //       else {
  //         setError('Login was successful, but no token was returned.');
  //       }
  //     }).catch((err)=>{
  //       setError(err.response ? err.response.data.message : 'An error occurred');
  //     })
  
  //     // console.log('Token:', response.data.token); // Check if token exists
  

  
  //   } catch (err) {

  //     console.log(err)
  //     setError(err.response ? err.response.data.message : 'An error occurred');
  //     // console.log(err.response || err); // Logs the actual error for debugging
  //   }
  // };
  
  // const onSubmit: SubmitHandler<IFormInput> = async (data) => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.post(`${url}/admin/login`, data);
      

      
      
  //     if (response.data.token) {

  //       // console.log(response.data.data.permissions)
  //       localStorage.setItem('token', response.data.token);
  //       toast.success('Sign-in successful, redirecting to dashboard...');
  //       dispatch(userDataLogin(response.data.token));
  //       localStorage.setItem('permissions', JSON.stringify(response.data.data.permissions));

  //       // setTimeout(()=>{
  //       //   // navigate('/', { replace: true, state: { from: pathname, userData: response.data.data } });


  //       // },5000)

  //       setTimeout(() => {
  //         location.replace("/");
  //       }, 2000);
  //     } else {
  //       setError('Login was successful, but no token was returned.');
  //     }
  //   } catch (err) {
  //     const errorMessage = err.response?.data?.message || 'An error occurred. Please try again.';
  //     setError(errorMessage);
  //     toast.error(errorMessage);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const onSubmit = async (formData: IFormInput) => {
    try {
      const response = await login(formData).unwrap();
      console.log(response);
      const token = response?.token;
      const user = {
        email: response?.data?.email,
        id: response?.data?.id,
        name: response?.data?.name,
        permissions:response?.data?.permissions

      };
      
      // localStorage.setItem('token', response?.token);
      // Cookies.set("authData", {token,user} , { expires: 7 });
      if (token && user) {
        dispatch(setCredentials({ token, user }));
        //   localStorage.setItem("useToken",token)

        navigate("/");
      console.error("Logied:", error);

      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  
console.log("reder/rerender")
  return (
    <>
      <Box
        sx={{
          mt: { sm: 5, xs: 2.5 },
        }}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Stack spacing={3}>
          <TextField
            fullWidth
            variant="outlined"
            id="email"
            type="text"
            label="Email"
            {...register('email', { required: 'Email is required' })}
          />
          <TextField
            fullWidth
            variant="outlined"
            id="password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...register('password', { required: 'Password is required' })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? (
                      <IconifyIcon icon="el:eye-close" color="action.active" />
                    ) : (
                      <IconifyIcon icon="el:eye-open" color="action.focus" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        {error && (
          <Typography color="error" variant="body2" mt={2}>
            {error}
          </Typography>
        )}

        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          type="submit"
          sx={{ mt: 3, fontSize: '18px' }}
        >
          Sign In
        </Button>
      </Box>
      <Toaster position="bottom-center" reverseOrder={false} />
    </>
  );
};

export default LoginForm;
